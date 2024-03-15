<template>
  <div>
    <el-dialog
      :title="titleName"
      :visible.sync="dialogVisible"
      width="700px"
      append-to-body
      :before-close="handleClose"
    >
      <el-form :rules="rules" ref="formRules" label-width="120px" :model="formData">
        <el-row>
          <el-col :span="12" v-if="userType == 0">
            <el-form-item label="接收部队" prop="receiveDeptId">
              <el-cascader
                ref="cascader"
                @change="departmentChange"
                v-model="formData.receiveDeptId"
                :options="deptCommonDict"
                :props="{ value: 'id' }"
                clearable
              ></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-else>
            <el-form-item label="接收部门" prop="receiveDeptId">
              <div>{{ formData.receiveDeptName }}</div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="任务类型" prop="taskType">
              <el-select v-model="formData.taskType">
                <el-option
                  v-for="dict in dict.type.sys_worship_rwlx"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="需求单位" prop="demandDeptName">
          <div>{{ formData.demandDeptName }}</div>
        </el-form-item>
        <el-form-item label="任务内容" prop="taskContent">
          <el-input
            resize="none"
            type="textarea"
            placeholder="请输入内容"
            v-model="formData.taskContent"
            show-word-limit
            :autosize="{
              minRows: 5,
            }"
          >
          </el-input>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="办结期限" prop="finishDate">
              <el-date-picker
                v-model="formData.finishDate"
                type="datetime"
                placeholder="选择日期"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd HH:mm"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="紧急程度" prop="urgencyLevel">
              <el-select v-model="formData.urgencyLevel">
                <el-option
                  v-for="dict in dict.type.sys_worship_jjcd"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="附件:" prop="">
          <div class="upload">
            <ImageUpload v-model="formData.fileUrl" />
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="saveItem">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// api
import Up from './up.vue';
import ImageUpload from '@/components/ImageUpload2/index';
import { addSupportTask, updateSupportTask, getUserDeptType, getStockRetireDept } from '@/api/worship/supportTask';
export default {
  inject: ['dad'],
  dicts: ['sys_worship_jjcd', 'sys_worship_rwlx', 'sys_worship_rwzt'],
  props: {
    titleName: String,
    propsData: Object,
  },
  components: { Up, ImageUpload },
  data() {
    return {
      rules: {
        receiveDeptId: [{ required: true, message: '请选择', trigger: 'change' }],
        taskType: [{ required: true, message: '请选择任务类型', trigger: 'change' }],
        reflectPersonnel: [{ required: true, message: '请输入反映人员', trigger: 'change' }],
        taskContent: [{ required: true, message: '请输入任务内容', trigger: 'change' }],
        finishDate: [{ required: true, message: '请选择', trigger: 'change' }],
        urgencyLevel: [{ required: true, message: '请选择', trigger: 'change' }],
        fileUrl: [{ required: true, message: '请上传', trigger: 'change' }],
      },
      dialogVisible: true,
      imgDialogVisible: false,
      upDialog: false,
      formData: {},
      userType: 0 /* 0:部门 1:部队 */,
    };
  },
  computed: {
    deptCommonDict() {
      return this.$store.state.user.deptCommonDict;
    },
    userInfo() {
      return this.$store.state.user.user;
    },
  },
  watch: {},
  created() {},
  mounted() {
    console.log('deptCommonDict', this.userInfo);
    this.handleInit();
  },
  methods: {
    handleInit() {
      this.$set(this.formData, 'demandDeptId', this.userInfo.deptId);
      this.$set(this.formData, 'demandDeptName', this.userInfo.deptName);
      this.propsData.id ? (this.formData = this.propsData) : '';
      this.getUserType();
    },
    async getUserType() {
      const { data } = await getUserDeptType(this.userInfo.userId);
      this.userType = data;
      if (data == 1) {
        const dept = await getStockRetireDept();
        console.log('dept', dept);
        this.$set(this.formData, 'receiveDeptId', dept.data.deptId);
        this.$set(this.formData, 'receiveDeptName', dept.data.deptName);
      }
    },
    handleClose() {
      this.$emit('close');
    },
    upClose(data) {
      if (data) {
        this.formData.receiveDeptId = data.receiveDeptId;
        this.formData.receiveForcesName = this.dad.userinfo.nickName;
        this.$set(this.formData, 'recipientName', data.recipientName);
      }
      this.upDialog = false;
    },
    saveItem() {
      this.$refs.formRules.validate((val) => {
        if (val) {
          let receiveDeptId = this.formData.receiveDeptId;
          if (this.userType == 0) {
            receiveDeptId = this.formData.receiveDeptId[this.formData.receiveDeptId.length - 1];
            if (this.$refs.cascader.getCheckedNodes()[0] !== null) {
              this.formData.receiveDeptName = this.$refs.cascader.getCheckedNodes()?.[0].label;
            }
          }
          if (this.titleName === '新建内容') {
            addSupportTask({ ...this.formData, receiveDeptId }).then((res) => {
              this.$message.success('新增成功');
              this.$emit('close');
            });
          }
          if (this.titleName === '编辑内容') {
            updateSupportTask({ ...this.formData, receiveDeptId }).then((res) => {
              this.$message.success('编辑成功');
              this.$emit('close');
            });
          }
        }
      });
    },
    changeUp() {
      this.upDialog = true;
    },
    departmentChange(val) {
      // console.log(val);
    },
  },
};
</script>

<style scoped lang="scss">
.span1 {
  margin-right: 16px;
}
.el-icon-user {
  cursor: pointer;
}
.age {
  width: 4vw;
}
v-deep.el-upload--picture-card {
  width: 80px;
  height: 80px;
  line-height: 1;
  i {
    margin-top: 15px;
  }
}
v-deep.el-upload-list--picture-card .el-upload-list__item {
  width: 80px;
  height: 80px;
}
</style>
