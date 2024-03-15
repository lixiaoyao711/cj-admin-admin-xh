<template>
  <div class="backMsg">
    <el-dialog title="反馈" :visible.sync="dialogVisible" width="500px" :before-close="handleClose">
      <el-form :model="formData" :rules="rules" ref="formData" class="demo-formData">
        <el-form-item label="反馈信息" prop="feedbackContent">
          <el-input
            type="textarea"
            :autosize="{ minRows: 6 }"
            resize="none"
            placeholder="请输入内容"
            v-model="formData.feedbackContent"
          >
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="saveItem">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    propsData: Object,
  },
  components: {},
  data() {
    return {
      dialogVisible: true,
      formData: {},
      rules: {
        feedbackContent: [{ required: true, message: '请输入反馈信息', trigger: 'blur' }],
      },
    };
  },
  computed: {
    userInfo() {
      return this.$store.state.userinfo;
    },
  },
  watch: {},
  created() {},
  mounted() {
    this.formData = this.propsData;
  },
  methods: {
    saveItem() {
      const { id, enableTrackingUserId, feedbackContent } = this.formData;
      const { userId, nickName } = this.userInfo;
      this.$refs.formData.validate((val) => {
        if (val) {
          axios({
            url: '/petitionFeedback/add',
            method: 'post',
            data: {
              petitionId: id,
              enableTrackingUserId,
              feedbackContent,
              feedbackUserId: userId,
              feedbackUserName: nickName,
            },
          }).then((res) => {
            this.$message.success('操作成功');
            this.handleClose();
          });
        }
      });
    },
    handleClose() {
      this.$emit('close');
    },
  },
};
</script>

<style scoped lang="scss">
.backMsg {
}
</style>
