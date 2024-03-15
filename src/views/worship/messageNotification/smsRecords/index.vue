<template>
  <div class="app-container">
    <el-form
      class="search-form"
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-row>
        <el-form-item label="所属模块" prop="module">
          <el-select v-model="queryParams.module" placeholder="请选择所属模块" clearable>
            <el-option
              v-for="dict in dict.type.sys_worship_sixmodule"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="发送类型" prop="send_type">
          <el-select v-model="queryParams.send_type" placeholder="请选择发送类型" clearable>
            <el-option
              v-for="dict in dict.type.sys_worship_transmissiontypes"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="搜索" prop="keyWord">
          <el-input
            v-model="queryParams.keyWord"
            placeholder="请输入关键字"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
      </el-row>

      <el-form-item class="search-right">
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <div class="table">
      <div class="table-title-box">
        <div class="title-name">通知内容</div>
      </div>

      <el-table
        v-loading="loading"
        :data="messageNotificationList"
        @selection-change="handleSelectionChange"
        height="50vh"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="主键id" align="center" prop="id" v-if="false" />
        <el-table-column label="所属模块" align="center" prop="module">
          <template slot-scope="scope">
            <dict-tag :options="dict.type.sys_worship_sixmodule" :value="scope.row.module" />
          </template>
        </el-table-column>
        <el-table-column label="内容" align="center" prop="content" />
        <el-table-column label="发送人" align="center" prop="sendPersonName" />
        <el-table-column label="接收人" align="center" prop="receivePersonName" />
        <el-table-column label="发送类型" align="center" prop="send_type">
          <template slot-scope="scope">
            <dict-tag :options="dict.type.sys_worship_transmissiontypes" :value="scope.row.send_type" />
          </template>
        </el-table-column>
        <el-table-column label="时间" align="center" prop="sendType" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              @click="handleDelete(scope.row)"
              v-hasPermi="['worship:messageNotification:remove']"
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
  </div>
</template>

<script>
import {
  listMessageNotification,
  getMessageNotification,
  delMessageNotification,
  addMessageNotification,
  updateMessageNotification,
} from '@/api/worship/messageNotification';

export default {
  name: 'MessageNotification',
  dicts: ['sys_worship_sixmodule', 'sys_worship_transmissiontypes'],
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
      // 消息通知表格数据
      messageNotificationList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        module: undefined,
        receivePersonInfomation: undefined,
        sendType: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
      activeName: 'workNotice',
    };
  },
  created() {
    this.activeName = this.$route.query.tab || 'workNotice';

    this.getList();
  },
  methods: {
    /** 查询消息通知列表 */
    getList() {
      this.loading = true;
      listMessageNotification(this.queryParams).then((response) => {
        this.messageNotificationList = response.rows;
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
        delFlag: undefined,
        type: undefined,
        module: undefined,
        content: undefined,
        sendEmployeeCode: undefined,
        sendPersonName: undefined,
        receivePersonName: undefined,
        receivePersonInfomation: undefined,
        sendType: undefined,
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
      this.title = '添加消息通知';
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.loading = true;
      this.reset();
      const id = row.id || this.ids;
      getMessageNotification(id).then((response) => {
        this.loading = false;
        this.form = response.data;
        this.open = true;
        this.title = '修改消息通知';
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.buttonLoading = true;
          if (this.form.id != null) {
            updateMessageNotification(this.form)
              .then((response) => {
                this.$modal.msgSuccess('修改成功');
                this.open = false;
                this.getList();
              })
              .finally(() => {
                this.buttonLoading = false;
              });
          } else {
            addMessageNotification(this.form)
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
      this.$modal
        .confirm('是否确认删除消息通知编号为"' + ids + '"的数据项？')
        .then(() => {
          this.loading = true;
          return delMessageNotification(ids);
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
        'worship/messageNotification/export',
        {
          ...this.queryParams,
        },
        `messageNotification_${new Date().getTime()}.xlsx`
      );
    },
    handleClick(vm) {
      this.$router.replace({
        path: '',
        query: {
          tab: vm.name,
        },
      });
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
    width: 10%;
  }
}

.table {
  background: #fff;
  margin: 16px 0 0 0;
  padding: 16px;
  box-sizing: border-box;
  height: 600px;
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
.tabs {
  display: flex;
  line-height: 40px;
  .draft {
    background: url('~@/assets/images/draft.png');
    width: 102px;
    height: 40px;
    cursor: pointer;
  }
  .el-tabs {
    margin: 0 20px 0 0;
  }
}
::v-deep .el-tabs__nav-wrap::after {
  height: 0px !important;
}
</style>
