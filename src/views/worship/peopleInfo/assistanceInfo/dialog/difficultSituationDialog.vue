<template>
  <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body @close="cancel">
    <el-form ref="form" :model="form.expandContent" :rules="rules" label-width="170px">
      <el-row>
        <el-form-item label="核实困难类型：" prop="difficultyType">
          <el-checkbox-group v-model="form.expandContent.difficultyType">
            <el-checkbox
              v-for="(dict, index) in dict.type.sys_worship_difficultyinidentification"
              :key="dict.label"
              :label="dict.label"
            ></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="困难情况说明：" prop="">
          <el-input
            type="textarea"
            maxlength="500"
            show-word-limit
            v-model="form.expandContent.explanationDifficulties"
          ></el-input>
        </el-form-item>
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
  dicts: ['sys_worship_difficultyinidentification'],
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
        expandChildType: 'I2',
        expandParentType: 'I',
        expandContent: {
          difficultyType: [],
        },
      },
      policySituation: ['低保', '特困', '不享受政策保障情况'],
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
          res.data.expandContent = JSON.parse(res.data.expandContent);
          this.form = res.data;
          console.log('getPersonExpandById', res, this.form);
          if (Object.keys(this.form.expandContent).length === 0) {
            // 为空字符串
            this.$set(this.form, 'expandContent', { difficultyType: [] });
          } else {
            this.form.expandContent.difficultyType = this.form.expandContent.difficultyType.split(',');
          }
        });
      }
    },
    submitForm() {
      this.$refs['form'].validate((val) => {
        if (val) {
          this.form.expandContent.difficultyType = this.form.expandContent.difficultyType.filter((item) => item); //去除空字符串
          let formData = JSON.parse(JSON.stringify(this.form));
          formData.expandContent.difficultyType = formData.expandContent.difficultyType.join(',');
          formData.expandContent = JSON.stringify(formData.expandContent);
          formData.personId = this.$route.params.id;
          console.log('submitForm', formData);
          if (this.propsId) {
            updatePersonExpand(formData).then((res) => {
              this.$message.success('修改成功');
              this.$emit('success');
              this.$emit('close');
            });
          } else {
            addPersonExpand(formData).then((res) => {
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
.line {
  background: #f2f2f2;
  height: 10px;
}
.title {
  font-size: 20px;
  color: #1890ff;
}
.check {
  margin: 6px 0 0 12px;
}
</style>
