<template>
  <div class="workInfoEditDialog">
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body @close="cancel">
      <el-form ref="form" :model="form" :rules="rules" label-width="170px">
        <el-row>
          <el-form-item label="困难原因：" prop="">
            <el-input type="textarea" maxlength="500" show-word-limit v-model="form.difficultReasons"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="帮扶内容：" prop="">
            <el-input v-model="form.assistanceContent"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="帮扶人：" prop="">
            <el-input v-model="form.helper"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="帮扶人电话：" prop="">
            <el-input v-model="form.helperPhone"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="帮扶时间：" prop="">
            <el-date-picker v-model="form.assistanceTime" type="date" placeholder="选择日期" value-format="yyyy-MM-dd">
            </el-date-picker>
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
import { getVisiting, addVisiting, updateVisiting } from '@/api/worship/visiting';

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
      form: {},
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
        getVisiting(this.propsId).then((res) => {
          this.form = res.data;
        });
      }
    },
    submitForm() {
      this.$refs['form'].validate((val) => {
        if (val) {
          // this.form.expandContent = JSON.stringify(this.form.expandContent);
          this.form.personId = this.$route.params.id;
          if (this.propsId) {
            updateVisiting(this.form).then((res) => {
              this.$message.success('修改成功');
              this.$emit('success');
              this.$emit('close');
            });
          } else {
            addVisiting(this.form).then((res) => {
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
