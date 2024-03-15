<template>
  <div class="helpingDynamics">
    <el-form
      class="search-form"
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
      label-width=""
    >
      <el-form-item label="项目情况：" prop="projectSituation">
        <el-select v-model="queryParams.projectSituation" placeholder="请选择" closable>
          <el-option
            v-for="dict in dict.type.project_situation"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="search-right">
        <el-form-item label="" prop="entryName">
          <el-input
            v-model="queryParams.entryName"
            placeholder="输入关键字搜索"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="table">
      <div class="table-title-box">
        <div class="title-name">项目列表</div>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd">新增</el-button>
          </el-col>

          <el-col :span="1.5">
            <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
              >删除</el-button
            >
          </el-col>

          <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </div>
      <el-table v-loading="loading" :data="supportList" @selection-change="handleSelectionChange" height="85%">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="项目名称" align="center" prop="entryName" />
        <el-table-column label="项目情况" align="center" prop="">
          <template slot-scope="scope">
            <dict-tag :options="dict.type.project_situation" :value="scope.row.projectSituation" />
          </template>
        </el-table-column>
        <el-table-column label="开始时间" align="center" prop="startTime" />
        <el-table-column label="结束时间" align="center" prop="endTime" />

        <el-table-column label="申请人数" align="center" prop="applicantsNum" />
        <el-table-column label="通过人数" align="center" prop="passersNum" />
        <el-table-column label="预计金额" align="center" prop="estimatedAmount" />

        <el-table-column label="实际金额" align="center" prop="actualAmount" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button type="text" size="mini">
              <router-link :to="`/careFund/fundDetails/info/${scope.row.id}`">
                <el-button size="mini" type="text">详情</el-button>
              </router-link>
            </el-button>
            <el-button size="mini" type="text" @click="handleUpdate(scope.row, 'helpOpen')">救助申请</el-button>
            <el-button size="mini" type="text" @click="handleUpdate(scope.row, 'open')">编辑</el-button>
            <el-button size="mini" type="text" @click="handleDelete(scope.row)">删除</el-button>
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
    <!-- 新增项目管理 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="项目名称" prop="entryName">
          <el-input v-model="form.entryName"></el-input>
        </el-form-item>
        <el-form-item label="项目时间" prop="searchTime">
          <el-date-picker
            v-model="form.searchTime"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item label="预计金额" prop="estimatedAmount">
          <el-input v-model="form.estimatedAmount" type="number"></el-input>
        </el-form-item>
        <el-form-item label="项目介绍" prop="msg">
          <el-input v-model="form.msg"></el-input>
        </el-form-item>
        <el-form-item label="附件内容" prop="fileUrl">
          <fileUpload v-model="form.fileUrl" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel('open')">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 救助申请 -->
    <!-- <el-dialog title="救助申请" :visible.sync="helpOpen" width="700px" append-to-body>
      <el-form ref="form" :model="formData" :rules="rules" label-width="140px">
        <el-form-item label="所属项目" prop="entryName">
          {{ formData.entryName }}
        </el-form-item>
        <el-form-item label="受惠人员" prop="beneficiariesName">
          <div class="beneficiariesName">
            <el-input readonly v-model="formData.beneficiariesName"></el-input>
            <el-button @click="changePeopleDialog = true" type="primary" size="mini">选 择</el-button>
          </div>
        </el-form-item>
        <el-form-item label="申请金额" prop="applicationAmount">
          <el-input v-model="formData.applicationAmount" type="number"></el-input>
        </el-form-item>
        <div class="help-file-box">
          <div class="file-title">资料上传</div>
          <el-form-item label="身份证或居住证：" prop="idCardUrl">
            <imageUpload v-model="formData.idCardUrl" :fileSize="20"></imageUpload>
          </el-form-item>
          <el-form-item label="户口薄或租房合同：" prop="householdBookUrl">
            <imageUpload v-model="formData.householdBookUrl" :fileSize="20"></imageUpload>
          </el-form-item>
          <el-form-item label="病史诊断证明：" prop="medicalHistoryUrl">
            <imageUpload v-model="formData.medicalHistoryUrl" :fileSize="20"></imageUpload>
          </el-form-item>
          <el-form-item label="近一年基本医疗保险查询单：" prop="basicMedicalInsuranceUrl">
            <imageUpload v-model="formData.basicMedicalInsuranceUrl" :fileSize="20"></imageUpload>
          </el-form-item>
          <el-form-item label="退役军人救助申请表：" prop="retiredSoldierAssistanceUrl">
            <imageUpload v-model="formData.retiredSoldierAssistanceUrl" :fileSize="20"></imageUpload>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :loading="buttonLoading" type="primary" @click="submitHelp">确 定</el-button>
        <el-button @click="cancel('helpOpen')">取 消</el-button>
      </div>
    </el-dialog> -->
    <!-- <ChangePeople
      v-if="changePeopleDialog"
      type="difficulty"
      @success="peopleSuccess"
      :isRadio="true"
      @close="changePeopleDialog = false"
    ></ChangePeople> -->
    <AddBeneficiary
      v-if="helpOpen"
      :title="'救助申请'"
      :info="formData"
      type="add"
      @close="helpOpen = false"
      @success="helpOpen = false"
    ></AddBeneficiary>
  </div>
</template>

