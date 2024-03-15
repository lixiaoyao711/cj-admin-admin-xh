<template>
  <div class="jobDatabase">
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
          placeholder="岗位名称/公司名称"
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
        <div class="title-name">岗位列表</div>
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
      <el-table v-loading="loading" :data="jobLibraryList" @selection-change="handleSelectionChange" height="85%">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="岗位名称" align="center" prop="jobName" width="100" />
        <el-table-column label="公司名称" align="center" prop="companyName" />
        <el-table-column label="行政区划" align="center" prop="divisionName" />
        <el-table-column label="工作地址" align="center" prop="workAddress" />
        <el-table-column label="所属行业" align="center" prop="industry">
          <template slot-scope="scope">
            <dict-tag :options="dict.type.sys_worship_industry" :value="scope.row.industry" />
          </template>
        </el-table-column>
        <el-table-column label="岗位薪资" align="center" prop="jobSalary" width="100" />
        <el-table-column label="联系人" align="center" prop="contacts" width="100" />
        <el-table-column label="联系方式" align="center" prop="contactsPhone" width="100" />
        <el-table-column label="推荐人次" align="center" prop="recommendationNum" width="80" />
        <el-table-column label="招聘状态" align="center" prop="recruitStatus" width="120">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.recruitStatus"
              active-color="#13ce66"
              active-value="0"
              inactive-value="1"
              inactive-color="#ff4949"
              @change="handleSwitchChange(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="handleDetail(scope.row)">详情</el-button>
            <el-button size="mini" type="text" @click="handleUpdate(scope.row)" v-hasPermi="['worship:jobLibrary:edit']"
              >修改</el-button
            >
            <el-button
              size="mini"
              type="text"
              @click="handleDelete(scope.row)"
              v-hasPermi="['worship:jobLibrary:remove']"
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
    <!-- 添加或修改岗位库对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="50%" append-to-body>
      <template v-if="title !== '岗位详情'">
        <el-form ref="form" :model="form" :rules="rules" label-width="120px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="岗位名称：" prop="jobName">
                <el-input v-model="form.jobName" placeholder="请输入岗位名称" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="公司名称：" prop="companyName">
                <el-input v-model="form.companyName" placeholder="请输入公司名称" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
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
            <el-col :span="12">
              <el-form-item label="岗位薪资：" prop="jobSalary">
                <el-input v-model="form.jobSalary" placeholder="请输入岗位薪资" />
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
              <el-form-item label="工作地址：" prop="workAddress">
                <el-input v-model="form.workAddress" placeholder="请输入工作地址" />
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
              <el-form-item label="岗位介绍：" prop="jobIntroduction">
                <el-input v-model="form.jobIntroduction" type="textarea" placeholder="请输入内容" />
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
        <el-row class="rows alignCenter">
          <el-col :span="2" class="name">{{ form.jobName }}</el-col>
          <el-col :span="20">{{ form.jobSalary }}</el-col>
          <el-col :span="2">
            <el-tag :type="form.recruitStatus === '1' ? 'info' : ''">
              {{ form.recruitStatus === '1' ? '停止招聘' : '正在招聘' }}
            </el-tag>
          </el-col>
        </el-row>
        <el-row class="rows">
          <el-col :span="12">公司名称：{{ form.companyName }}</el-col>
          <el-col :span="12"
            >所属行业：<dict-tag :options="dict.type.sys_worship_industry" :value="form.industry"
          /></el-col>
        </el-row>
        <el-row class="rows">
          <el-col :span="12">联系人：{{ form.contacts }}</el-col>
          <el-col :span="12">联系方式：{{ form.contactsPhone }}</el-col>
        </el-row>
        <el-row class="rows">
          <el-col :span="24"
            ><div>工作地址：</div>
            {{ form.workAddress }}</el-col
          >
        </el-row>
        <el-row class="rows">
          <el-col :span="24"
            ><div>岗位介绍：</div>
            {{ form.jobIntroduction }}</el-col
          >
        </el-row>
        <el-row class="rows title">岗位推送记录</el-row>
        <el-table
          :data="form.volunteerList"
          header-row-class-name="table-header"
          :header-cell-style="{ background: 'rgba(0, 0, 0, 0.02)' }"
          max-height="250"
          :border="false"
          size="medium"
          style="width: 100%; height: 100%"
        >
          <el-table-column property="name" label="姓名" width=""></el-table-column>
          <el-table-column property="phone" label="联系方式" width=""></el-table-column>
          <el-table-column property="phone" label="推送时间" width="">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.activityTime, '{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {
  listJobLibrary,
  getJobLibrary,
  delJobLibrary,
  addJobLibrary,
  updateJobLibrary,
} from '@/api/worship/jobLibrary';

