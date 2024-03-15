<template>
  <div class="workInfoEditDialog">
    <el-dialog title="社会保障情况" :visible.sync="open" width="1080px" append-to-body @close="cancel">
      <el-form ref="form" :model="form.expandContent" :rules="rules" label-width="140px">
        <el-row>
          <el-form-item label="养老保险参保情况" prop="">
            <el-checkbox-group v-model="ylCheckList">
              <el-checkbox v-for="(dict, index) in dict.type.sys_worship_ylbxcnqk" :key="index" :label="dict.label">{{
                dict.label
              }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="养老保险参保地" prop="">
              <el-cascader
                v-model="placePartPensionInsurance"
                clearable
                ref="placePartPensionInsurance"
                :props="customProps"
                @change="handleChange('placePartPensionInsurance')"
                :options="mapList"
                placeholder="请选择"
              ></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="养老保险参保时长" prop="">
              <div class="df">
                <el-input v-model="form.expandContent.regPartPensionInsurance" type="number"></el-input>
                <span class="ml10">月</span>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="养老保险是否中断" prop="">
              <el-radio-group v-model="form.expandContent.pensionInsurance">
                <el-radio label="是">是</el-radio>
                <el-radio label="否">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>

          <el-col :span="11">
            <el-form-item label="养老保险中断时段" prop="">
              <el-date-picker
                v-model="form.expandContent.ylSearchTime"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="医疗保险参保情况" prop="">
            <el-checkbox-group v-model="checkListYl">
              <el-checkbox v-for="(dict, index) in dict.type.sys_worship_ylbxcnqk" :key="index" :label="dict.label">{{
                dict.label
              }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="医疗保险参保地" prop="">
              <el-cascader
                v-model="placeMedParticipation"
                clearable
                ref="placeMedParticipation"
                :props="customProps"
                @change="handleChange('placeMedParticipation')"
                :options="mapList"
                placeholder="请选择"
              ></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="医疗保险参保时长" prop="">
              <div class="df">
                <el-input v-model="form.expandContent.durationMedInsurancePart" type="number"></el-input>
                <span class="ml10">月</span>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="医疗保险是否中断" prop="">
              <el-radio-group v-model="form.expandContent.medInsuranceInterrupted">
                <el-radio label="是">是</el-radio>
                <el-radio label="否">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="医疗保险中断时段" prop="">
              <el-date-picker
                v-model="form.expandContent.searchTimeYl"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getPersonExpandById, addPersonExpand, updatePersonExpand } from '@/api/worship/retiredSoldier';
export default {
  props: {
    propsId: '',
    title: {
      type: String,
      default: '',
    },
  },
  dicts: ['sys_worship_ylbxcnqk', 'sys_worship_yiliaobxcbqk'],
  components: {},
  data() {
    return {
      open: true,
      ylCheckList: [],
      checkListYl: [],
      placePartPensionInsurance: [],
      placeMedParticipation: [],

      form: {
        expandChildType: 'A4',
        expandParentType: 'A',
        expandContent: {
          ylSearchTime: [],
          searchTimeYl: [],
        },
      },

      rules: {
        educationBackground: [{ required: true, message: '学历情况不能为空', trigger: 'blur' }],
        // name: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
      },
      customProps: {
        emitPath: true,
        label: 'name',
        value: 'name',
      },
    };
  },
  computed: {
    mapList() {
      return this.$store.getters.mapList;
    },
  },
  watch: {},
  created() {},
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      if (this.propsId) {
        getPersonExpandById(this.propsId).then((res) => {
          this.form = res.data;
          this.form.expandContent = JSON.parse(this.form.expandContent);
          this.ylCheckList = this.form.expandContent.pensionInsurancePartStatus.split(',');
          this.checkListYl = this.form.expandContent.medInsurancePartStatus.split(',');
          this.placePartPensionInsurance = this.form.expandContent.placePartPensionInsurance.split(',');
          this.placeMedParticipation = this.form.expandContent.placeMedParticipation.split(',');
          // this.form.expandContent.ylSearchTime = [
          //   this.form.expandContent.pensionInsurancePeriodBeginTime,
          //   this.form.expandContent.pensionInsurancePeriodEndTime,
          // ];
          // this.form.expandContent.searchTimeYl = [
          //   this.form.expandContent.medInsurancePeriodBeginTime,
          //   this.form.expandContent.medInsurancePeriodEndTime,
          // ];
        });
      }
    },
    submitForm() {
      this.$refs['form'].validate((val) => {
        if (val) {
          this.form.expandContent.pensionInsurancePeriodBeginTime = this.form.expandContent?.ylSearchTime[0];
          this.form.expandContent.pensionInsurancePeriodEndTime = this.form.expandContent?.ylSearchTime[1];
          this.form.expandContent.medInterruptionPeriodBeginTime = this.form.expandContent?.searchTimeYl[0];
          this.form.expandContent.medInterruptionPeriodEndTime = this.form.expandContent?.searchTimeYl[1];
          this.form.expandContent.pensionInsurancePartStatus = this.ylCheckList.join(',');
          this.form.expandContent.medInsurancePartStatus = this.checkListYl.join(',');
          this.form.expandContent = JSON.stringify(this.form.expandContent);
          this.form.personId = this.$route.params.id;

          if (this.propsId) {
            updatePersonExpand(this.form).then((res) => {
              this.$message.success('修改成功');
              this.$emit('success');
              this.$emit('close');
            });
          } else {
            addPersonExpand(this.form).then((res) => {
              this.$message.success('添加成功');
              this.$emit('success');
              this.$emit('close');
            });
          }
        }
      });
    },
    cancel() {
      this.$emit('close');
    },
    handleChange(value) {
      let data = this.$refs[value]?.getCheckedNodes();
      // this.form[`${value}Code`] = this[value].join(',');
      this.form.expandContent[value] = data[0].pathLabels.join(',');
    },
  },
};
</script>

<style scoped lang="scss">
.workInfoEditDialog {
}
.icon {
  cursor: pointer;
  color: red;
  margin: 5px 0 0 16px;
  font-size: 20px;
}
.peopleList {
  display: flex;
  // justify-content: space-between;
  .item {
    // flex: 20%;
    width: 46%;
  }
}
</style>
