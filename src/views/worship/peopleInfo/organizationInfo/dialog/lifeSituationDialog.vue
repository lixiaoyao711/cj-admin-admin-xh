<template>
  <div class="workInfoEditDialog">
    <el-dialog title="参加组织生活情况" :visible.sync="open" width="900px" append-to-body @close="cancel">
      <el-form ref="form" :model="form.expandContent" :rules="rules" label-width="180px">
        <el-row>
          <el-col :span="11">
            <el-form-item label="所在党支部" prop="">
              <el-input v-model="form.expandContent.partyBranch"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="入党时间" prop="">
              <el-date-picker
                v-model="form.expandContent.partyJoiningTime"
                type="date"
                placeholder="选择日期"
                value-format="yyyy-MM-dd"
              >
              </el-date-picker> </el-form-item
          ></el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="是否按时缴纳党费" prop="">
              <el-radio-group v-model="form.expandContent.payPartyFeesOnTime">
                <el-radio label="是">是</el-radio>
                <el-radio label="否">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="是否担任党组织职务" prop="">
              <el-radio-group v-model="form.expandContent.holdPositionInPartyOrg">
                <el-radio label="是">是</el-radio>
                <el-radio label="否">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="是否脱离组织" prop="">
              <el-radio-group v-model="form.expandContent.whetherLeaveTheOrg">
                <el-radio label="是">是</el-radio>
                <el-radio label="否">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="上年度参加组织活动次数" prop="">
            <el-radio-group v-model="form.expandContent.lastYearNumPartOrgActivities">
              <el-radio label="0次">0次</el-radio>
              <el-radio label="1-5次">1-5次</el-radio>
              <el-radio label="6-10次">6-10次</el-radio>
              <el-radio label="10次以上">10次以上</el-radio>
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
  dicts: ['sys_worship_educationlevel', 'sys_worship_academicdegree'],
  components: {},
  data() {
    return {
      open: true,
      form: {
        expandChildType: 'B1',
        expandParentType: 'B',
        expandContent: {
          areaLeader: '',
          areaPhone: '',
          streetLeader: '',
          streetPhone: '',
          specialPerson: '',
          specialPhone: '',
        },
      },

      rules: {
        educationBackground: [{ required: true, message: '学历情况不能为空', trigger: 'blur' }],
        // name: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
      },
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
          console.log('🚀 ~ 组织生活情况:', res.data);
          this.form = res.data;
          this.form.expandContent = JSON.parse(this.form.expandContent);
          if (this.form.expandContent?.partyJoiningTime) {
            let dateArr = this.form.expandContent.partyJoiningTime.split('-');
            console.log('🚀 ~ getPersonExpandById ~ dateArr:', dateArr);
            if (dateArr.length == 2) {
              // 导入的数据只精确到月份 默认添加日期为01
              dateArr.push('01');
            }
            this.form.expandContent.partyJoiningTime = dateArr.join('-');
          }
        });
      }
    },
    submitForm() {
      this.$refs['form'].validate((val) => {
        if (val) {
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
</style>
