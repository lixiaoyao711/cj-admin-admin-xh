<template>
  <div class="addOrg">
    <el-dialog title="新建部门" :visible.sync="dialogVisible" width="400px" :before-close="handleClose">
      <span>
        <el-form :model="formData" :rules="rules" ref="ruleForm" label-width="60px" class="demo-ruleForm">
          <el-form-item label="名称" prop="deptName"> <el-input v-model="formData.deptName"></el-input> </el-form-item
        ></el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="saveItem">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { addDept } from '@/api/system/dept';
export default {
  props: {},
  components: {},
  data() {
    return {
      dialogVisible: true,
      formData: {},
      rules: {
        deptName: [{ required: true, message: '请输入部门名称', trigger: 'blur' }],
      },
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    handleClose() {
      this.$emit('close');
    },
    saveItem() {
      this.$refs['ruleForm'].validate((val) => {
        if (val) {
          let dept = {
            parentId: 0,
            deptName: this.formData.deptName,
            level: 1,
            orderNum: 0,
            status: 0,
            whetherStock: 1,
          };
          console.log(dept, 'dept');
          addDept(dept).then((res) => {
            this.$message.success('新建成功');
            this.$emit('success');
          });
        }
      });
    },
  },
};
</script>

<style scoped lang="scss">
.addOrg {
}
</style>
