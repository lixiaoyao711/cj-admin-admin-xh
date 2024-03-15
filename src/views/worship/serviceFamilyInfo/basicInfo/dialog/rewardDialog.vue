<template>
  <div class="workInfoEditDialog">
    <el-dialog title="奖惩情况" :visible.sync="open" width="1100px" append-to-body @close="cancel">
      <el-form ref="form" :model="form.expandContent" :rules="rules" label-width="140px">
        <el-form-item label="奖励奖项" prop="rewards">
          <el-checkbox-group v-model="rewards">
            <el-checkbox v-for="(dict, index) in dict.type.sys_worship_jlqk" :key="index" :label="dict.label">{{
              dict.label
            }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="奖励奖项说明" prop="">
          <el-input type="textarea" v-model="form.expandContent.rewardAndAwardMsg"></el-input>
        </el-form-item>
        <el-form-item label="处分" prop="">
          <el-checkbox-group v-model="punishment">
            <el-checkbox v-for="(dict, index) in dict.type.sys_worship_cfqk" :key="index" :label="dict.label">{{
              dict.label
            }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="惩罚处分说明" prop="">
          <el-input type="textarea" v-model="form.expandContent.punishmentMsg"></el-input>
        </el-form-item>
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
  dicts: ['sys_worship_jlqk', 'sys_worship_cfqk'],
  components: {},
  data() {
    return {
      open: true,
      form: {
        expandChildType: 'A6',
        expandParentType: 'A',
        expandContent: {},
      },
      rewards: [],
      punishment: [],

      rules: {
        rewards: [
          {
            validator: (rule, value, callback) => {
              if (this.rewards.length === 0) {
                callback(new Error('请选择奖励奖项'));
              } else {
                callback();
              }
            },
            trigger: 'blur',
            required: true,
          },
        ],
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
          this.form = res.data;
          this.form.expandContent = JSON.parse(this.form.expandContent);
          this.rewards = this.form.expandContent.rewardsAndAwards.split(',');
          this.punishment = this.form.expandContent.punishment.split(',');
        });
      }
    },
    submitForm() {
      this.$refs['form'].validate((val) => {
        if (val) {
          this.form.expandContent.rewardsAndAwards = this.rewards.join(',');
          this.form.expandContent.punishment = this.punishment.join(',');
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
