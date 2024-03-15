<template>
  <div class="app-containe">
    <el-form class="search-form" :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <div></div>
      <div class="search-right">
        <el-form-item label="" prop="searchValue">
          <el-input v-model="queryParams.searchValue" placeholder="输入关键字搜索" clearable @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
      </div>
    </el-form>

    <div class="table">
      <div class="table-title-box">
        <div class="title-name">政策文件列表</div>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd">上传政策</el-button>
          </el-col>

          <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </div>

      <el-table v-loading="loading" :data="relevantPolicyList" @selection-change="handleSelectionChange" height="56vh">
        <el-table-column label="政策标题" align="center" prop="title" />

        <el-table-column label="政策来源" align="center" prop="policySources">
          <template slot-scope="{ row }">
            <dict-tag :options="dict.type.sys_worship_level" :value="row.policySources" />
          </template>
        </el-table-column>
        <el-table-column label="上传人" align="center" prop="createName" />
        <el-table-column label="发布日期" align="center" prop="releaseDate" />
        <el-table-column label="上传日期" align="center" prop="createTime" />
        <el-table-column label="阅读量" align="center" prop="readNum" />

        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="handleUpdate(scope.row, 'infoOpen')">详情</el-button>
            <el-button size="mini" type="text" @click="handleUpdate(scope.row, 'open')">修改</el-button>
            <el-button size="mini" type="text" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />
    </div>

    <!-- 添加或修改相关政策对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-form-item label="政策标题" prop="title">
            <el-input v-model="form.title" placeholder="请输入活动名称" />
          </el-form-item>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="政策来源：" prop="policySources">
              <el-select v-model="form.policySources" placeholder="请选择政策来源">
                <el-option v-for="dict in dict.type.sys_worship_level" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发布日期" prop="releaseDate">
              <el-date-picker clearable v-model="form.releaseDate" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="请选择活动时间">
              </el-date-picker> </el-form-item></el-col>
        </el-row>

        <el-row>
          <el-form-item label="上传文件" prop="fileSource">
            <file-upload v-model="form.fileSource" />
          </el-form-item>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel('open')">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 相关政策详情对话框 -->
    <el-dialog title="政策详情" :visible.sync="infoOpen" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-form-item label="" prop="title"> <i class="el-icon-picture-outline"></i> {{ form.title }} </el-form-item>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="政策来源：" prop="">
              <dict-tag :options="dict.type.sys_worship_level" :value="form.policySources" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发布日期："> {{ form.releaseDate }} </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="发布日期："> {{ form.createTime }} </el-form-item></el-col>
          <el-col :span="12">
            <el-form-item label="上传人："> {{ form.createName }} </el-form-item></el-col>
        </el-row>

        <el-row>
          <el-form-item label="附件">
            <file-upload :isView="true" v-model="form.fileSource" />
          </el-form-item>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('infoOpen')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    listRelatedPolicies,
    getRelatedPolicies,
    delRelatedPolicies,
    addRelatedPolicies,
    updateRelatedPolicies,
  } from '@/api/worship/relatedPolicies.js';

  export default {
    name: 'ActivityReleaseFy',
    dicts: ['sys_worship_level', 'sys_worship_sixmodule'],

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
        // 相关政策表格数据
        relevantPolicyList: [],
        // 弹出层标题
        title: '',
        // 是否显示弹出层
        open: false,
        infoOpen: false,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          activityName: undefined,
          activityTime: undefined,
          divisionName: undefined,
          searchValue: undefined,
          divisionCode: undefined,
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
          title: [{ required: true, message: '标题不能为空', trigger: 'blur' }],
          policySources: [{ required: true, message: '来源不能为空', trigger: 'blur' }],
          // releaseDate: [{ required: true, message: '发布日期不能为空', trigger: 'blur' }],
          fileSource: [{ required: true, message: '上传文件不能为空', trigger: 'blur' }],
        },
      };
    },
    created() {
      this.getList();
    },
    methods: {
      /** 查询相关政策 */
      getList() {
        this.loading = true;
        listRelatedPolicies(this.queryParams).then((response) => {
          this.relevantPolicyList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      },
      // 取消按钮
      cancel(open) {
        this[open] = false;
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
        this.title = '添加相关政策';
      },
      /** 修改按钮操作 */
      handleUpdate(row, open) {
        this.loading = true;
        this.reset();
        const id = row.id || this.ids;
        getRelatedPolicies(id).then((response) => {
          this.loading = false;
          this.form = response.data;
          this[open] = true;
          this.title = '修改相关政策';
        });
      },
      /** 提交按钮 */
      submitForm() {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            this.buttonLoading = true;
            if (this.form.id != null) {
              updateRelatedPolicies(this.form)
                .then((response) => {
                  this.$modal.msgSuccess('修改成功');
                  this.open = false;
                  this.getList();
                })
                .finally(() => {
                  this.buttonLoading = false;
                });
            } else {
              addRelatedPolicies(this.form)
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
        console.log('handleDelete', ids)
        const name = row.title || this.filterDelData(ids, this.relevantPolicyList, 'title');
        this.$modal
          .confirm('是否确认删除相关政策名称为"' + name + '"的数据项？')
          .then(() => {
            this.loading = true;
            return delRelatedPolicies(ids);
          })
          .then(() => {
            this.loading = false;
            this.getList();
            this.$modal.msgSuccess('删除成功');
          })
          .catch(() => { })
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
.el-icon-picture-outline {
  font-size: 24px;
  color: #1890ff;
}

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
  height: 640px;

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
