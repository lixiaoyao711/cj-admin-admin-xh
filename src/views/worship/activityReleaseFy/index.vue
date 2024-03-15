<template>
  <div class="app-container">
    <div class="header">富春老兵-活动发布</div>
    <el-form
      class="search-form"
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <div></div>
      <div class="search-right">
        <el-form-item label="" prop="searchValue">
          <el-input
            v-model="queryParams.searchValue"
            placeholder="输入关键字搜索"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
      </div>
    </el-form>

    <div class="table">
      <div class="table-title-box">
        <div class="title-name">活动列表</div>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="primary"
              plain
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd"
              v-hasPermi="['worship:activityReleaseFy:add']"
              >活动发布</el-button
            >
          </el-col>

          <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </div>

      <el-table
        v-loading="loading"
        :data="activityReleaseFyList"
        @selection-change="handleSelectionChange"
        height="59vh"
      >
        <el-table-column label="活动名称" align="center" prop="activityName" />
        <el-table-column label="活动时间" align="center" prop="activityTime" width="180">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.activityTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>

        <el-table-column label="联系人" align="center" prop="personName" />
        <el-table-column label="联系电话" align="center" prop="phone" />
        <el-table-column label="活动地址" align="center" prop="address" />
        <el-table-column label="报名人数" align="center" prop="limitPersonNum">
          <template slot-scope="{ row }">
            <div @click="peopleOpen = true">
              <el-button type="text">{{ row.registeredNum || 0 }}/{{ row.limitPersonNum }}</el-button>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="handleUpdate(scope.row, '富春老兵-活动发布详情')"
              >详情</el-button
            >
            <el-button
              size="mini"
              type="text"
              @click="handleUpdate(scope.row, '修改富春老兵-活动发布')"
              v-hasPermi="['worship:activityReleaseFy:edit']"
              >修改</el-button
            >
            <el-button
              size="mini"
              type="text"
              @click="handleDelete(scope.row)"
              v-hasPermi="['worship:activityReleaseFy:remove']"
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

    <!-- 添加或修改富春老兵-活动发布对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-form-item label="活动名称" prop="activityName">
            <el-input
              :disabled="title === '富春老兵-活动发布详情'"
              v-model="form.activityName"
              placeholder="请输入活动名称"
            />
          </el-form-item>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="活动时间" prop="activityTime">
              <el-date-picker
                :disabled="title === '富春老兵-活动发布详情'"
                clearable
                v-model="form.activityTime"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="请选择活动时间"
              >
              </el-date-picker> </el-form-item
          ></el-col>
          <el-col :span="12">
            <el-form-item label="行政区划：" prop="divisionCode">
              <TreeSelectDivision
                :disabled="title === '富春老兵-活动发布详情'"
                v-model="form.divisionCode"
                @treeselectChange="(e) => treeselectChange(e, form)"
              ></TreeSelectDivision>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="联系人" prop="personName">
              <el-input
                :disabled="title === '富春老兵-活动发布详情'"
                v-model="form.personName"
                placeholder="请选择联系人"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="phone">
              <el-input
                :disabled="title === '富春老兵-活动发布详情'"
                v-model="form.phone"
                type="number"
                placeholder="请输入联系方式"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="活动地址" prop="address">
            <el-input
              :disabled="title === '富春老兵-活动发布详情'"
              v-model="form.address"
              placeholder="请输入活动地址"
            />
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="活动介绍" prop="introduction">
            <el-input
              :disabled="title === '富春老兵-活动发布详情'"
              v-model="form.introduction"
              type="textarea"
              placeholder="请输入内容"
            />
          </el-form-item>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="人数限制">
              <el-radio-group :disabled="title === '富春老兵-活动发布详情'" v-model="form.isLimit">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.isLimit == '1'">
            <el-form-item label="人数限制数量">
              <el-input
                :disabled="title === '富春老兵-活动发布详情'"
                v-model="form.limitPersonNum"
                type="number"
                placeholder="请输入人数限制数量"
              /> </el-form-item
          ></el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 报名人员弹窗 -->
    <el-dialog title="报名人员" :visible.sync="peopleOpen" width="800px" append-to-body>
      <el-table
        v-loading="loading"
        :data="activityReleaseFyList"
        @selection-change="handleSelectionChange"
        height="59vh"
      >
        <el-table-column label="姓名" align="center" prop="personName" />
        <el-table-column label="电话" align="center" prop="phone" />
        <el-table-column label="人员类别" align="center" prop="phone" />
        <el-table-column label="报名时间" align="center" prop="address" />
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button :loading="buttonLoading" type="primary" @click="peopleOpen = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listActivityReleaseFy,
  getActivityReleaseFy,
  delActivityReleaseFy,
  addActivityReleaseFy,
  updateActivityReleaseFy,
} from '@/api/worship/activityReleaseFy';

export default {
  name: 'ActivityReleaseFy',
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
      // 富春老兵-活动发布表格数据
      activityReleaseFyList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      peopleOpen: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        activityName: undefined,
        activityTime: undefined,
        divisionName: undefined,
        divisionCode: undefined,
        searchValue: undefined,
        phone: undefined,
        address: undefined,
        introduction: undefined,
        isLimit: undefined,
        limitPersonNum: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        id: [{ required: true, message: '主键不能为空', trigger: 'blur' }],
        activityName: [{ required: true, message: '活动名称不能为空', trigger: 'blur' }],
        isLimit: [{ required: true, message: '是否人数限制(0:否 1:是 默认0)不能为空', trigger: 'blur' }],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询富春老兵-活动发布列表 */
    getList() {
      this.loading = true;
      listActivityReleaseFy(this.queryParams).then((response) => {
        this.activityReleaseFyList = response.rows;
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
        activityName: undefined,
        activityTime: undefined,
        divisionName: undefined,
        divisionCode: undefined,
        phone: undefined,
        address: undefined,
        introduction: undefined,
        isLimit: undefined,
        limitPersonNum: undefined,
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
      this.title = '添加富春老兵-活动发布';
    },
    /** 修改按钮操作 */
    handleUpdate(row, title) {
      this.loading = true;
      this.reset();
      const id = row.id || this.ids;
      getActivityReleaseFy(id).then((response) => {
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
          if (this.form.id != null) {
            updateActivityReleaseFy(this.form)
              .then((response) => {
                this.$modal.msgSuccess('修改成功');
                this.open = false;
                this.getList();
              })
              .finally(() => {
                this.buttonLoading = false;
              });
          } else {
            addActivityReleaseFy(this.form)
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
      const name = row.activityName || this.filterDelData(ids, this.activityReleaseFyList, 'activityName');
      this.$modal
        .confirm('是否确认删除富春老兵-活动名称为"' + name + '"的数据项？')
        .then(() => {
          this.loading = true;
          return delActivityReleaseFy(ids);
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
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        'worship/activityReleaseFy/export',
        {
          ...this.queryParams,
        },
        `activityReleaseFy_${new Date().getTime()}.xlsx`
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
  justify-content: space-between;
  .search-right {
    // width: 14%;
  }
}

.table {
  background: #fff;
  margin: 16px 0 0 0;
  padding: 16px;
  box-sizing: border-box;
  height: 680px;
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
