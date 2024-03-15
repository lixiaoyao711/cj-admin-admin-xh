<template>
  <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body @close="cancel">
    <el-form ref="form" :model="form.expandContent" :rules="rules" label-width="160px">
      <el-row>
        <el-form-item label="时间：" prop="">
          <el-date-picker
            v-model="form.expandContent.time"
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="活动名称：" prop="">
          <el-input v-model="form.expandContent.activityName"></el-input>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="备注：" prop="">
          <el-input v-model="form.expandContent.msg" maxlength="200" type="textarea" show-word-limit></el-input>
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
  dicts: ['sys_worship_xyjrjsgx'],
  props: {
    propsId: '',
    title: {
      type: String,
      default: '',
    },
    expandChildType: {
      type: String,
      default: '',
    },
  },
  components: {},
  data() {
    return {
      open: true,
      form: {
        expandChildType: this.expandChildType,
        expandParentType: 'H',
        expandContent: {},
      },
      sex: ['是', '否'],

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
