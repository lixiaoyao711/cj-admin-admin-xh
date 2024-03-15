<template>
  <div>
    <el-dialog title="详情" :visible.sync="dialogVisible" width="600px" :before-close="handleClose">
      <el-form :model="formData" class="scroll-form">
        <el-form-item label="接收部队：">
          <span>{{ formData.recipientName }}</span>
        </el-form-item>
        <el-form-item label="接收人：">
          <span>{{ formData.recipientName }}</span>
        </el-form-item>
        <el-form-item label="反映人：">
          <span>{{ formData.reflectPersonnel }}</span>
        </el-form-item>
        <el-form-item label="内容：" label-width="60px">
          <span>{{ formData.missionContent }}</span>
        </el-form-item>
        <el-form-item label="照片：" label-width="75px">
          <img
            style="margin-right: 6px"
            v-for="(item, index) in formData.filePath"
            :key="index"
            :src="item.url"
            alt=""
          />
        </el-form-item>
        <el-form-item label="处理记录" label-width="75px"> </el-form-item>
        <el-form-item label="" label-width="10px">
          <el-timeline>
            <el-timeline-item
              v-for="(item, index) in formData.logs"
              :key="index"
              color="#1890FF"
              :timestamp="item.createdDate"
              placement="top"
            >
              {{ item.actionContent }}
            </el-timeline-item>
          </el-timeline>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <!-- 所有需求详情 -->
        <div v-if="dad.tableTab === '1' && formData.status != '2'">
          <el-button @click="handleReject">驳 回</el-button>
          <el-button @click="feedbackItem">反 馈</el-button>
          <el-button @click="handleHand">流 转</el-button>
          <!-- <el-button type="primary" @click="handleReceive">接 收</el-button> -->

          <el-button type="text">
            <el-popconfirm title="确定接收吗？" @confirm="handleReceive">
              <el-button type="primary" size="small" class="del-button" slot="reference">认 领</el-button>
            </el-popconfirm>
          </el-button>
        </div>
        <!-- 我的代办详情 -->
        <div v-if="dad.tableTab === '2' && formData.status != '2'">
          <el-button @click="feedbackItem">反 馈</el-button>

          <el-button type="text">
            <el-popconfirm title="确定办结吗？" @confirm="handleOver">
              <el-button type="primary" size="small" class="del-button" slot="reference">办 结</el-button>
            </el-popconfirm>
          </el-button>
        </div>
        <!-- 我的已办详情 -->
        <div v-if="dad.tableTab === '3' || formData.status == '2'">
          <el-button @click="saveItem" type="primary" size="small" class="del-button">确 定</el-button>
        </div>
      </span>
    </el-dialog>
    <!-- 详情二级弹窗 -->
    <WorshipFeedback
      v-if="feedbackDialog"
      :titleName="feedbackTitleName"
      @close="feedbackClose"
      :propsData="feedbackData"
    />
  </div>
</template>

<script>
// 组件
import WorshipFeedback from './worshipFeedback.vue';
// api
export default {
  inject: ['dad'],
  props: {
    propsData: Object,
  },
  components: { WorshipFeedback },
  data() {
    return {
      dialogVisible: true,
      feedbackDialog: false,
      feedbackData: {},
      formData: {},
      feedbackTitleName: '反馈',
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.getDataByid();
  },
  methods: {
    getDataByid() {
      //   supportsGetById(this.propsData.id).then((res) => {
      //     this.formData = res;
      //   });
    },
    handleClose() {
      this.$emit('close');
    },
    saveItem() {
      this.$emit('close');
    },
    // 反馈
    feedbackItem() {
      this.feedbackTitleName = '反馈';
      this.feedbackData = JSON.parse(JSON.stringify(this.formData));
      this.feedbackDialog = true;
    },
    // 驳回
    handleReject() {
      this.feedbackTitleName = '驳回';
      this.feedbackData = JSON.parse(JSON.stringify(this.formData));
      this.feedbackDialog = true;
    },
    // 移交
    handleHand() {
      this.feedbackTitleName = '移交';
      this.feedbackData = JSON.parse(JSON.stringify(this.formData));
      this.feedbackDialog = true;
    },
    // 接收
    handleReceive() {
      //   supportsReceive(this.formData).then((res) => {
      //     this.$message.success('接收成功');
      //     this.$emit('close');
      //   });
    },
    // 办结
    handleOver() {
      //   supportsOver(this.formData).then((res) => {
      //     this.$message.success('办结成功');
      //     this.$emit('close');
      //   });
    },
    feedbackClose() {
      this.getDataByid();
      this.feedbackData = {};
      this.feedbackDialog = false;
    },
  },
};
</script>

<style scoped lang="scss">
img {
  width: 104px;
  height: 104px;
  background: #ffffff;
  border-radius: 2px;
  border: 1px solid rgba(0, 0, 0, 0.15);
}
// .el-form {
//   max-height: 61vh;
//   overflow: scroll;
// }
</style>
