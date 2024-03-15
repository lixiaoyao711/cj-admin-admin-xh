<template>
  <div class="workInfoEditDialog">
    <el-dialog title="退役军人村、社区“两委〞成员（兵支书）基本情况" :visible.sync="open" width="1080px" append-to-body @close="cancel">
      <el-form ref="form" :model="form.expandContent" :rules="rules" label-width="140px">
        <div class="form-title">本人情况</div>
        <el-row>
          <el-form-item label="职务" prop="">
            <el-checkbox-group v-model="postList">
              <el-checkbox v-for="(dict, index) in dict.type.sys_worship_bzszw" :key="index" :label="dict.label">{{
                dict.label
              }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="社会职务" prop="">
            <el-checkbox-group v-model="socialPositionList">
              <el-checkbox v-for="(dict, index) in dict.type.sys_worship_bzsshzw" :key="index" :label="dict.label">{{
                dict.label
              }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="首次任职时间" prop="">
              <el-date-picker
                v-model="form.expandContent.firstEmploymentTime"
                type="date"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="本届任期" prop="">
              <el-date-picker
                v-model="form.expandContent.currentTermTime"
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
          <el-col :span="12">
            <el-form-item label="离任时间" prop="">
              <el-date-picker
                v-model="form.expandContent.departureTime"
                type="date"
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
          <el-col :span="11">
            <el-form-item label="是否兼任乡镇干部" prop="">
              <el-radio-group v-model="form.expandContent.whetherConcurrentlyServeXz">
                <el-radio label="是">是</el-radio>
                <el-radio label="否">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="是否兼退役军人服务站长" prop="">
              <el-radio-group v-model="form.expandContent.whetherConcurrentlyServeTy">
                <el-radio label="是">是</el-radio>
                <el-radio label="否">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="有无村干部经历" prop="">
              <el-radio-group v-model="form.expandContent.expVillageCadres">
                <el-radio label="是">是</el-radio>
                <el-radio label="否">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="年限" prop="">
              <el-input v-model="form.expandContent.age" type="number"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="任期内受表彰情况" prop="">
            <el-checkbox-group v-model="recognitionStatusList">
              <el-checkbox v-for="(dict, index) in dict.type.sys_worship_bzsrqnbzqk" :key="index" :label="dict.label">{{
                dict.label
              }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="岗位年收入" prop="">
            <el-radio-group v-model="form.expandContent.annualIncome">
              <el-radio v-for="(item, index) in moneyList" :key="index" :label="item">{{ item }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="优势特长" prop="">
            <el-checkbox-group v-model="specialtiesList">
              <el-checkbox v-for="(dict, index) in dict.type.sys_worship_bzsystc" :key="index" :label="dict.label">{{
                dict.label
              }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="其他优势特长说明" prop="">
            <el-input v-model="form.expandContent.otherStrengths"></el-input>
          </el-form-item>
        </el-row>
        <div class="form-title">任职村(社区)情况</div>
        <el-row>
          <el-col :span="12">
            <el-form-item label="名称" prop="">
              <el-input v-model="form.expandContent.streetName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="人口数量" prop="">
              <el-input type="number" v-model="form.expandContent.personNum"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="村集体经济年收入(万元)" prop="">
            <el-input v-model="form.expandContent.collectiveAnnualIncome" type="number"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="区域面积(平方公里)" prop="">
              <el-input v-model="form.expandContent.area" type="number"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="“两委” 成员总人数" prop="">
              <el-input type="number" v-model="form.expandContent.totalNumberOfMembers"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="特色产业" prop="">
            <el-checkbox-group v-model="industryList">
              <el-checkbox v-for="(dict, index) in dict.type.sys_worship_bzstscy" :key="index" :label="dict.label">{{
                dict.label
              }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="其他特色产业说明" prop="">
            <el-input v-model="form.expandContent.otherIndustry"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="受表彰级别" prop="">
            <el-checkbox-group v-model="commendationLevelList">
              <el-checkbox v-for="(dict, index) in dict.type.sys_worship_bzsrqnbzqk" :key="index" :label="dict.label">{{
                dict.label
              }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="表彰事项" prop="">
            <el-checkbox-group v-model="commendationMattersList">
              <el-checkbox v-for="(dict, index) in dict.type.sys_worship_bzsbzsh" :key="index" :label="dict.label">{{
                dict.label
              }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="其他表彰事项说明" prop="">
            <el-input v-model="form.expandContent.otherCommendationMatters"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="年度工作满意度评价" prop="">
            <el-radio-group v-model="form.expandContent.jobSatisfactionEvaluation">
              <el-radio v-for="(item, index) in satisfactionList" :key="index" :label="item">{{ item }}</el-radio>
            </el-radio-group>
          </el-form-item>
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
  dicts: [
    'sys_worship_bzszw',
    'sys_worship_bzsshzw',
    'sys_worship_bzsrqnbzqk',
    'sys_worship_bzsystc',
    'sys_worship_bzstscy',
    'sys_worship_bzsbzsh',
  ],
  components: {},
  data() {
    return {
      open: true,
      postList: [],
      socialPositionList: [],
      recognitionStatusList: [],
      specialtiesList: [],
      industryList: [],
      commendationLevelList: [],
      commendationMattersList: [],
      form: {
        expandChildType: 'B2',
        expandParentType: 'B',
        expandContent: {},
      },

      rules: {
        educationBackground: [{ required: true, message: '学历情况不能为空', trigger: 'blur' }],
        // name: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
      },
      moneyList: ['1万以下', '1-3万', '3-5万', '5-8万', '8-12万', '12-18万', '18万以上', '公益(不领取报酬)'],
      satisfactionList: ['优秀', '称职', '基本称职', '不称职'],
    };
  },
  computed: {},
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
          this.postList = this.form.expandContent.post.split(',');
          this.socialPositionList = this.form.expandContent.socialPosition.split(',');
          this.recognitionStatusList = this.form.expandContent.recognitionStatus.split(',');
          this.specialtiesList = this.form.expandContent.specialties.split(',');
          this.industryList = this.form.expandContent.industry.split(',');
          this.commendationLevelList = this.form.expandContent.commendationLevel.split(',');
          this.commendationMattersList = this.form.expandContent.commendationMatters.split(',');
        });
      }
    },
    submitForm() {
      this.$refs['form'].validate((val) => {
        if (val) {
          this.form.expandContent.post = this.postList.join(',');
          this.form.expandContent.socialPosition = this.socialPositionList.join(',');
          this.form.expandContent.recognitionStatus = this.recognitionStatusList.join(',');
          this.form.expandContent.specialties = this.specialtiesList.join(',');
          this.form.expandContent.industry = this.industryList.join(',');
          this.form.expandContent.commendationLevel = this.commendationLevelList.join(',');
          this.form.expandContent.commendationMatters = this.commendationMattersList.join(',');
          this.form.expandContent.currentTerm = [
            this.form.expandContent?.currentTermTime?.[0],
            this.form.expandContent?.currentTermTime?.[1],
          ];
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
.form-title {
  color: #3fa3ff;
  font-weight: 600;
  font-size: 22px;
}
</style>
