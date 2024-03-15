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
      <imageUpload v-model="form.flowFileUrl" :fileSize="20"></imageUpload>
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
        <imageUpload v-model="form.flowFileUrl" :fileSize="20"></imageUpload>
      </section>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleSave">提 交</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { petitionInfoPost, getUserListByDivCodeAndPostName } from '@/api/worship/petitionInfo';
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
      formData: {},
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

      let obj = {
        id: this.info.id,
        petitionInfoFlowBo: {
          operType: 4,
          flowContent: this.form.logContent,
          flowFileUrl: this.form.flowFileUrl,
          departmentLeaderId: this.form.departmentLeaderId,
          chargeLeaderId: this.form.chargeLeaderId,
        },
      };

      petitionInfoPost(obj).then(() => {
        this.$message.success('操作成功');
        this.$emit('success');
      });
    },
    getOptons() {
      getUserListByDivCodeAndPostName({
        divisionCode: this.$store.state.user.divisionCode,
        postName: '科长',
      }).then((res) => {
        this.departmentOptions = res.data;
      });
      getUserListByDivCodeAndPostName({
        divisionCode: this.$store.state.user.divisionCode,
        postName: '分管领导',
      }).then((res) => {
        this.leaderOptions = res.data;
      });
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
.remark {
  padding: 16px;
  border: 1px solid #ddd;
}
textarea {
  border: none;
  outline: none;
  width: 100%;
}
::v-deep .el-upload--picture-card {
  width: 80px;
  height: 80px;
  line-height: 80px;
}
// i {
//   margin-top: 15px;
// }
::v-deep .el-upload-list--picture-card .el-upload-list__item {
  width: 80px;
  height: 80px;
}
</style>
