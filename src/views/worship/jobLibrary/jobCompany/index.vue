<template>
  <div class="jobCompany">
    <el-form
      class="search-form"
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
      label-width=""
    >
      <el-form-item label="行政区划：" prop="divisionCode">
        <TreeSelectDivision
          v-model="queryParams.divisionCode"
          @treeselectChange="(e) => treeselectChange(e, queryParams, 'divisionCode')"
        ></TreeSelectDivision>
      </el-form-item>
      <el-form-item label="搜索:" prop="keyWord">
        <el-input
          v-model="queryParams.keyWord"
          placeholder="请输入企业名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item class="search-right">
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="table">
      <div class="table-title-box">
        <div class="title-name">企业列表</div>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="danger"
              plain
              icon="el-icon-delete"
              size="mini"
              :disabled="multiple"
              @click="handleDelete"
              v-hasPermi="['worship:jobLibrary:remove']"
              >删除</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="primary"
              plain
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd"
              v-hasPermi="['worship:jobLibrary:add']"
              >新增</el-button
            >
          </el-col>
          <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </div>
      <el-table v-loading="loading" :data="jobCompanyList" @selection-change="handleSelectionChange" height="85%">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="企业名称" align="center" prop="companyName" />
        <el-table-column label="行政区划" align="center" prop="divisionName" />
        <el-table-column label="地址" align="center" prop="companyAddress" />
        <el-table-column label="所属行业" align="center" prop="industry">
          <template slot-scope="scope">
            <dict-tag :options="dict.type.sys_worship_industry" :value="scope.row.industry" />
          </template>
        </el-table-column>
        <el-table-column label="参加招聘会次数" align="center" prop="activityNum" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="handleDetail(scope.row)">详情</el-button>
            <el-button size="mini" type="text" @click="handleUpdate(scope.row)" v-hasPermi="['worship:jobCompany:edit']"
              >修改</el-button
            >
            <el-button
              size="mini"
              type="text"
              @click="handleDelete(scope.row)"
              v-hasPermi="['worship:jobCompany:remove']"
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
    <!-- 添加或修改入驻企业对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="50%" append-to-body>
      <template v-if="title !== '企业详情'">
        <el-form ref="form" :model="form" :rules="rules" label-width="120px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="企业名称：" prop="companyName">
                <el-input v-model="form.companyName" placeholder="请输入企业名称" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="所属行业：" prop="industry">
                <el-select v-model="form.industry" placeholder="请选择所属行业">
                  <el-option
                    v-for="dict in dict.type.sys_worship_industry"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="行政区划：" prop="divisionCode">
                <TreeSelectDivision
                  v-model="form.divisionCode"
                  @treeselectChange="(e) => treeselectChange(e, form)"
                ></TreeSelectDivision>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="企业地址：" prop="companyAddress">
                <el-input v-model="form.companyAddress" placeholder="请输入企业地址" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="联系人：" prop="contacts">
                <el-input v-model="form.contacts" placeholder="请输入联系人" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="联系方式：" prop="contactsPhone">
                <el-input v-model="form.contactsPhone" placeholder="请输入联系方式" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="企业介绍：" prop="companyIntroduction">
                <el-input v-model="form.companyIntroduction" type="textarea" placeholder="请输入内容" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
      <template v-else>
        <el-row class="rows">
          <el-col :span="24" class="name">{{ form.companyName }}</el-col>
        </el-row>
        <el-row class="rows">
          <el-col :span="24"
            >所属行业：<dict-tag :options="dict.type.sys_worship_industry" :value="form.industry"
          /></el-col>
        </el-row>
        <el-row class="rows">
          <el-col :span="24"
            ><div>企业地址：</div>
            {{ form.companyAddress }}</el-col
          >
        </el-row>
        <el-row class="rows">
          <el-col :span="24"
            ><div>企业介绍：</div>
            {{ form.companyIntroduction }}</el-col
          >
        </el-row>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {
  listJobCompany,
  getJobCompany,
  delJobCompany,
  addJobCompany,
  updateJobCompany,
} from '@/api/worship/jobCompany';

export default {
  name: 'JobCompany',
  dicts: ['sys_worship_industry'],
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
      // 入驻企业表格数据
      jobCompanyList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        companyName: undefined,
        keyWord: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        id: [{ required: true, message: '主键不能为空', trigger: 'blur' }],
        companyName: [{ required: true, message: '企业名称不能为空', trigger: 'blur' }],
        industry: [{ required: true, message: '所属行业不能为空', trigger: 'change' }],
        companyAddress: [{ required: true, message: '企业地址不能为空', trigger: 'blur' }],
        contacts: [{ required: true, message: '联系人不能为空', trigger: 'blur' }],
        contactsPhone: [{ required: true, message: '联系方式不能为空', trigger: 'blur' }],
        divisionCode: [{ required: true, message: '行政区划不能为空', trigger: 'blur' }],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询入驻企业列表 */
    getList() {
      this.loading = true;
      listJobCompany(this.queryParams).then((response) => {
        this.jobCompanyList = response.rows;
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
        createId: undefined,
        companyName: undefined,
        industry: undefined,
        companyAddress: undefined,
        contacts: undefined,
        contactsPhone: undefined,
        companyIntroduction: undefined,
        activityNum: undefined,
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
      this.title = '添加入驻企业';
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.loading = true;
      this.reset();
      const id = row.id || this.ids;
      getJobCompany(id).then((response) => {
        this.loading = false;
        this.form = response.data;
        this.open = true;
        this.title = '修改入驻企业';
      });
    },
    /** 详情按钮操作 */
    handleDetail(row) {
      this.loading = true;
      this.reset();
      const id = row.id || this.ids;
      getJobCompany(id).then((response) => {
        this.loading = false;
        this.form = response.data;
        this.open = true;
        this.title = '企业详情';
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.buttonLoading = true;
          if (this.form.id != null) {
            updateJobCompany(this.form)
              .then((response) => {
                this.$modal.msgSuccess('修改成功');
                this.open = false;
                this.getList();
              })
              .finally(() => {
                this.buttonLoading = false;
              });
          } else {
            addJobCompany(this.form)
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
        .confirm('是否确认删除入驻企业编号为"' + ids + '"的数据项？')
        .then(() => {
          this.loading = true;
          return delJobCompany(ids);
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
  .search-right {
    float: right;
  }
}

.table {
  background: #fff;
  margin: 16px 0 0 0;
  padding: 16px;
  box-sizing: border-box;
  height: 642px;
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
.rows {
  margin-bottom: 24px;
  .name {
    font-weight: 600;
    font-size: 24px;
  }
  .el-col {
    color: #333333;
    display: flex;
    & > div {
      white-space: nowrap;
    }
    &.alignCenter {
      align-items: center;
    }
  }
}
</style>
