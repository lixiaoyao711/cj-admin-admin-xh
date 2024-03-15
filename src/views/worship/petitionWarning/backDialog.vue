<template>
  <div class="backDialog">
    <el-dialog title="反馈" append-to-body :visible.sync="dialogVisible" width="600px" :before-close="handleClose">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
        <el-form-item label="" prop="logContent">
          <el-input
            v-model="ruleForm.logContent"
            type="textarea"
            placeholder="请输入反馈内容"
            :autosize="{ minRows: 8 }"
            resize="none"
          ></el-input>
        </el-form-item>
        <el-form-item label="" prop="name">
          <fileUpload v-model="ruleForm.fileUrl"></fileUpload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="saveItem">确 定</el-button>
      </span>
      <el-dialog :visible.sync="imgDialogVisible" append-to-body>
        <img width="100%" :src="dialogImageUrl" alt="" />
      </el-dialog>
    </el-dialog>
  </div>
</template>

<script>
import { feedback } from '@/api/worship/petitionWarning';
export default {
  props: {},
  components: {},
  data() {
    return {
      dialogVisible: true,
      ruleForm: {
        content: '',
      },
      rules: {
        logContent: [{ required: true, message: '请输入', trigger: 'blur' }],
      },
      fileList: [],
      dialogImageUrl: '',
      imgDialogVisible: false,

      headers: {
        Authorization: sessionStorage.token,
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
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          feedback({
            warningId: this.$route.params.id,
            ...this.ruleForm,
          }).then((res) => {
            this.$message.success('反馈成功');
            this.$emit('save');
          });
        } else {
          return false;
        }
      });
    },
    // 文件上传相关
    handleAvatarSuccess(res, file, fileList) {
      console.log(fileList);
      this.fileList = fileList;
      file.url = res.data.url;
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
      this.fileList = fileList;
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.imgDialogVisible = true;
    },
  },
};
</script>

<style scoped lang="scss">
.backDialog {
}
</style>
