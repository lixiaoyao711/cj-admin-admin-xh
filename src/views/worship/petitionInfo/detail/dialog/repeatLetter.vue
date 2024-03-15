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
            <span class="name">{{ form.petitionPersonName }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="登记人:" prop="reportPerson">
            <el-input v-model="form.reportPerson" maxlength="100"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="登记人电话:" prop="reportPhone">
            <el-input v-model="form.reportPhone" maxlength="100"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="登记日期:" prop="repartTime">
            <el-date-picker v-model="form.repartTime" type="date" value-format="yyyy-MM-dd" placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="登记级别:" prop="reportLevel">
            <el-select v-model="form.reportLevel" placeholder="请选择" clearable>
              <el-option
                v-for="dict in dict.type.sys_worship_djjb"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
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
              <fileUpload v-model="form.fileUrl" :fileSize="20"></fileUpload>
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
  </div>
</template>

<script>
import { checkPhone } from '@/utils/regular';
import { petitionInfoRepeat } from '@/api/worship/petitionInfo';
export default {
  props: ['info'],
  dicts: ['sys_worship_djjb'],
  components: {},
  data() {
    return {
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
        reportPerson: [{ required: true, message: '请输入登记人', trigger: 'blur' }],
        reportPhone: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (!value) {
                callback(new Error('请输入登记人电话'));
              } else if (!checkPhone(value)) {
                callback(new Error('请输入正确的手机号'));
              } else {
                callback();
              }
            },
          },
        ],
        repartTime: [{ required: true, message: '请选择登记日期', trigger: 'change' }],
        reportLevel: [{ required: true, message: '请选择登记级别', trigger: 'change' }],
        deadline: [{ required: true, message: '请选择截止日期', trigger: 'change' }],
        content: [{ required: true, message: '请输入诉求内容', trigger: 'blur' }],
      },
    };
  },
  computed: {},
  watch: {},
  created() {
    this.form = Object.assign({}, this.info);
    this.form.fileUrl = '';
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
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.form.petitionId = this.form.id;
          this.form.personName = this.form.petitionPersonName;
          delete this.form.id;
          petitionInfoRepeat(this.form).then(() => {
            this.$message.success('操作成功');
            this.$emit('success');
          });
        }
      });
    },
  },
};
</script>

<style scoped lang="scss">
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
</style>
<style lang="scss" scoped>
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
