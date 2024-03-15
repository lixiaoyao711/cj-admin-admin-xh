<template>
  <el-dialog
    title="添加走访信息"
    width="650px"
    top="10vh"
    :visible.sync="dialogVisible"
    @close="$emit('close')"
    :close-on-click-modal="false"
  >
    <ul class="info">
      <li><span>姓名:</span>{{ info.name }}</li>
      <li><span>联系方式:</span>{{ info.telephone }}</li>
      <li><span>行政区划:</span>{{ info.departName }}</li>
      <li><span>最后走访日期:</span>{{ info.lastVisitDate ? info.lastVisitDate.split(' ')[0] : '' }}</li>
    </ul>
    <el-form :model="form" :rules="rules" ref="form" class="form" label-width="120px">
      <el-col :span="12">
        <el-form-item label="走访人:" prop="visitBy">
          <el-input v-model="form.visitBy" maxlength="20"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="走访人电话:" prop="visitPhone">
          <el-input v-model="form.visitPhone" maxlength="20"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="走访人方式:" prop="visitStyle">
          <el-select v-model="form.visitStyle">
            <el-option
              v-for="item in dictMap.visit_method"
              :key="item.dictCode"
              :label="item.dictLabel"
              :value="item.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="走访时间:" prop="visitDate">
          <el-date-picker
            :picker-options="pickerOptions"
            v-model="form.visitDate"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm"
            default-time="09:30:00"
            placeholder="选择时间"
          >
          </el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="走访内容:" prop="visitContent">
          <el-input
            type="textarea"
            v-model="form.visitContent"
            maxlength="1000"
            placeholder="字符长度不超过4000"
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
              list-type="picture-card"
              multiple
              :accept="accept.join(',')"
              :file-list="fileList"
            >
              <i class="el-icon-plus"></i><br />
              上传文件
              <!-- <el-button size="small" type=""><i class="el-icon-upload2"></i> 上传文件</el-button> -->
              <div slot="tip" class="el-upload__tip">只能上传{{ accept.join(',') }}的文件</div>
            </el-upload>
          </div>
        </el-form-item>
      </el-col>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleSave">保 存</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: ['info', 'row'],
  components: {},
  data() {
    return {
      dialogVisible: true,
      form: {},
      // 只能筛今天之前的日期
      pickerOptions: {
        // 限制时间
        disabledDate(time) {
          // 今天之后都禁用
          return time.getTime() > new Date();
        },
      },
      headers: {
        Authorization: sessionStorage.token,
      },
      fileList: [],
      deleteFile: [],
      accept: ['.jpg', '.png'],
      rules: {
        visitBy: [{ required: true, message: '请输入走访人', trigger: 'blur' }],
        visitPhone: [
          // {
          //     required: true,
          //     trigger: 'blur',
          //     validator: (rule, value, callback) => {
          //         if (!value) {
          //             callback(new Error('请输入走访人电话'));
          //         } else if (!testPhone(value)) {
          //             callback(new Error('请输入正确的手机号'));
          //         } else {
          //             callback();
          //         }
          //     },
          // },
        ],
        visitStyle: [{ required: true, message: '请选择走访人方式', trigger: 'change' }],
        visitDate: [{ required: true, message: '请选择走访时间', trigger: 'change' }],
        visitContent: [{ required: true, message: '请输入走访内容', trigger: 'blur' }],
      },
    };
  },
  computed: {
    dictMap() {
      return this.$store.state.dictMap;
    },
  },
  watch: {},
  mounted() {
    console.log(this.info, this.row);
    this.form.retireId = this.info.id;
    if (this.row) {
      this.form = Object.assign({}, this.form, this.row);
    }
    this.fileList = this.form.filePath || [];
    console.log(this.form);
  },
  methods: {
    transferText(tableData) {
      tableData.forEach((e) => {
        e.sexText = e.sex ? this.dictMap['sys_user_sex'][e.sex].dictLabel : ''; // 性别
        e.peopleCategoryText = e.peopleCategory ? this.dictMap['people_category'][e.peopleCategory].dictLabel : ''; // 人员类别
        e.politicalText = e.political ? this.dictMap['political_landscape'][e.political].dictLabel : ''; // 政治面貌
        e.sourceText = e.source ? this.dictMap['source'][e.source].dictLabel : ''; // 来源
      });
      console.log('transfer', tableData);
    },
    handleSave() {
      this.$refs['form'].validate((valid) => {
        if (!valid) {
          return;
        }
        let formData = Object.assign({}, this.form);
        formData.filePath = this.fileList.map((e) => {
          let { id, name, url } = e;
          return { id, name, url };
        });
        formData.delFileId = this.deleteFile.map((e) => e.id).join(',');
        console.log(formData);
        axios.post(`/petitionColorVisit/${this.row.id ? 'update' : 'add'}`, formData).then((res) => {
          this.$message.success('添加成功');
          this.dialogVisible = false;
          this.$emit('success');
        });
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
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
  },
};
</script>

<style scoped lang="scss">
.info {
  overflow: hidden;
  li {
    float: left;
    width: 50%;
    margin-bottom: 16px;
    display: flex;
    span {
      margin-right: 5px;
      width: 108px;
      padding-right: 12px;
      text-align: right;
    }
  }
}
.form {
  width: 100%;
  &::after {
    content: '';
    display: table;
    clear: both;
  }
}
.form .select,
.form .input {
  width: 40%;
  margin-right: 10px;
}
.subToolBar {
  display: flex;
  align-items: center;
  button {
    margin-left: 10px;
    i {
      font-size: 14px;
      margin-right: 3px;
    }
  }
}
.table {
  height: 45vh;
}
.pagination {
  text-align: center;
}
</style>
<style lang="scss" scoped>
.el-input,
.el-select,
.el-textarea {
  width: 100%;
}
</style>
<style lang="scss" scoped>
::v-deep {
  .el-upload--picture-card {
    width: 80px;
    height: 80px;
    line-height: 1;
    i {
      margin-top: 15px;
    }
  }
  .el-upload-list--picture-card {
    .el-upload-list__item {
      width: 80px;
      height: 80px;
    }
  }
}
</style>
