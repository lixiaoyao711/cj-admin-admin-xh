<template>
  <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body @close="cancel">
    <el-form ref="form" :model="form.expandContent" :rules="rules" label-width="160px">
      <el-form-item label="宣传方式：" prop="">
        <el-input v-model="form.expandContent.promotionMethods" clearable></el-input>
      </el-form-item>
      <el-form-item label="宣传内容：" prop="">
        <el-input v-model="form.expandContent.promotionContent" clearable></el-input>
      </el-form-item>
      <el-form-item label="宣传媒体：" prop="">
        <el-input v-model="form.expandContent.propagandaMedia" clearable></el-input>
      </el-form-item>
      <el-form-item label="时间：" prop="">
        <el-date-picker
          v-model="form.expandContent.time"
          type="date"
          placeholder="选择日期"
          value-format="yyyy-MM-dd"
          clearable
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="备注：" prop="">
        <el-input v-model="form.expandContent.msg" clearable></el-input>
      </el-form-item>
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
  dicts: [],
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
        expandChildType: 'H8',
        expandParentType: 'H',
        expandContent: {},
      },
      rules: {},
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
