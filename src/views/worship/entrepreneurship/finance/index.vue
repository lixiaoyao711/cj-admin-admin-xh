<template>
  <div class="index">
    <div class="box">
      <el-form ref="form" :model="form" :rules="rules" label-width="0">
        <el-form-item label="" prop="title">
          <el-input :disabled="!isEdit" v-model="form.title" placeholder="标题" />
        </el-form-item>
        <el-form-item label="">
          <editor :disabled="!isEdit" v-model="form.content" :min-height="500" />
        </el-form-item>
      </el-form>
      <div class="dialog-footer">
        <el-button v-if="!isEdit" @click="edit">编 辑</el-button>
        <div v-else>
          <el-button @click="closeEdit">取消编辑</el-button>

          <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  listEntrepreneurship,
  getEntrepreneurship,
  updateEntrepreneurship,
  addEntrepreneurship,
} from '@/api/worship/entrepreneurship';
export default {
  props: {},
  components: {},
  data() {
    return {
      // 按钮loading
      buttonLoading: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        type: 1,
      },
      total: 0,
      tableList: [],
      //控制是否启用编辑
      isEdit: false,
      form: {
        title: '',
        content: '',
        type: 1,
      },
      // 表单校验
      rules: {
        title: [{ required: true, message: '标题不能为空', trigger: 'blur' }],
      },
    };
  },
  computed: {},
  watch: {},
  created() {
    this.getList();
  },
  mounted() {},
  methods: {
    /** 查询相关政策 */
    getList() {
      listEntrepreneurship(this.queryParams).then((response) => {
        if (response.rows.length) {
          this.form = response.rows[0];
        }

        this.total = response.total;
      });
    },
    edit() {
      this.isEdit = !this.isEdit;
    },
    closeEdit() {
      this.isEdit = !this.isEdit;
      this.getList();
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.buttonLoading = true;
          if (this.form.id != null) {
            updateEntrepreneurship(this.form)
              .then((response) => {
                this.$modal.msgSuccess('修改成功');
                this.open = false;
                this.getList();
                this.isEdit = !this.isEdit;
              })
              .finally(() => {
                this.buttonLoading = false;
              });
          } else {
            this.form.isRelease = 0;
            addEntrepreneurship(this.form)
              .then((response) => {
                this.$modal.msgSuccess('新增成功');
                this.open = false;
                this.getList();
                this.isEdit = !this.isEdit;
              })
              .finally(() => {
                this.buttonLoading = false;
              });
          }
        }
      });
    },
  },
};
</script>

<style scoped lang="scss">
.index {
  .box {
    padding: 20px;
    box-sizing: border-box;
    height: 78vh;
    overflow: scroll;
    background: #fff;
    .dialog-footer {
      float: right;
    }
  }
}
</style>