export default {
  name: 'jobDatabase',
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
      // 岗位库表格数据
      jobLibraryList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        keyWord: '',
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        jobName: [{ required: true, message: '岗位名称不能为空', trigger: 'blur' }],
        companyName: [{ required: true, message: '公司名称不能为空', trigger: 'blur' }],
        industry: [{ required: true, message: '所属行业不能为空', trigger: 'change' }],
        jobSalary: [{ required: true, message: '岗位薪资不能为空', trigger: 'blur' }],
        workAddress: [{ required: true, message: '工作地址不能为空', trigger: 'blur' }],
        contacts: [{ required: true, message: '联系人不能为空', trigger: 'blur' }],
        contactsPhone: [{ required: true, message: '联系方式不能为空', trigger: 'blur' }],
        jobIntroduction: [{ required: true, message: '岗位介绍不能为空', trigger: 'blur' }],
        divisionCode: [{ required: true, message: '行政区划不能为空', trigger: 'blur' }],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询岗位库列表 */
    getList() {
      this.loading = true;
      listJobLibrary(this.queryParams).then((response) => {
        this.jobLibraryList = response.rows;
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
        updateId: undefined,
        jobName: undefined,
        companyName: undefined,
        industry: undefined,
        jobSalary: undefined,
        workAddress: undefined,
        contacts: undefined,
        contactsPhone: undefined,
        jobIntroduction: undefined,
        recommendationNum: undefined,
        recruitStatus: undefined,
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
      this.title = '添加岗位';
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.loading = true;
      this.reset();
      const id = row.id || this.ids;
      getJobLibrary(id).then((response) => {
        this.loading = false;
        this.form = response.data;
        this.open = true;
        this.title = '修改岗位';
      });
    },
    /** 修改按钮操作 */
    handleDetail(row) {
      this.loading = true;
      this.reset();
      const id = row.id || this.ids;
      getJobLibrary(id).then((response) => {
        this.loading = false;
        this.form = response.data;
        this.open = true;
        this.title = '岗位详情';
      });
    },
    handleSwitchChange(row) {
      this.buttonLoading = true;
      updateJobLibrary(row)
        .then((response) => {
          this.$modal.msgSuccess('修改成功');
          this.getList();
        })
        .finally(() => {
          this.buttonLoading = false;
        });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.buttonLoading = true;
          if (this.form.id != null) {
            updateJobLibrary(this.form)
              .then((response) => {
                this.$modal.msgSuccess('修改成功');
                this.open = false;
                this.getList();
              })
              .finally(() => {
                this.buttonLoading = false;
              });
          } else {
            addJobLibrary(this.form)
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
        .confirm('是否确认删除岗位库编号为"' + ids + '"的数据项？')
        .then(() => {
          this.loading = true;
          return delJobLibrary(ids);
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
.el-icon-location-information {
  font-size: 24px;
  margin: 5px 0 0 18px;
  cursor: pointer;
}
.rows {
  margin-bottom: 24px;
  .name {
    font-weight: 600;
    font-size: 24px;
  }
  &.title {
    font-weight: 600;
    font-size: 18px;
    padding-top: 12px;
    border-top: 8px solid #efefef;
  }
  &.alignCenter {
    display: flex;
    align-items: center;
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
