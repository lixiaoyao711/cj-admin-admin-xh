<template>
  <div class="updateDialog">
    <el-dialog title="修改内容" top="30vh" :visible.sync="dialogVisible" width="400px" :before-close="handleClose">
      <el-input
        type="textarea"
        resize="none"
        :autosize="{ minRows: 5 }"
        placeholder="请输入内容"
        v-model="formData[updateType]"
      >
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="saveItem">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    propsData: Object,
    updateType: String,
  },
  components: {},
  data() {
    return {
      dialogVisible: true,
      formData: this.propsData,
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
      axios({
        url: '/petitionDailyLog/update',
        method: 'post',
        data: this.propsData,
      }).then((res) => {
        this.$emit('success');
      });
    },
  },
};
</script>

<style scoped lang="scss">
.updateDialog {
}
</style>