<script>
import { listByIds } from '@/api/system/oss';
import {
  projectManagementList,
  getProjectManagement,
  delBasicPerson,
  updateProjectManagement,
  addProjectManagement,
  updateAssistanceApplication,
  addAssistanceApplication,
} from '@/api/worship/careFund';
import ChangePeople from '@/components/ChangePeoPle/people';
import AddBeneficiary from '../dialog/addBeneficiary.vue';
export default {
  name: 'PartyStudyFile',
  components: {
    ChangePeople,
    AddBeneficiary,
  },
  dicts: ['project_situation'],
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
      // 学习内容文件表格数据
      supportList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      helpOpen: false,
      changePeopleDialog: false,
      showaddBeneficiary: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        entryName: undefined,
      },
      // 表单参数
      form: {
        fileUrl: undefined,
      },
      formData: {},

      // 表单校验
      rules: {
        entryName: [{ required: true, message: '项目名称不能为空', trigger: 'blur' }],
        searchTime: [{ required: true, message: '请选择', trigger: 'blur' }],
        estimatedAmount: [{ required: true, message: '请输入预计金额', trigger: 'blur' }],
        applicationAmount: [{ required: true, message: '请输入金额', trigger: 'blur' }],
        beneficiariesName: [{ required: true, message: '请选择', trigger: 'change' }],
        idCardUrl: [{ required: true, message: '请上传', trigger: 'change' }],
        householdBookUrl: [{ required: true, message: '请上传', trigger: 'change' }],
        medicalHistoryUrl: [{ required: true, message: '请上传', trigger: 'change' }],
        basicMedicalInsuranceUrl: [{ required: true, message: '请上传', trigger: 'change' }],
        retiredSoldierAssistanceUrl: [{ required: true, message: '请上传', trigger: 'change' }],
      },
      srcList: [],
      helpMethodStr: [],
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.buttonLoading = true;
          this.form.startTime = this.form.searchTime[0];
          this.form.endTime = this.form.searchTime[1];

          if (this.form.id != null) {
            updateProjectManagement(this.form)
              .then((response) => {
                this.$modal.msgSuccess('修改成功');
                this.open = false;
                this.getList();
              })
              .finally(() => {
                this.buttonLoading = false;
              });
          } else {
            addProjectManagement(this.form)
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
    submitHelp() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.buttonLoading = true;
          // this.form.projectId = this.form.id;
          // delete this.form.id;
          this.formData.operationType = 0;
          addAssistanceApplication(this.formData)
            .then((response) => {
              this.$modal.msgSuccess('新增成功');
              this.helpOpen = false;
              this.getList();
            })
            .finally(() => {
              this.buttonLoading = false;
            });
        }
      });
    },
    /** 查询学习内容文件列表 */
    getList() {
      this.loading = true;
      projectManagementList(this.queryParams).then((response) => {
        this.supportList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel(key) {
      this[key] = false;
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
        title: undefined,
        content: undefined,
        fileUrl: undefined,
      };
      this.resetForm('form');
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = '新建项目';
    },
    /** 修改按钮操作 */
    handleUpdate(row, key) {
      this.loading = true;
      this.reset();
      const id = row.id || this.ids;
      getProjectManagement(id).then(async (response) => {
        this.loading = false;
        this.form = response.data;
        this.formData.projectId = response.data.id;
        this.formData.entryName = response.data.entryName;
        this.$set(this.form, 'searchTime', [response.data.startTime, response.data.endTime]);
        this[key] = true;
        this.title = '修改项目';
      });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      const name = row.entryName ?? this.filterDelData(this.ids, this.supportList, 'entryName');

      this.$modal
        .confirm('是否确认删除名称为"' + name + '"的数据项？')
        .then(() => {
          this.loading = true;
          return delBasicPerson(ids);
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
    /** 就业创业活动详情按钮操作 */
    handleActivityDetail(row) {
      this.loading = true;
      this.reset();
      const id = row.id || this.ids;
      getProjectManagement(id).then(async (response) => {
        this.loading = false;
        this.form = response.data;
        let helpMethodList = [];
        // this.form.helpMethod.split(',').map((e) => {
        //   let label = this.dict.type.sys_worship_assistancemeasures[e]?.label;
        //   label && helpMethodList.push(label);
        // });
        this.helpMethodStr = helpMethodList.join(',');
        this.open = true;
        this.title = '帮扶详情';
        if (response.data.fileUrl) {
          let file = await this.getImgList(response.data.fileUrl);
          this.srcList = file.map((e) => e.url);
        }
      });
    },
    peopleSuccess(people) {
      console.log(people);
      this.$set(this.formData, 'beneficiariesName', people.name);
      this.formData.beneficiariesId = people.id;
      this.formData.beneficiariesDivisionCode = people.divisionCode;
      this.formData.beneficiariesDivisionName = people.divisionName;
      this.changePeopleDialog = false;
    },
    openPath(url) {
      window.open(url);
    },
    async getImgList(id) {
      const { data } = await listByIds(id);
      let list = data.map((e) => {
        return { name: e.originalName, url: e.url, ossId: e.ossId };
      });
      return list;
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
  .borderTop {
    border-top: 1px solid #efefef;
    padding-top: 24px;
  }
  .el-col {
    margin-bottom: 24px;
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
.beneficiariesName {
  display: flex;
  .el-input {
    margin: 0 16px 0 0;
  }
}
.help-file-box {
  border-top: 1px solid #eee;
  .file-title {
    font-size: 22px;
    font-weight: 600;
    padding: 30px 0 0 20px;
    box-sizing: border-box;
  }
}
</style>
