<template>
  <el-dialog
    title="反馈"
    width="600px"
    :visible.sync="dialogVisible"
    @close="$emit('close')"
    :close-on-click-modal="false"
  >
    <section class="remark" v-if="info.feebackPerm === 1">
      <textarea v-model="form.logContent" name="" id="" cols="30" rows="5" placeholder="请输入反馈内容"></textarea>
      <el-upload
        class="upload"
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
      </el-upload>
    </section>
    <div v-else>
      <div class="change-people-box" v-if="info.permissionStatus">
        <div class="title">
          <span class="title-text">选择审核人</span>
          <i class="el-icon-info"></i>
          当事件需要分管领导审核，需要同时选择分管领导
        </div>
        <div class="change-type">
          <div class="department">
            <div class="department-title">科长</div>
            <el-radio-group v-model="form.departmentLeaderId">
              <el-radio v-for="(item, index) in departmentOptions" :key="item.userId" :label="item.userId">{{
                item.nickName
              }}</el-radio>
            </el-radio-group>
          </div>
          <template v-if="info.permissionStatus != 1">
            <!-- <i class="el-icon-d-arrow-right"></i> -->
            <div class="leader">
              <div class="leader-title">分管领导</div>
              <el-radio-group v-model="form.chargeLeaderId">
                <el-radio v-for="(item, index) in leaderOptions" :key="item.userId" :label="item.userId">{{
                  item.nickName
                }}</el-radio>
              </el-radio-group>
            </div>
          </template>
        </div>
      </div>
      <section class="remark">
        <textarea v-model="form.logContent" name="" id="" cols="30" rows="5" placeholder="请输入反馈内容"></textarea>
        <el-upload
          class="upload"
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
        </el-upload>
      </section>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleSave">提 交</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: ['info'],
  components: {},
  data() {
    return {
      dialogVisible: true,
      fileList: [],
      departmentOptions: [],
      leaderOptions: [],
      radio: 0,
      accept: ['.jpg', '.png'],
      form: {},
      headers: {
        Authorization: sessionStorage.token,
      },
    };
  },
  computed: {},
  watch: {},
  mounted() {
    console.log('this.info', this.info);
    this.getOptons();
  },
  methods: {
    handleSave() {
      if (this.info.feebackPerm !== 1) {
        if (this.info.permissionStatus == 1) {
          if (!!!this.form.departmentLeaderId) {
            this.$message.error('请选择科长!');
            return;
          }
        }
        if (this.info.permissionStatus == 2) {
          if (!!!this.form.departmentLeaderId) {
            this.$message.error('请选择科长!');
            return;
          }
          if (!!!this.form.chargeLeaderId) {
            this.$message.error('请选择分管领导!');
            return;
          }
        }
      }
      if (!!!this.form.logContent) {
        this.$message.error('请输入反馈内容!');
        return;
      }
      let formData = Object.assign(this.form, this.info, {
        flowType: '3',
      });
      formData.logFile = this.fileList.map((e) => {
        let { id, name, url } = e;
        return { id, name, url };
      });
      axios.post(`/petitionInfo/update`, formData).then(() => {
        this.$message.success('操作成功');
        this.$emit('success');
      });
    },
    getOptons() {
      axios({
        url: '/system/user/getStockUserByDivisionCode',
        method: 'post',
        data: {
          divisionCode: this.info.departCode.toString(),
        },
      }).then((res) => {
        this.departmentOptions = res.filter((item) => item.positionCode == 1);
        this.leaderOptions = res.filter((item) => item.positionCode == 2);
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
.title {
  display: flex;
  align-items: center;
  .title-text {
    margin: 0 16px 0 0;
  }
}
.change-type {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 16px 0;
  .department,
  .leader {
    width: 40%;
    border: 1px solid #eee;
    padding: 16px;
    box-sizing: border-box;
  }
}
.el-radio-group {
  display: flex;
  flex-direction: column;
  .el-radio {
    margin: 10px 0 0 0;
  }
}
</style>
<style scoped lang="scss">
.remark {
  padding: 16px;
  border: 1px solid #ddd;
  textarea {
    border: none;
    outline: none;
    width: 100%;
  }
}
::v-deep .el-upload--picture-card {
  width: 80px;
  height: 80px;
  line-height: 1;
  i {
    margin-top: 15px;
  }
}
::v-deep .el-upload-list--picture-card {
  .el-upload-list__item {
    width: 80px;
    height: 80px;
  }
}
</style>
