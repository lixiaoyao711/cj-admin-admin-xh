<template>
  <div class="addData">
    <!-- 添加或修改现役军人家属对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1080px" append-to-body @close="cancel">
      <el-form ref="form" :model="form" :rules="rules" label-width="140px">
        <el-row>
          <el-col :span="18">
            <el-form-item label="信访人" prop="petitionPersonName">
              <div class="df">
                <el-input readonly v-model="form.petitionPersonName" placeholder="请选择" />
                <el-button @click="changePeoPleDialog = true" class="ml20">选择</el-button>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="登记人" prop="reportUser">
              <el-input v-model="form.reportUser" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="登记人电话" prop="reportPhone">
              <el-input v-model="form.reportPhone" placeholder="请输入手机号" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="信访目的" prop="infoObjective">
              <el-select v-model="form.infoObjective" placeholder="请选择">
                <el-option
                  v-for="dict in dict.type.sys_worship_xfmd"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="目的类型" prop="">
              <el-select v-model="form.infoObjectiveType" placeholder="请选择">
                <el-option
                  v-for="dict in dict.type.sys_worship_xfmdlx"
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
            <el-form-item label="登记单位" prop="divisionCode">
              <TreeSelectDivision
                v-model="form.divisionCode"
                @treeselectChange="(e) => treeselectChange(e, form)"
                :isUser="false"
              ></TreeSelectDivision>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="登记级别" prop="infoRegisterLevel">
              <el-select v-model="form.infoRegisterLevel" placeholder="请选择">
                <el-option
                  v-for="dict in dict.type.sys_worship_djjb"
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
            <el-form-item label="信访渠道" prop="infoChannel">
              <el-select v-model="form.infoChannel" placeholder="请选择">
                <el-option
                  v-for="dict in dict.type.sys_worship_xfdjqd"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="紧急程度" prop="infoUrgencyLevel">
              <el-select @change="updateDeadline" v-model="form.infoUrgencyLevel" placeholder="请选择">
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
        <el-row>
          <el-col :span="12">
            <el-form-item label="登记日期" prop="reportTime">
              <el-date-picker
                clearable
                v-model="form.reportTime"
                type="date"
                @change="updateDeadline"
                value-format="yyyy-MM-dd HH:mm:ss"
                :picker-options="startPickerOptions"
                placeholder="请选择"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="截止日期" prop="deadline">
              <el-date-picker
                clearable
                v-model="form.deadline"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="请选择"
                :picker-options="endPickerOptions"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="诉求内容" prop="petitionContent">
            <el-input
              type="textarea"
              :autosize="{ minRows: 4 }"
              placeholder="请输入内容"
              v-model="form.petitionContent"
            >
            </el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="上传文件" prop="">
            <FileUpload v-model="form.fileUrl" />
          </el-form-item>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <ChangePeoPle
      v-if="changePeoPleDialog"
      @close="changePeoPleDialog = false"
      type="petitionDynamics"
      @success="changePeoPleSuccess"
      :peopleList="peopleList"
    />
  </div>
</template>

<script>
import ChangePeoPle from '@/components/ChangePeoPle/people.vue';
import { addPetitionInfo, updatePetitionInfo } from '@/api/worship/petitionInfo';
export default {
  dicts: [
    'sys_worship_xfzt',
    'sys_worship_xfmd',
    'sys_worship_djjb',
    'sys_worship_jjcd',
    'sys_worship_xfdjqd',
    'sys_worship_xfmdlx',
    'sys_worship_wczt',
  ],
  props: {
    title: {
      type: String,
      default: '新增信访信息',
    },
    propsData: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  components: {
    ChangePeoPle,
  },
  data() {
    return {
      open: true,
      changePeoPleDialog: false,
      form: {
        reportTime: undefined,
      },
      peopleList: [],
      // 表单校验
      rules: {
        reportUser: [{ required: true, message: '登记人不能为空', trigger: 'blur' }],
        reportPhone: [{ required: true, message: '登记人电话不能为空', trigger: 'blur' }],
        infoObjective: [{ required: true, message: '请选择', trigger: 'blur' }],
        divisionCode: [{ required: true, message: '请选择', trigger: 'blur' }],
        infoRegisterLevel: [{ required: true, message: '请选择', trigger: 'blur' }],
        infoChannel: [{ required: true, message: '请选择', trigger: 'blur' }],
        infoUrgencyLevel: [{ required: true, message: '请选择', trigger: 'blur' }],
        reportTime: [{ required: true, message: '请选择', trigger: 'blur' }],
        deadline: [{ required: true, message: '请选择', trigger: 'blur' }],
        petitionContent: [{ required: true, message: '请输入', trigger: 'blur' }],
        fileUrl: [{ required: true, message: '请选择', trigger: 'blur' }],
      },
      startPickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
      },
      endPickerOptions() {
        let form = this.form;
        return {
          disabledDate(time) {
            return time.getTime() < Date.parse(new Date(form.petitionDate)) - 86400000;
          },
        };
      },
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.form = this.propsData;
    console.log(this.form);
  },
  methods: {
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.form.reportTime = this.parseTime(this.form.reportTime, '{y}-{m}-{d} {h}:{i}:{s}');
          if (this.form.id != null) {
            updatePetitionInfo(this.form).then((response) => {
              this.$modal.msgSuccess('修改成功');
              this.$emit('success');
            });
          } else {
            addPetitionInfo(this.form).then((response) => {
              this.$modal.msgSuccess('新增成功');
              this.$emit('success');
            });
          }
        }
      });
    },
    cancel() {
      this.$emit('close');
    },
    changePeoPleSuccess(people, type) {
      let data = null;
      if (!Array.isArray(people)) {
        data = [people];
      } else {
        data = people;
      }
      const id = data.map((item) => item.id).join(',');
      const name = data.map((item) => item.name).join(',');
      this.$set(this.form, 'personIds', id);
      this.$set(this.form, 'petitionPersonName', name);
      this.form.associatedPersonType = type;
      this.changePeoPleDialog = false;
    },
    updateDeadline() {
      if (!this.form.reportTime || !this.form.infoUrgencyLevel) {
        return;
      }
      // 截止日期根据紧急程度自动计算
      let stamp = Date.parse(new Date(this.form.reportTime));
      let deadlineMap = {
        2: 86400000, // 1天
        1: 172800000, // 2天
        0: 259200000, // 3天
      };
      // this.form.deadline =
      this.$set(
        this.form,
        'deadline',
        this.parseTime(new Date(stamp + deadlineMap[this.form.infoUrgencyLevel]), '{y}-{m}-{d} {h}:{i}:{s}')
      );
      console.log(this.form);
    },
  },
};
</script>

<style scoped lang="scss">
.addData {
}
</style>
