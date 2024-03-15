<template>
  <div class="">
    <el-dialog
      title="重复上访"
      width="48%"
      :visible.sync="dialogVisible"
      @close="$emit('close')"
      :close-on-click-modal="false"
    >
      <el-form :model="form" :rules="rules" ref="form" class="form" label-width="100px" :inline="true">
        <el-col :span="24">
          <el-form-item label="信访人:">
            <span class="name">{{ form.name }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="登记人:" prop="reportUser">
            <el-input v-model="form.reportUser" maxlength="100"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="登记人电话:" prop="reportPhone">
            <el-input v-model="form.reportPhone" maxlength="100"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="登记日期:" prop="petitionDate">
            <el-date-picker v-model="form.petitionDate" type="date" value-format="yyyy-MM-dd" placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="登记级别:" prop="infoSource">
            <el-select v-model="form.infoSource" placeholder="请选择">
              <el-option
                v-for="item in dictMap.info_source"
                :key="item.dictCode"
                :label="item.dictLabel"
                :value="item.dictValue"
              ></el-option
            ></el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="诉求内容:" prop="content">
            <el-input
              type="textarea"
              :autosize="{ minRows: 6, maxRows: 8 }"
              v-model="form.content"
              maxlength="1000"
              show-word-limit
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="附件:">
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
        </el-col>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <!-- <el-button @click="sendTo('1')">上 报</el-button>
                <el-button @click="sendTo('2')">下 派</el-button> -->
        <el-button type="primary" @click="handleSave">提 交</el-button>
      </span>
    </el-dialog>
    <Up v-if="showUp" :info="activeInfo" @close="showUp = false" @success="upSuccess"></Up>
  </div>
</template>

<script>
import Up from './up.vue';
export default {
  props: ['info'],
  components: {
    Up,
  },
  data() {
    return {
      showUp: false,
      dialogVisible: true,
      fileList: [],
      deleteFile: [],
      accept: ['.doc', '.docx', '.xls', '.xlsx', '.pdf', '.ppt', '.pptx', '.jpg', '.png'],
      headers: {
        Authorization: sessionStorage.token,
      },
      form: {},
      activeInfo: {},
      radio: '',
      rules: {
        reportUser: [{ required: true, message: '请输入登记人', trigger: 'blur' }],
        reportPhone: [
          // {
          //   required: true,
          //   trigger: 'blur',
          //   validator: (rule, value, callback) => {
          //     if (!value) {
          //       callback(new Error('请输入登记人电话'));
          //     } else if (!testPhone(value)) {
          //       callback(new Error('请输入正确的手机号'));
          //     } else {
          //       callback();
          //     }
          //   },
          // },
        ],
        petitionDate: [{ required: true, message: '请选择登记日期', trigger: 'change' }],
        infoSource: [{ required: true, message: '请选择登记级别', trigger: 'change' }],
        deadline: [{ required: true, message: '请选择截止日期', trigger: 'change' }],
        content: [{ required: true, message: '请输入诉求内容', trigger: 'blur' }],
      },
    };
  },
  computed: {
    userinfo() {
      return this.$store.state.userinfo;
    },
    dictMap() {
      return this.$store.state.dictMap;
    },
  },
  watch: {
    userinfo: {
      handler(user) {
        this.form.reportUser = user.nickName;
        this.form.reportPhone = user.phoneNumber;
      },
    },
  },
  created() {
    this.form = Object.assign({}, this.info);
    this.fileList = this.info.filePath || [];
  },
  methods: {
    getDetail() {
      axios({
        methods: 'get',
        url: '/petitionInfoRepeat/getById',
        params: { id: this.info.id },
      }).then((res) => {
        console.log('detailId', res);
        this.form = Object.assign(this.form, res);
        this.fileList = res.filePath || [];
      });
    },
    handleSuccess(res, file, fileList) {
      console.log(res, file, fileList);
      this.fileList = fileList;
      file.url = res.data.url;
      console.log(this.fileList);
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
      this.fileList = fileList;
      this.deleteFile.push(file);
    },
    handlePreview(file) {
      console.log(file);
      window.open(file.url);
      // window.open(`${process.env.VUE_APP_API_UPLOAD_PATH}?url=`+encodeURIComponent(this.$Base64.encode(file.url)));
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    validate(type) {
      // type =0 保存   type =1 上报或下派
      // 当type=1时候flowType 也要传 flowType:1：上报 2：下派 3：反馈 4：办结 5：退回 6：驳回 7：审核通过 8：评价
      return new Promise((resolve, reject) => {
        this.$refs['form'].validate((valid) => {
          if (!valid) {
            return reject();
          }
          let formData = Object.assign({}, this.form);
          formData.filePath = this.fileList;
          resolve(formData);
        });
      });
    },
    handleSave(type) {
      this.validate(type).then((formData) => {
        if (!!this.info.disposeFlag) {
          formData.type = 1;
          formData.flowType = '4';
          formData.state = 2;
        } else {
          formData.type = 0;
          formData.flowType = '0';
        }
        formData.filePath = this.fileList.map((e) => {
          let { id, name, url } = e;
          return { id, name, url };
        });
        formData.delFileId = this.deleteFile.map((e) => e.id).join(',');
        axios.post(`/petitionInfoRepeat/${this.info.id ? 'update' : 'add'}`, formData).then(() => {
          this.$message.success('操作成功');
          this.dialogVisible = false;
          this.$emit('success');
        });
      });
    },
    upSuccess() {
      this.showUp = false;
      this.dialogVisible = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.main-tab {
  margin-bottom: 16px;
}
.form {
  width: 100%;
  margin-bottom: 20px;
  .name {
    font-size: 24px;
    font-weight: bold;
    margin-right: 10px;
    vertical-align: bottom;
  }
  &::after {
    content: '';
    display: table;
    clear: both;
  }
}
::v-deep .el-form-item__content {
  width: calc(100% - 100px);
}
::v-deep .el-col-24 {
  .el-form-item {
    display: block;
  }
}
::v-deep .el-input {
  width: 100%;
}
</style>
