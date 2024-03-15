<template>
  <div>
    <el-dialog title="详情" :visible.sync="dialogVisible" width="700px" :before-close="handleClose">
      <el-form :model="formData" class="scroll-form" label-width="100px" label-position="left">
        <el-row>
          <el-col :span="12">
            <el-form-item label="接收部门：">
              <span>{{ formData.receiveForcesName }}</span>
            </el-form-item></el-col
          >
          <el-col :span="12">
            <el-form-item label="接收人：">
              <span>{{ formData.recipientName }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="创建人：">
              <span>{{ formData.reflectPersonnel }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="任务类型：">
              <span>{{ formData.taskTypeName }}</span>
            </el-form-item></el-col
          >
          <el-col :span="12">
            <el-form-item label="需求单位：">
              <span>{{ formData.reflectPersonnel }}</span>
            </el-form-item></el-col
          >

          <el-col :span="12">
            <el-form-item label="办结日期：">
              <span>{{ formData.transferredDate }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="重要程度：">
              <span>{{ formData.importanceName }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="内容：">
              <span>{{ formData.missionContent }}</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="附件内容：">
          <div
            @click="openFile(item)"
            class="paperclip"
            style="margin-right: 6px; color: #409eff"
            v-for="(item, index) in formData.filePath"
            :key="index"
          >
            {{ item.name }}
          </div>
        </el-form-item>
        <el-form-item label="处理记录"> </el-form-item>
        <el-form-item label="" label-width="10px">
          <el-timeline>
            <el-timeline-item
              v-for="(item, index) in formData.logs"
              :key="index"
              color="#1890FF"
              :timestamp="item.createdDate"
              placement="top"
            >
              <div>
                {{ item.actionContent }}
              </div>
              <div class="paperclip" v-for="(upload, indey) in item.filePath" :key="indey">
                <i class="el-icon-paperclip">
                  <a :href="upload.url" target="_blank" class="attach">{{ upload.name }}</a>
                </i>
              </div>
            </el-timeline-item>
          </el-timeline>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <div v-if="formData.status == 3">
          <el-button @click="saveItem" type="primary" size="small" class="del-button">确 定</el-button>
        </div>
        <div v-else>
          <div v-if="dad.userinfo.userId == formData.createdBy">
            <el-button @click="saveItem" type="primary" size="small" class="del-button">确 定</el-button>
          </div>
          <div v-else-if="formData.status == 1">
            <!-- <el-button @click="saveItem" type="primary" size="small" class="del-button">确 定</el-button> -->
            <el-button @click="feedbackItem">反 馈</el-button>
            <el-button type="text">
              <el-popconfirm title="确定办结吗？" @confirm="handleOver">
                <el-button type="primary" size="small" class="del-button" slot="reference">办 结</el-button>
              </el-popconfirm>
            </el-button>
          </div>
          <div v-else>
            <!-- 所有需求详情 -->
            <div v-if="dad.tableTab === '1' && formData.status != '2'">
              <el-button @click="handleReject">驳 回</el-button>
              <el-button @click="feedbackItem">反 馈</el-button>
              <!-- <el-button @click="handleHand">流 转</el-button> -->
              <!-- <el-button type="primary" @click="handleReceive">接 收</el-button> -->
              <!-- 创建人不是自己,并且为部门角色才能认领部门的需求 -->
              <el-button type="text" v-if="!dad.userinfo.isForces">
                <el-popconfirm title="确定认领吗？" @confirm="handleReceive">
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
          </div>
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
    <!-- 流转选人 -->
    <!-- <OftenPeopleDialog v-if="upDialog" @close="upClose" :type="'troops'" :isRadio="true" /> -->
  </div>
</template>

<script>
// 组件
import WorshipFeedback from './worshipFeedback';
// api
// import OftenPeopleDialog from '@/components/oftenPeopleDialog';
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
      upDialog: false,
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
      let id = '';
      // 我的已办传关联的双拥服务表id查询,其他情况传id
      if (this.dad.tableTab === '3') {
        id = this.propsData.supportsId;
      } else {
        id = this.propsData.id;
      }
      // supportsGetById(id).then((res) => {
      //   this.formData = res;
      // });
    },
    upClose(data) {
      if (data) {
        this.formData.recipientId = data.userId;
        this.formData.currentName = this.dad.userinfo.nickName;
        this.formData.recipientName = data.userName;
      }
      data &&
      // supportsHand(this.formData).then((res) => {
      //   this.$message.success('流转成功');
      //   this.upDialog = false;
      //   this.getDataByid();
      // });
      !data
        ? (this.upDialog = false)
        : '';
    },
    handleClose() {
      this.$emit('close');
    },
    saveItem() {
      this.$emit('close');
    },
    // 反馈
    feedbackItem() {
      this.formData.currentName = this.dad.userinfo.nickName;
      this.feedbackTitleName = '反馈';
      this.feedbackData = JSON.parse(JSON.stringify(this.formData));
      this.feedbackDialog = true;
    },
    // 驳回
    handleReject() {
      this.formData.currentName = this.dad.userinfo.nickName;
      this.feedbackTitleName = '驳回';
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
    handleReceive() {
      this.formData.recipientId = this.dad.userinfo.userId;
      this.formData.recipientName = this.dad.userinfo.nickName;
      this.formData.currentName = this.dad.userinfo.nickName;
      // supportsReceive(this.formData).then((res) => {
      //   this.$message.success('认领成功');
      //   this.$emit('close');
      // });
    },
    // 办结
    handleOver() {
      // supportsOver(this.formData).then((res) => {
      //   this.$message.success('办结成功');
      //   this.$emit('close');
      // });
    },
    feedbackClose() {
      this.getDataByid();
      this.feedbackData = {};
      this.feedbackDialog = false;
    },
    openFile(file) {
      window.open(file.url);
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
.paperclip {
  cursor: pointer;
}
.paperclip:hover {
  color: #409eff;
}
</style>
