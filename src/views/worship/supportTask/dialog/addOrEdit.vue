<template>
  <div>
    <el-dialog :title="titleName" :visible.sync="dialogVisible" width="40%" :before-close="handleClose">
      <el-form :rules="rules" ref="formRules" label-width="120px" :model="formData">
        <!-- <el-form-item label="接收部门">
          <el-select v-model="formData.type" placeholder="请选择">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="反映人员" prop="reflectPersonnel">
          <el-input v-model="formData.reflectPersonnel">
            <i slot="suffix" class="el-input__icon el-icon-user"></i>
          </el-input>
        </el-form-item>
        <el-form-item label="任务内容" prop="missionContent">
          <el-input
            resize="none"
            type="textarea"
            placeholder="请输入内容"
            v-model="formData.missionContent"
            show-word-limit
            :autosize="{
              minRows: 5,
            }"
          >
          </el-input>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="办结日期" prop="transferredDate">
              <el-date-picker
                v-model="formData.transferredDate"
                type="datetime"
                placeholder="选择日期"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd HH:mm"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="重要程度" prop="importance">
              <el-select v-model="formData.importance">
                <el-option
                  v-for="item in dictMap.info_level"
                  :key="item.dictCode"
                  :label="item.dictLabel"
                  :value="item.dictValue"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="照片">
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

      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="saveItem">确 定</el-button>
      </span>
      <el-dialog :visible.sync="imgDialogVisible">
        <img width="100%" :src="dialogImageUrl" alt="" />
      </el-dialog>
    </el-dialog>
  </div>
</template>

<script>
// api

export default {
  props: {
    titleName: String,
    propsData: Object,
  },
  components: {},
  data() {
    return {
      rules: {
        reflectPersonnel: [{ required: true, message: '请输入反映人员', trigger: 'change' }],
        missionContent: [{ required: true, message: '请输入任务内容', trigger: 'change' }],
        transferredDate: [{ required: true, message: '请选择', trigger: 'change' }],
        importance: [{ required: true, message: '请选择', trigger: 'change' }],
      },
      dialogVisible: true,
      imgDialogVisible: false,
      formData: {
        name: '',
        region: '',
        type: '',
      },

      // -------------------附件上传------------------
      dialogImageUrl: '',
      // 编辑回显List
      fileList: [],
      //文件格式
      accept: ['.jpg', '.png'],
      headers: {
        Authorization: sessionStorage.token,
      },
    };
  },
  computed: {
    dictMap() {
      return this.$store.state.dictMap;
    },
  },
  watch: {},
  created() {},
  mounted() {
    this.propsData.id ? (this.formData = this.propsData) : '';
    this.fileList = this.formData.filePath || [];
  },
  methods: {
    handleClose() {
      this.$emit('close');
    },
    saveItem() {
      this.$refs.formRules.validate((val) => {
        if (val) {
          this.formData.missionType = 0;
          this.formData.filePath = this.fileList.map((e) => {
            let { id, name, url } = e;
            return { id, name, url: url };
          });
          if (this.titleName === '新建内容') {
            // supportsAdd(this.formData).then((res) => {
            //   this.$message.success('新增成功');
            //   this.$emit('close');
            // });
          }
          if (this.titleName === '编辑内容') {
            // supportsUpdate(this.formData).then((res) => {
            //   this.$message.success('编辑成功');
            //   this.$emit('close');
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
      console.log(file);
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

<style scoped lang="scss">
.span1 {
  margin-right: 16px;
}
.el-icon-user {
  cursor: pointer;
}
.age {
  width: 4vw;
}
</style>
