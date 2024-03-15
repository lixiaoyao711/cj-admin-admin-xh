<template>
  <div class="addSubTask">
    <el-dialog
      :title="`${row.id ? '编辑' : '创建'}子任务`"
      width="500px"
      :visible.sync="dialogVisible"
      @close="$emit('close')"
      :close-on-click-modal="false"
    >
      <el-form :model="form" :rules="rules" ref="form" class="form" label-width="120px">
        <el-form-item label="任务内容:" prop="title">
          <el-input v-model="form.title" type="textarea" maxlength="500"></el-input>
        </el-form-item>
        <p class="alert"><i class="el-icon-warning"></i>  以下内容若不填写，则会优先继承主任务</p>
        <el-form-item label="责任人:" prop="responsibleUserId">
          <el-select v-model="responsibleUserIdList" multiple clearable @change="handleResponsibleChange">
            <el-option
              v-for="per in responsibleList"
              :key="per.id"
              :label="per.name" 
              :value="per.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="协作人:" prop="collaboratorUserId">
          <el-select v-model="collaboratorUserIdList" multiple clearable @change="handleCollaboratorChange">
            <el-option
              v-for="per in collaboratorList"
              :key="per.id"
              :label="per.name"
              :value="per.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="截止时间:" prop="deadlineTime">
          <el-date-picker
            v-model="form.deadlineTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择时间"
          >
          </el-date-picker>
        </el-form-item>
        
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="$emit('close')">取 消</el-button>
        <el-button :loading="buttonLoading" type="primary" @click="handleSave">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { listManageTask, getManageTask, delManageTask, addManageTask, updateManageTask } from "@/api/worship/manageTask";
export default {
  props: ['row','dialogVisible'],
  components: {},
  data() {
    return {
      responsibleList:{},
      collaboratorList:{},
      collaboratorUserIdList:[],
      responsibleUserIdList:[],
      taskData:{},
      form: {},
      buttonLoading:false,
      rules: {
        title: [{ required: true, message: '请输入任务内容', trigger: 'blur' }],
      },
    };
  },
  computed: {},
  watch: {},
  mounted() {
    this.form = Object.assign({}, this.form, this.row);
    this.getData()
    if(this.form.collaboratorUserId){
      this.collaboratorUserIdList = this.form.collaboratorUserId.split(',')
    }
    if(this.form.responsibleUserId){
      this.responsibleUserIdList = this.form.responsibleUserId.split(',')
    }
    console.log(this.form);
  },
  methods: {
    getData() {
      getManageTask(this.row.taskId).then(res =>{
        this.taskData = res.data
        let { collaboratorUserId,collaboratorEmployeeCode,responsibleEmployeeCode,responsibleUserId } = res.data
        let collaboratorUserIds = collaboratorUserId.split(',')
        let collaboratorEmployeeCodes = collaboratorEmployeeCode.split(',')
        let responsibleEmployeeCodes = responsibleEmployeeCode.split(',')
        let responsibleUserIds = responsibleUserId.split(',')
        for(let i = 0; i < collaboratorUserIds.length; i++){
          this.$set(
            this.collaboratorList,
            collaboratorUserIds[i],
            {
              id: collaboratorUserIds[i],
              name: collaboratorEmployeeCodes[i] || ''
            }
          )
        }
        for(let i = 0; i < responsibleUserIds.length; i++){
          this.$set(
            this.responsibleList,
            responsibleUserIds[i],
            {
              id: responsibleUserIds[i],
              name: responsibleEmployeeCodes[i] || ''
            }
          )
        }
        console.log(this.collaboratorList,this.responsibleList);
      })
    },
    handleResponsibleChange(val){
      let names = []
      val.forEach(e =>{
        names.push(this.responsibleList[e].name)
      })
      this.form['responsibleUserId'] = val.join(',')
      this.form['responsibleEmployeeCode'] = names.join(',')
    },
    handleCollaboratorChange(val){
      let names = []
      val.forEach(e =>{
        names.push(this.collaboratorList[e].name)
      })
      this.form['collaboratorUserId'] = val.join(',')
      this.form['collaboratorEmployeeCode'] = names.join(',')
    },
    handleSave() {
      this.$refs['form'].validate(valid => {
        if (!valid) {
          return;
        }
        this.buttonLoading = true;
        let { deadlineTime,
          collaboratorUserId,
          collaboratorEmployeeCode,
          responsibleUserId,
          responsibleEmployeeCode,
         } = this.taskData
        let formData = {
          deadlineTime:deadlineTime,
          collaboratorUserId:collaboratorUserId,
          collaboratorEmployeeCode:collaboratorEmployeeCode,
          responsibleUserId:responsibleUserId,
          responsibleEmployeeCode:responsibleEmployeeCode,
        }
        for (const key in this.form) {
          !!this.form[key] ? formData[key] = this.form[key] : '' ;
        }
        formData.type = '1'
        formData.state = 0
        // console.log(formData);
        if (formData.id != null) {
          updateManageTask(formData).then(response => {
            this.$modal.msgSuccess("修改成功");
          }).finally(() => {
            this.buttonLoading = false;
            this.$emit('success');
          });
        } else {
          addManageTask(formData).then(response => {
            this.$modal.msgSuccess("新增成功");
          }).finally(() => {
            this.buttonLoading = false;
            this.$emit('success');
          });
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.addSubTask{
  .alert{
    height: 36px;
    line-height: 36px;
    border: 1px solid #91d5ff;
    background: rgba($color: #91d5ff, $alpha: 0.3);
    color: #51575a;
    padding: 0 20px;
    border-radius: 4px;
    i{
      color: #1890ff;
    }
  }
}

</style>
