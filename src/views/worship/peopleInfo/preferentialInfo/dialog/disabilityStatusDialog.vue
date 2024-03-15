<template>
  <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body @close="cancel">
    <el-form ref="form" :model="form.expandContent" :rules="rules" label-width="160px">
      <el-row>
        <el-form-item label="劳动能力：" prop="">
          <el-radio-group v-model="form.expandContent.laborCapacity">
            <el-radio v-for="(item, index) in laborCapacity" :key="index" :label="item">{{ item }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="生活能力：" prop="">
          <el-radio-group v-model="form.expandContent.livingAbility">
            <el-radio v-for="(item, index) in livingAbility" :key="index" :label="item">{{ item }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-row>

      <el-row>
        <el-form-item label="是否因患精神病评残：" prop="">
          <el-radio-group v-model="form.expandContent.mentalIllness">
            <el-radio v-for="(item, index) in collegeStudents" :key="index" :label="item">{{ item }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="残疾性质：" prop="">
          <el-radio-group v-model="form.expandContent.disabilityNature">
            <el-radio v-for="(item, index) in disabilityNature" :key="index" :label="item">{{ item }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="残疾等级：" prop="">
            <el-select v-model="form.expandContent.disabilityLevel" clearable>
              <el-option
                v-for="(item, index) in 9"
                :key="index"
                :label="`${index + 1}级`"
                :value="`${index + 1}级`"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="残疾证号：" prop="">
            <el-input v-model="form.expandContent.disabilityIdNumber"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="评残时间：" prop="">
            <el-date-picker
              v-model="form.expandContent.disabilityAssessmentTime"
              type="date"
              placeholder="选择日期"
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
</template>

<script>
import { getPersonExpandById, addPersonExpand, updatePersonExpand } from '@/api/worship/retiredSoldier';
export default {
  dicts: ['sys_worship_gydw', 'sys_worship_tuiyijunrenyoufuleibie'],
  props: {
    propsId: '',
    title: {
      type: String,
      default: '',
    },
  },
  components: {},
  data() {
    return {
      open: true,

      form: {
        expandChildType: 'G2',
        expandParentType: 'G',

        expandContent: {},
      },
      laborCapacity: ['具备劳动能力', '劳动功能障碍'],
      livingAbility: ['自理', '生活自理障碍'],
      disabilityNature: ['因战', '因公', '因病'],
      collegeStudents: ['是', '否'],
      supportSituation: ['集中供养', '分散供养', '无'],
      certificateCategory: [
        '职业资格证',
        '职业技能等级证',
        '专项职业能力证',
        '特种作业操作证',
        '全民技能提升培训合格证',
        '其他',
      ],
      customProps: {
        emitPath: true,
        label: 'name',
        value: 'adcode',
      },

      rules: {},
      conscriptionSite: [],
      largeUnits: [],
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
          if (Object.keys(this.form.expandContent).length === 0) {
            this.$set(this.form, 'expandContent', {});
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
    handleChange(value) {
      let data = this.$refs[value]?.getCheckedNodes();
      // this.form[`${value}Code`] = this[value].join(',');
      this.form.expandContent[value] = data[0].pathLabels.join(',');
    },
  },
};
</script>

<style scoped lang="scss">
.check {
  margin: 6px 0 0 12px;
}
</style>
