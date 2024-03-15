<template>
  <div class="app-container">
    <div class="table">
      <div class="table-title-box">
        <div class="title-name">通知列表</div>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="primary"
              plain
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd"
              v-hasPermi="['worship:notificationRelease:add']"
              >新增</el-button
            >
          </el-col>

          <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </div>

      <el-table
        v-loading="loading"
        :data="notificationReleaseList"
        @selection-change="handleSelectionChange"
        height="60vh"
      >
        <el-table-column type="selection" width="55" align="center" />
        <!-- 
        <el-table-column label="Banner图片" align="center" prop="createName">
          <template slot-scope="{ row }">
            <div>
              <el-image
                style="width: 100px; height: 100px"
                :src="row.fileList[0].url"
                :preview-src-list="row.fileList.map((item) => item.url)"
              >
              </el-image>
            </div>
          </template>
        </el-table-column> -->

        <el-table-column label="标题" align="center" prop="title" />
        <el-table-column label="内容" align="center" prop="content">
          <template slot-scope="{ row }">
            <div class="table-content">
              <span v-if="row.content.length <= 100"> {{ row.content }}</span>
              <span v-else :title="row.content"> {{ row.content.slice(0, 100) }}......</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="已读人次" align="center" prop="readNum" />
        <el-table-column label="是否发布" align="center" prop="isRelease">
          <template slot-scope="{ row }">
            <div>
              <el-switch
                v-model="row.isRelease"
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-value="1"
                inactive-value="0"
                @change="changeSwitch(row)"
              >
              </el-switch>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="handleUpdate(scope.row, '查看详情')">详情</el-button>
            <el-button
              size="mini"
              type="text"
              @click="handleUpdate(scope.row, '修改通知发布')"
              v-hasPermi="['worship:notificationRelease:edit']"
              >修改</el-button
            >
            <el-button
              size="mini"
              type="text"
              @click="handleDelete(scope.row)"
              v-hasPermi="['worship:notificationRelease:remove']"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <pagination
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
    </div>

    <!-- 添加或修改通知发布对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="上传图片" prop="fileUrl">
          <image-upload :disabled="title === '查看详情'" v-model="form.fileUrl" />
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input
            :disabled="title === '查看详情'"
            maxlength="50"
            show-word-limit
            v-model="form.title"
            placeholder="请输入标题"
          />
        </el-form-item>
        <el-form-item label="内容">
          <editor v-if="open" :disabled="title === '查看详情'" v-model="form.content" :min-height="192" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="title !== '查看详情'" :loading="buttonLoading" type="primary" @click="submitForm"
          >确 定</el-button
        >
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listNotificationRelease,
  getNotificationRelease,
  delNotificationRelease,
  addNotificationRelease,
  updateNotificationRelease,
} from '@/api/worship/notificationRelease';

export default {
  name: 'NotificationRelease',
  data() {
    return {
      // 按钮loading
      buttonLoading: false,
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 通知发布表格数据
      notificationReleaseList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        type: 2,
      },
      // 表单参数
      form: {
        isRelease: 0,
      },
      // 表单校验
      rules: {
        fileUrl: [{ required: true, message: '图片不能为空', trigger: 'blur' }],
        id: [{ required: true, message: '主键不能为空', trigger: 'blur' }],
        type: [{ required: true, message: '类型(1:Banner 2:通知)不能为空', trigger: 'change' }],
        title: [{ required: true, message: '标题不能为空', trigger: 'blur' }],
        isRelease: [{ required: true, message: '是否发布(0:否 1:是 默认0)不能为空', trigger: 'blur' }],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询通知发布列表 */
    getList() {
      this.loading = true;
      listNotificationRelease(this.queryParams).then(async (response) => {
        this.notificationReleaseList = await this.imgPathFilter(response.rows);
        console.log(this.notificationReleaseList);

        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        createTime: undefined,
        createBy: undefined,
        updateTime: undefined,
        updateBy: undefined,
        createId: undefined,
        updateId: undefined,
        createName: undefined,
        updateName: undefined,
        delFlag: undefined,
        type: undefined,
        title: undefined,
        content: undefined,
        readNum: undefined,
        isRelease: undefined,
        fileUrl: undefined,
      };
      this.resetForm('form');
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm');
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = '添加通知';
    },
    /** 修改按钮操作 */
    handleUpdate(row, title) {
      this.loading = true;
      this.reset();
      const id = row.id || this.ids;
      getNotificationRelease(id).then((response) => {
        this.loading = false;
        this.form = response.data;
        this.open = true;
        this.title = title;
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.buttonLoading = true;
          this.form.type = 2;
          if (this.form.id != null) {
            updateNotificationRelease(this.form)
              .then((response) => {
                this.$modal.msgSuccess('修改成功');
                this.open = false;
                this.getList();
              })
              .finally(() => {
                this.buttonLoading = false;
              });
          } else {
            this.form.isRelease = 0;
            addNotificationRelease(this.form)
              .then((response) => {
                this.$modal.msgSuccess('新增成功');
                this.open = false;
                this.getList();
              })
              .finally(() => {
                this.buttonLoading = false;
              });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      const name = row.title ?? this.filterDelData(this.ids, this.notificationReleaseList, 'title');

      this.$modal
        .confirm('是否确认删除标题为"' + name + '"的数据项？')
        .then(() => {
          this.loading = true;
          return delNotificationRelease(ids);
        })
        .then(() => {
          this.loading = false;
          this.getList();
          this.$modal.msgSuccess('删除成功');
        })
        .catch(() => {})
        .finally(() => {
          this.loading = false;
        });
    },
    changeSwitch(row) {
      updateNotificationRelease(row)
        .then((response) => {
          this.$modal.msgSuccess('修改成功');
          this.open = false;
          this.getList();
        })
        .finally(() => {
          this.buttonLoading = false;
        });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        'worship/notificationRelease/export',
        {
          ...this.queryParams,
        },
        `notificationRelease_${new Date().getTime()}.xlsx`
      );
    },
  },
};
</script>
<style lang="scss" scoped>
.header {
  height: 37.33px;
  font-family: PingFangSC-Medium;
  font-weight: 600;
  font-size: 26.67px;
  color: #000000d9;
  letter-spacing: 0;
  line-height: 37.33px;
  margin-bottom: 16px;
}
.search-form {
  background-color: #fff;
  padding: 20px 0 0 20px;
  box-sizing: border-box;
  display: flex;
  .search-right {
    width: 14%;
  }
}

.table {
  background: #fff;
  margin: 16px 0 0 0;
  padding: 16px;
  box-sizing: border-box;
  height: 670px;
  .table-title-box {
    display: flex;
    justify-content: space-between;
    .title-name {
      font-family: PingFangSC-Medium;
      font-weight: 600;
      font-size: 18px;
      color: #333333;
    }
  }
}
.el-icon-location-information {
  font-size: 24px;
  margin: 5px 0 0 18px;
  cursor: pointer;
}
</style>
