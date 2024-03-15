<template>
  <div class="addLeader">
    <el-dialog
      :title="titleName"
      append-to-body
      :visible.sync="dialogVisible"
      width="600px"
      :before-close="handleClose"
    >
      <el-form ref="formData" :model="formData" :rules="rules" label-width="100px">
        <el-form-item label="预约人：" prop=" ">
          {{ formData.visitorName }}
        </el-form-item>
        <el-form-item label="预约时间：" prop=" ">
          {{ formData.visitorTime }}
        </el-form-item>
        <el-form-item label="预约地点：" prop=" ">
          {{ formData.appointmentAddress }}
        </el-form-item>
        <el-form-item label="到访主题：" prop=" ">
          {{ formData.visitTheme }}
        </el-form-item>

        <div class="line"></div>

        <el-form-item label="接待人：" prop=" ">
          <el-input :disabled="titleName === '详情'" v-model="formData.receptionName"></el-input>
        </el-form-item>
        <el-form-item label="接待时间：" prop="">
          <el-date-picker
            :disabled="titleName === '详情'"
            v-model="formData.receptionTime"
            type="datetime"
            placeholder="选择日期"
            value-format="yyyy-MM-dd HH:mm:ss"
            format="yyyy-MM-dd HH:mm"
          >
          </el-date-picker>
          <!-- <el-input :disabled="titleName === '详情'" v-model="formData.receptionTime"></el-input> -->
        </el-form-item>
        <el-form-item label="接待地点：" prop="">
          <el-input :disabled="titleName === '详情'" v-model="formData.receptionAddress"></el-input>
        </el-form-item>

        <el-form-item label="上传照片："
          ><el-upload
            :disabled="titleName === '详情'"
            action="/common/upload"
            list-type="picture-card"
            :accept="accept.join(',')"
            :on-preview="handlePictureCardPreview"
            :on-success="handleAvatarSuccess"
            :on-remove="handleRemove"
            :file-list="fileList"
            :headers="headers"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <span class="upload-type">支持上传照片或视频</span>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="saveItem">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="imgDialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    propsData: Object,
    titleName: String,
  },
  components: {},
  data() {
    return {
      dialogVisible: true,
      showPeopleSelect: false,
      accept: ['.jpg', '.png', '.avi', '.wmv', '.mpeg', '.mp4'],
      rules: {
        name: [{ required: true, message: '请选择被接待人', trigger: 'change' }],
        visitTime: [{ required: true, message: '请选择接访日期', trigger: 'blur' }],
      },

      formData: {
        name: '',
        participants: '',
        convener: '',
      },
      fileList: [],
      dialogImageUrl: '',
      imgDialogVisible: false,
      deleteFile: [],
      headers: {
        Authorization: sessionStorage.token,
      },
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    if (this.propsData.id) {
      this.formData = this.propsData;
      this.fileList = this.propsData?.filePath || [];
    }
  },
  methods: {
    handleClose() {
      this.$emit('close');
    },

    saveItem() {
      if (this.titleName === '详情') {
        this.handleClose();
        return;
      }

      this.formData.filePath = this.fileList.map((e) => {
        let { id, name, url } = e;
        return { id, name, url };
      });
      this.formData.delFileId = this.deleteFile.map((e) => e.id).join(',');

      this.$refs.formData.validate((val) => {
        if (val) {
          axios({
            url: `/visitorsAppointment/update`,
            method: 'post',
            data: this.formData,
          }).then((res) => {
            this.$message.success('操作成功');
            this.handleClose();
          });
        }
      });
    },
    peopleSelectSuccess(people) {
      console.log(people);
      this.$set(this.formData, 'name', people.name);
      this.formData.retireId = people.id;
      this.showPeopleSelect = false;
    },
    // 文件上传相关
    handleAvatarSuccess(res, file, fileList) {
      console.log(fileList);
      this.fileList = fileList;
      file.url = res.data.url;

      this.dialogImageUrl = URL.createObjectURL(file.raw);
    },

    handleRemove(file, fileList) {
      console.log(file, fileList);
      this.fileList = fileList;
      this.deleteFile.push(file);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.imgDialogVisible = true;
    },
  },
};
</script>

<style scoped lang="scss">
.addLeader {
  .el-tag {
    cursor: pointer;
  }
  .el-icon-remove-outline {
    margin-left: 10px;
    line-height: 32px;
    cursor: pointer;
  }

  .upload-type {
    color: #a7a9aa;
  }
}
.line {
  height: 10px;
  background: #f2f2f2;
  margin-bottom: 20px;
}
</style>
