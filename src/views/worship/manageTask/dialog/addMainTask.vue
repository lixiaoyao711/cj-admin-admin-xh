<template>
  <div class="addMainTask">
    <el-dialog
      :title="`${row.id ? '编辑' : '创建'}任务`"
      width="500px"
      :visible.sync="dialogVisible"
      @close="$emit('close')"
      :close-on-click-modal="false"
    >
    <el-form ref="form" :model="form" :rules="rules" label-width="120px" >
        <el-form-item label="任务标题：" prop="title">
          <el-input v-model="form.title" placeholder="请输入任务标题" />
        </el-form-item>
        <el-form-item label="所属部门：" prop="deptIdList">
          <el-select v-model="form.deptIdList" @change="handleDeptChange" size="small" multiple @keyup.enter.native="handleQuery" clearable>
            <el-option
              v-for="dict in dict.type.sys_worship_managedepartment"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="责任人：" prop="responsibleUserId">
          <span :class="{ 'personRight': form.responsibleEmployeeCode }">{{ form.responsibleEmployeeCode }}</span>
          <el-button plain @click="handlePerson('responsible')">{{ form.responsibleUserId ? '重新选择' : '选择成员' }}</el-button>
        </el-form-item>
        <el-form-item label="协作人：" prop="collaboratorUserId">
          <span :class="{ 'personRight': form.collaboratorEmployeeCode }">{{ form.collaboratorEmployeeCode }}</span>
          <el-button plain @click="handlePerson('collaborator')">{{ form.collaboratorUserId ? '重新选择' : '选择成员' }}</el-button>
        </el-form-item>
        <el-form-item label="截止时间：" prop="deadlineTime">
          <el-date-picker 
            clearable
            v-model="form.deadlineTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择截止时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="任务介绍：" prop="taskIntroduction">
          <el-input v-model="form.taskIntroduction" type="textarea" placeholder="请输入内容" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="$emit('close')">取 消</el-button>
      </div>
    </el-dialog>
    <OrgPeople v-if="showPeople" :isOrgChange="isOrgChange" :isTable="isTable" @close="showPeople = false" @success="peoSuccess"/>
  </div>
</template>

<script>
import { addManageTask, updateManageTask } from "@/api/worship/manageTask";
import OrgPeople from "../../../../components/ChangePeoPle/orgPeople.vue";

export default {
  props: ['row','dialogVisible'],
  dicts: ['sys_worship_managedepartment'],
  components: { OrgPeople },
  data() {
    return {
      responsibleList:[],
      collaboratorList:[],
      allKeShi:[],
      form: {
        state:'0',
      },
      buttonLoading:false,
      showPeople:false,
      currentType:'',
      isOrgChange:false,
      isTable:true,
      // 表单校验
      rules: {
        title: [
          { required: true, message: "任务标题不能为空", trigger: "blur" }
        ],
        responsibleUserId: [
          { required: true, message: "责任人不能为空", trigger: "blur" }
        ],
        collaboratorUserId: [
          { required: true, message: "协作人不能为空", trigger: "blur" }
        ],
        deadlineTime: [
          { required: true, message: "截止时间不能为空", trigger: "blur" }
        ],
        deptIdList: [
          { required: true, message: "所属部门不能为空", trigger: "blur" }
        ],
        deptName: [
          { required: true, message: "所属部门名称不能为空", trigger: "change" }
        ]
      }
    };
  },
  computed: {},
  watch: {},
  mounted() {
    this.form = Object.assign({}, this.form, this.row);
    if (this.form.id) {
      this.form.deptIdList = this.form.deptId.split(',');
    }
    console.log(this.row,this.form);
  },
  methods: {
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.buttonLoading = true;
          let formData = Object.assign({},this.form)
          formData.type = '0'
          if (formData.id != null) {
            updateManageTask(formData).then(response => {
              this.$modal.msgSuccess("修改成功");
            }).finally(() => {
              this.buttonLoading = false;
              this.$emit('success')
            });
          } else {
            addManageTask(formData).then(response => {
              this.$modal.msgSuccess("新增成功");
            }).finally(() => {
              this.buttonLoading = false;
              this.$emit('success')
            });
          }
        }
      });
    },
    handleDeptChange(val){
      this.form.deptId = val.join(',')
      let names = []
      val.forEach(e =>{
        let label = this.dict.type.sys_worship_managedepartment[e]?.label
        label && names.push(label)
      })
      this.form.deptName = names.join(',')
    },
    handlePerson(val){
      this.isOrgChange = false
      this.isTable = true
      this.showPeople = true
      this.currentType = val
    },
    peoSuccess(data){
      if(data.length < 1) {
        return
      }
      let ids = data.map(e => e.userId)
      let names = data.map(e => e.nickName)
      if(this.currentType === 'responsible'){
        this.form.responsibleUserId = ids.join(',')
        this.form.responsibleEmployeeCode = names.join(',')
      } else{
        this.form.collaboratorUserId = ids.join(',')
        this.form.collaboratorEmployeeCode = names.join(',')
      }
      this.showPeople = false
    },
  },
};
</script>

<style lang="scss" scoped>
.addMainTask{
  .personRight{
    padding-right: 12px;
  }
}

</style>
