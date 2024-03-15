<template>
  <div>
    <el-dialog title="详情" :visible.sync="dialogVisible" width="700px" :before-close="handleClose">
      <el-form :model="formData" class="scroll-form" label-width="120px" label-position="left">
        <el-row>
          <el-col :span="12">
            <el-form-item label="接收部队/部门：">
              <span>{{ formData.receiveDeptName }}</span>
            </el-form-item></el-col
          >

          <el-col :span="12">
            <el-form-item label="创建人：">
              <span>{{ formData.createName }}</span>
            </el-form-item></el-col
          >
          <el-col :span="12">
            <el-form-item label="任务类型：">
              <dict-tag :options="dict.type.sys_worship_rwlx" :value="formData.taskType" /> </el-form-item
          ></el-col>
          <el-col :span="12">
            <el-form-item label="办结期限：">
              <span>{{ formData.finishDate }}</span>
            </el-form-item></el-col
          >
          <el-col :span="12">
            <el-form-item label="重要程度：">
              <dict-tag :options="dict.type.sys_worship_jjcd" :value="formData.urgencyLevel" /> </el-form-item
          ></el-col>
          <el-col :span="24">
            <el-form-item label="内容：">
              <span>{{ formData.taskContent }}</span>
            </el-form-item></el-col
          >
        </el-row>
        <el-form-item label="附件内容：">
          <template v-if="formData.fileUrl">
            <div
              @click="openFile(`${baseOss}${item.ossId}`)"
              class="paperclip"
              style="margin-right: 6px; color: #409eff"
              v-for="(item, index) in JSON.parse(formData.fileUrl)"
              :key="index"
            >
              {{ item.name }}
            </div>
          </template>
        </el-form-item>
        <el-form-item label="处理记录"> </el-form-item>
        <el-form-item label="">
          <el-timeline>
            <el-timeline-item
              v-for="(item, index) in formData.logList"
              :key="index"
              color="#1890FF"
              :timestamp="item.createTime"
              placement="top"
            >
              <div>
                {{ item.operLog }}
              </div>
              <div>
                {{ item.logContent }}
              </div>
              <template v-if="item.fileUrl">
                <div class="paperclip" v-for="(upload, indey) in JSON.parse(item.fileUrl)" :key="indey">
                  <i class="el-icon-paperclip">
                    <a :href="upload.url" target="_blank" class="attach">{{ upload.name }}</a>
                  </i>
                </div>
              </template>
            </el-timeline-item>
          </el-timeline>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <!-- 接受部门id和登录人部门id相同显示这些按钮 -->
        <el-button v-if="isBtn" type="text">
          <!-- 状态为待认领显示这些按钮 -->
          <div v-if="formData.state == '0'">
            <el-button @click="handleReject">退 回</el-button>
            <el-button v-if="userType == 0" @click="handleHand">转 交</el-button>
            <el-button type="text">
              <el-popconfirm title="确定认领吗？" @confirm="handleReceive('认领')">
                <el-button type="primary" size="small" class="del-button" slot="reference">认 领</el-button>
              </el-popconfirm>
            </el-button>
          </div>
          <div v-if="formData.state == '1'">
            <el-button @click="feedbackItem">反 馈</el-button>
            <el-button type="text">
              <el-popconfirm title="确定完成任务吗？" @confirm="handleReceive('完成')">
                <el-button type="primary" size="small" class="del-button" slot="reference">完成任务</el-button>
              </el-popconfirm>
            </el-button>
          </div>
        </el-button>
        <!-- 已完成||已驳回不显示任何流程操作按钮 -->
        <el-button @click="saveItem" type="primary" size="small" class="del-button">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 详情二级弹窗 -->
    <AirServiceFeedback
      v-if="feedbackDialog"
      :titleName="feedbackTitleName"
      @close="feedbackClose"
      :propsData="feedbackData"
    />
    <!-- 转交选人 -->
    <Up v-if="upDialog" @close="upClose" />
  </div>
</template>

<script>
// 组件
import AirServiceFeedback from './airServiceFeedback';
// api
import { getSupportTask, postSupportTask, getUserDeptType } from '@/api/worship/supportTask';
import Up from './up.vue';

export default {
  dicts: ['sys_worship_rwzt', 'sys_worship_jjcd', 'sys_worship_rwlx'],

  inject: ['dad'],
  props: {
    propsData: Object,
  },
  components: { AirServiceFeedback, Up },
  data() {
    return {
      dialogVisible: true,
      feedbackDialog: false,
      upDialog: false,
      feedbackData: {},
      formData: {},
      feedbackTitleName: '反馈',
      backMap: {
        转交: 1,
        认领: 2,
        退回: 3,
        完成: 4,
        反馈: 5,
        编辑: 6,
      },
      userType: 0,
    };
  },
  computed: {
    isBtn() {
      return this.formData.receiveDeptId === this.userInfo.deptId;
    },
    userInfo() {
      return this.$store.state.user.user;
    },
  },
  watch: {},
  created() {},
  async mounted() {
    await this.getDataByid();
    this.getUserType();
  },
  methods: {
    async getDataByid() {
      const { data } = await getSupportTask(this.propsData.id);
      this.formData = data;
    },
    async getUserType() {
      const { data } = await getUserDeptType(this.userInfo.userId);

      this.userType = data;
      if (data == 1) {
      }
    },
    upClose(data) {
      const obj = {
        id: this.formData.id,
        operType: 1,
        targetDeptId: data.id,
        targetDeptName: data.label,
      };
      postSupportTask(obj).then((res) => {
        this.$message.success('转交成功');
        this.upDialog = false;
        this.getDataByid();
      });
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
    // 退回
    handleReject() {
      this.feedbackTitleName = '退回';
      this.feedbackData = JSON.parse(JSON.stringify(this.formData));
      this.feedbackDialog = true;
    },
    // 移交
    handleHand() {
      // this.feedbackTitleName = '移交';
      // this.feedbackData = JSON.parse(JSON.stringify(this.formData));
      this.upDialog = true;
    },
    // 接收
    handleReceive(type) {
      this.formData.operType = this.backMap[type];
      postSupportTask(this.formData).then((res) => {
        this.$message.success('认领成功');
        this.$emit('close');
      });
    },

    feedbackClose() {
      this.getDataByid();
      this.feedbackData = {};
      this.feedbackDialog = false;
    },
    openFile(url) {
      window.open(url);
    },
  },
};
</script>

<style scoped lang="scss">
::v-deep .el-form-item {
  margin-bottom: 0px;
}
img {
  width: 104px;
  height: 104px;
  background: #ffffff;
  border-radius: 2px;
  border: 1px solid rgba(0, 0, 0, 0.15);
}
.paperclip {
  cursor: pointer;
}
.paperclip:hover {
  color: #409eff;
}
</style>
