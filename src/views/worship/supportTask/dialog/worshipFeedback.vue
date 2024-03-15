<template>
  <div>
    <el-dialog :title="titleName" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <div>
        <el-form v-if="titleName === '反馈'" :rules="rules" ref="formRules" :model="formData">
          <el-form-item label="" prop="feedback">
            <el-input
              :autosize="{
                minRows: 5,
              }"
              resize="none"
              type="textarea"
              placeholder="输入反馈内容"
              v-model="formData.feedback"
              show-word-limit
            >
            </el-input>
          </el-form-item>
          <el-form-item label="" prop="awardingPersonName">
            <div class="upload">
              <el-upload
                action="/common/upload"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :on-success="handleSuccess"
                :before-remove="beforeRemove"
                :headers="headers"
                multiple
                :accept="accept.join(',')"
                :file-list="fileList"
              >
                <el-button size="small" type=""><i class="el-icon-upload2"></i> 上传文件</el-button>
                <div slot="tip" class="el-upload__tip">只能上传{{ accept.join(',') }}的文件</div>
              </el-upload>
            </div>
          </el-form-item>
        </el-form>
        <el-form v-if="titleName === '驳回'" :rules="rules" ref="formRules" :model="formData">
          <el-form-item label="" prop="refuseReason">
            <el-input
              :autosize="{
                minRows: 5,
              }"
              resize="none"
              type="textarea"
              placeholder="输入驳回理由"
              v-model="formData.refuseReason"
              show-word-limit
            >
            </el-input>
          </el-form-item>
        </el-form>
        <el-form v-if="titleName === '移交'" label-width="10vw" :rules="rules" ref="formRules" :model="formData">
          <el-form-item label="部门" prop="recipientId">
            <el-select @change="departmentChange" clearable v-model="formData.recipientId">
              <el-option
                v-for="(item, index) in dad.departmentData"
                :key="index"
                :label="item.roleName"
                :value="item.roleId"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="saveItem">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// api
export default {
  inject: ['dad'],
  props: {
    propsData: Object,
    titleName: String,
  },
  components: {},
  data() {
    return {
      rules: {
        feedback: [{ required: true, message: '请输入反馈内容', trigger: 'change' }],
        refuseReason: [{ required: true, message: '请输入驳回理由', trigger: 'change' }],
        recipientId: [{ required: true, message: '请选择', trigger: 'change' }],
      },
      dialogVisible: true,
      formData: {},
      // -------------------附件上传------------------------
      fileList: [],
      //文件格式
      accept: ['.doc', '.docx', '.xls', '.xlsx', '.pdf', '.ppt', '.pptx', '.jpg', '.png'],
      headers: {
        Authorization: sessionStorage.token,
      },
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.propsData.id ? (this.formData = this.propsData) : '';
    // 如果刚认领进入流转部门清空,不然会回显一个没有的值
    this.titleName === '移交' && this.formData.recipientId === this.dad.userinfo.userId
      ? (this.formData.recipientId = '')
      : '';
    // 有反馈内容清空前一次的反馈内容
    this.formData.feedback ? (this.formData.feedback = '') : '';
    this.formData.refuseReason ? (this.formData.refuseReason = '') : '';
    console.log(this.formData.feedback);
  },
  methods: {
    handleClose() {
      this.$emit('close');
    },
    departmentChange(val) {
      let obj = this.dad.departmentData.find((item) => {
        return item.roleId === val;
      });
      this.formData.recipientName = obj.roleName;
    },
    saveItem() {
      this.$refs.formRules.validate((val) => {
        if (val) {
          if (this.titleName === '反馈') {
            this.formData.recipientName = this.dad.userinfo.nickName;
            this.formData.filePath = this.fileList.map((e) => {
              let { id, name, url } = e;
              return { id, name: name, url: url };
            });
            // supportsFeedback(this.formData).then(res => {
            //     this.$message.success('反馈成功');
            //     this.$emit('close');
            // });
          }
          if (this.titleName === '驳回') {
            this.formData.recipientName = this.dad.userinfo.nickName;
            this.formData.filePath = this.fileList.map((e) => {
              let { id, name, url } = e;
              return { id, name, url: url };
            });
            // supportsReject(this.formData).then(res => {
            //     this.$message.success('驳回成功');
            //     this.$emit('close');
            // });
          }
          if (this.titleName === '移交') {
            this.formData.filePath = this.fileList.map((e) => {
              let { id, name, url } = e;
              return { id, name, url: url };
            });
            // supportsHand(this.formData).then(res => {
            //     this.$message.success('移交成功');
            //     this.$emit('close');
            // });
          }
        }
      });
    },
    // -------------------附件上传------------------
    handleSuccess(res, file, fileList) {
      console.log(res, file, fileList);
      this.fileList = fileList;
      file.url = res.data.url;
      console.log(this.fileList);
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      // console.log(file);
      window.open(file.url);
      // window.open(`${process.env.VUE_APP_API_UPLOAD_PATH}?url=`+encodeURIComponent(this.$Base64.encode(file.url)));
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
  },
};
</script>
