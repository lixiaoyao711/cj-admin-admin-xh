<template>
  <el-dialog
    :title="title"
    width="600px"
    :visible.sync="dialogVisible"
    @close="$emit('close')"
    append-to-body
    :close-on-click-modal="false"
  >
    <el-form :model="form" :rules="rules" ref="form" label-width="200px" class="form">
      <template v-if="type != 'image'">
        <el-form-item label="所属项目：">
          {{ form.entryName }}
        </el-form-item>
        <el-form-item label="受惠人员:" prop="beneficiariesName" class="people">
          <el-input v-model="form.beneficiariesName" type="text" readonly></el-input>
          <el-button size="small" @click="addHelpPeople" class="btn" type="primary">选择</el-button>
        </el-form-item>
        <el-form-item label="申请金额:" prop="applicationAmount" class="people">
          <el-input v-model="form.applicationAmount" type="number" min="0"></el-input>
        </el-form-item>
      </template>

      <div class="upload-title">资料上传</div>
      <el-form-item label="身份证或居住证：" prop="idCardUrl">
        <div class="upload">
          <imageUpload v-model="form.idCardUrl"></imageUpload>
        </div>
      </el-form-item>
      <el-form-item label="户口薄或租房合同：" prop="householdBookUrl">
        <div class="upload">
          <imageUpload v-model="form.householdBookUrl"></imageUpload>
        </div>
      </el-form-item>
      <el-form-item label="病史诊断证明：" prop="medicalHistoryUrl">
        <div class="upload">
          <imageUpload v-model="form.medicalHistoryUrl"></imageUpload>
        </div>
      </el-form-item>
      <el-form-item label="近一年基本医疗保险查询单：" prop="basicMedicalInsuranceUrl">
        <div class="upload">
          <imageUpload v-model="form.basicMedicalInsuranceUrl"></imageUpload>
        </div>
      </el-form-item>
      <el-form-item label="退役军人救助申请表：" prop="retiredSoldierAssistanceUrl">
        <div class="upload">
          <imageUpload v-model="form.retiredSoldierAssistanceUrl"></imageUpload>
        </div>
      </el-form-item>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleSave">保 存</el-button>
    </span>
    <!-- <add-help-people
      v-if="showAddHelpPeople"
      @close="showAddHelpPeople = false"
      @success="addPeopleSuccess"
    ></add-help-people> -->
    <ChangePeople
      v-if="showAddHelpPeople"
      type="difficulty"
      @success="addPeopleSuccess"
      :isRadio="true"
      @close="showAddHelpPeople = false"
    ></ChangePeople>
  </el-dialog>
</template>

<script>
// import { careFundPersonAdd, careFundPersonUpdate, careFundPersonAddList } from '@/api/careAndHelp/careFund';
// import AddHelpPeople from './addHelpPeople.vue';
import ChangePeople from '@/components/ChangePeoPle/people';

import { updateAssistanceApplication, addAssistanceApplication } from '@/api/worship/careFund';
export default {
  props: ['info', 'title', 'newFolider', 'type'],
  components: {
    //  AddHelpPeople
    ChangePeople,
  },
  data() {
    return {
      dialogVisible: true,
      form: {},
      beneficiaryList: [
        {
          name: '',
          retireId: '',
          requestAmount: '',
        },
      ],
      rules: {
        name: [{ required: true, message: '请输入受惠人员', trigger: 'change' }],
        applicationAmount: [
          { required: true, message: '请选择申请金额', trigger: 'change' },
          {
            validator: (rule, value, callback) => {
              console.log(value);
              if (value < 0) {
                return callback(new Error('金额必须大于等于0'));
              } else {
                callback();
              }
            },
            trigger: 'change',
          },
        ],

        entryName: [{ required: true, message: '项目名称不能为空', trigger: 'blur' }],
        searchTime: [{ required: true, message: '请选择', trigger: 'blur' }],
        estimatedAmount: [{ required: true, message: '请输入预计金额', trigger: 'blur' }],
        // applicationAmount: [{ required: true, message: '请输入金额', trigger: 'blur' }],
        beneficiariesName: [{ required: true, message: '请选择', trigger: 'change' }],
        idCardUrl: [{ required: true, message: '请上传', trigger: 'change' }],
        householdBookUrl: [{ required: true, message: '请上传', trigger: 'change' }],
        medicalHistoryUrl: [{ required: true, message: '请上传', trigger: 'change' }],
        basicMedicalInsuranceUrl: [{ required: true, message: '请上传', trigger: 'change' }],
        retiredSoldierAssistanceUrl: [{ required: true, message: '请上传', trigger: 'change' }],
      },
      FileList: [],
      idCardFileList: [],
      homeFileList: [],
      medicalHistoryFileList: [],
      aYearFileList: [],
      veteransFileList: [],
      communityFileList: [],
      otherFileList: [],
      deleteFile: [],
      accept: ['.jpg', '.png'],
      headers: {
        Authorization: sessionStorage.token,
      },
      showAddHelpPeople: false,
    };
  },
  computed: {
    dictMap() {
      return this.$store.state.dictMap;
    },
  },
  watch: {},
  mounted() {
    console.log('info', this.info);
    this.form = this.info;
    // if (this.info.id) {
    //   this.getByid(this.info.id);
    // } else {
    //   this.form = this.info;
    // }
    // console.log(this.$store.state.dictMap.file_type);
  },
  methods: {
    handleSave() {
      this.$refs['form'].validate(async (valid) => {
        if (valid) {
          if (this.form.id) {
            updateAssistanceApplication(this.form).then((response) => {
              this.$modal.msgSuccess('新增成功');
              this.$emit('success');
            });
          } else {
            this.form.operationType = 0;
            addAssistanceApplication(this.form).then((response) => {
              this.$modal.msgSuccess('新增成功');
              this.$emit('success');
            });
          }
        }
      });
    },

    // 添加受惠人员
    addHelpPeople() {
      this.showAddHelpPeople = true;
    },

    addPeopleSuccess(people) {
      console.log(people);
      this.$set(this.form, 'beneficiariesName', people.name);
      this.form.beneficiariesId = people.id;
      this.form.beneficiariesDivisionCode = people.divisionCode;
      this.form.beneficiariesDivisionName = people.divisionName;
      this.showAddHelpPeople = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.name {
  font-size: 24px;
  font-weight: bold;
  margin-right: 10px;
  vertical-align: middle;
}
.upload-title {
  font-size: 24px;
  margin: 20px 0 20px 30px;
}
</style>
<style lang="scss" scoped>
::v-deep .el-form-item__content {
  width: calc(100% - 100px);
}
::v-deep .el-col-24 {
  .el-form-item {
    display: block;
  }
}
::v-deep .el-input {
  width: 60%;
}
.people {
  ::v-deep .el-input {
    width: 60%;
  }
  .btn {
    margin-left: 26px;
  }
}
::v-deep {
  .el-upload-list {
    width: 80%;
  }
}
::v-deep .el-upload--picture-card {
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
}
::v-deep .el-upload-list__item-thumbnail {
  width: 100px;
  height: 100px;
}
::v-deep .el-upload-list__item {
  width: 100px;
  height: 100px;
}
</style>
