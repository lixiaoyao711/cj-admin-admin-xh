<template>
  <div class="app-container">
    <div class="back mb10" @click="back">
      <i class="el-icon-arrow-left"></i>
      返回
    </div>
    <div class="title">
      <div class="title-name">信访详情</div>
      <div class="btn-box">
        <el-button @click="handleDelete(petitionInfo)">删除</el-button>
        <el-button @click="handleRepeat" v-if="petitionInfo.state < 2">重复上访</el-button>
        <el-button v-if="petitionInfo.isAccumulation === '0'" @click="changeItem(petitionInfo, 1, '转为积案')"
          >转为积案</el-button
        >
        <el-button v-else @click="changeItem(petitionInfo, 0, '从积案移出')">从积案移出</el-button>
      </div>
    </div>
    <main>
      <div class="main-list">
        <div class="main-title">信访信息</div>
        <div class="main-content">
          <div class="main-item">
            信访编号:
            {{ petitionInfo.serialNumber }}
          </div>
          <div class="main-item">
            信访人:
            {{ petitionInfo.petitionPersonName }}
          </div>
          <div class="main-item">
            联系电话:
            {{ petitionInfo.petitionPersonPhone }}
          </div>
          <div class="main-item">
            信访目的:
            <dict-tag :options="dict.type.sys_worship_xfmd" :value="petitionInfo.infoObjective" />
          </div>
          <div class="main-item">
            目的类型:
            <dict-tag :options="dict.type.sys_worship_xfmdlx" :value="petitionInfo.infoObjectiveType" />
          </div>
          <div class="main-item">
            信访渠道:
            <dict-tag :options="dict.type.sys_worship_xfdjqd" :value="petitionInfo.infoChannel" />
          </div>
          <div class="main-item">
            紧急程度:
            <dict-tag :options="dict.type.sys_worship_jjcd" :value="petitionInfo.infoUrgencyLevel" />
          </div>
          <div class="main-item w100">
            诉求内容:
            {{ petitionInfo.petitionContent }}
          </div>
          <div class="main-item">
            登记日期:
            {{ petitionInfo.reportTime }}
          </div>
          <div class="main-item">
            截止日期:
            {{ petitionInfo.deadline }}
          </div>
          <div class="main-item">
            登记人:
            {{ petitionInfo.reportUser }}
          </div>
          <div class="main-item">
            登记级别:
            <dict-tag :options="dict.type.sys_worship_djjb" :value="petitionInfo.infoRegisterLevel" />
          </div>
          <div class="main-item w100">
            附件内容:
            <fileUpload v-model="petitionInfo.fileUrl" isView :fileSize="20"></fileUpload>
          </div>
        </div>
      </div>
      <li class="repeat line" v-for="(repeatInfo, index) in petitionInfoRepeatList" :key="repeatInfo.id">
        <header>
          <div class="label">第{{ index + 2 }}次信访</div>
          <!-- <el-button v-if="petitionInfo.state < 2" @click="repeatEdit(repeatInfo)">编 辑</el-button> -->
        </header>
        <ul class="detail">
          <li><span>登记人:</span> {{ repeatInfo.reportPerson }}</li>
          <li><span>联系电话:</span> {{ repeatInfo.reportPhone }}</li>
          <li><span>登记日期:</span> {{ repeatInfo.repartTime }}</li>
          <li>
            <span>登记级别:</span> <dict-tag :options="dict.type.sys_worship_djjb" :value="repeatInfo.reportLevel" />
          </li>
          <li class="line"><span>诉求内容:</span> {{ repeatInfo.content }}</li>
          <li class="line">
            <span>附件内容:</span>
            <fileUpload v-model="repeatInfo.fileUrl" isView :fileSize="20"></fileUpload>
          </li>
        </ul>
      </li>
      <div class="main-box">
        <div class="rank-title">处理进度</div>
        <div class="rank-content">
          <el-steps space="25%" :active="Number(petitionInfo.state) + 1" finish-status="finish" align-center>
            <el-step title="待处理"></el-step>
            <el-step title="受理中"></el-step>
            <el-step title="已结案"></el-step>
            <el-step title="已评价"></el-step>
          </el-steps>
        </div>
      </div>
      <div class="main-box">
        <div class="rank-title">处理动态</div>
        <div class="rank-content">
          <el-timeline>
            <el-timeline-item
              color="#1890ff"
              placement="top"
              v-for="(activity, index) in petitionInfo.flowList"
              :key="index"
              :timestamp="activity.updateTime"
            >
              <div>
                {{ activity.operLog }}
                <fileUpload v-if="activity.fileUrl" v-model="activity.fileUrl" isView :fileSize="20"></fileUpload>
                <span class="rank-text" v-if="activity.evaluate">{{ appraiseText(activity.evaluate | 0) }}</span>
              </div>
              <div>{{ activity.content }}</div>
              <el-button @click="exportItem(activity)" type="text" v-if="activity.isCirculationOrder === '1'"
                >导出流转单</el-button
              >
            </el-timeline-item>
          </el-timeline>
        </div>
      </div>
    </main>
    <div class="btn">
      <el-button v-if="petitionInfo.operPerm" type="text">
        <el-button type="text" v-if="petitionInfo.backPerm == 1">
          <el-popover placement="top" width="160" v-model="visible">
            <el-input v-model="petitionInfo.flowContent" placeholder="请输入内容"></el-input>
            <div style="text-align: right; margin: 16px 0 0 0">
              <el-button size="mini" type="text" @click="visibleClose">取消</el-button>
              <el-button type="primary" size="mini" @click="backItem">确定</el-button>
            </div>
            <el-button slot="reference" type="danger" plain>退 回</el-button>
          </el-popover>
        </el-button>
        <el-button v-if="petitionInfo.permissionStatus === '1' || petitionInfo.permissionStatus === '2'" type="text">
          <el-button @click="sendTo('4')">反 馈</el-button>
          <el-button @click="sendTo('11')" plain>流转详情</el-button>
        </el-button>
        <el-button v-else type="text">
          <el-button @click="sendTo('4')">反 馈</el-button>
          <el-button @click="sendTo('1')">上 报</el-button>
          <el-button @click="sendTo('2')">下 派</el-button>
          <el-button @click="sendTo('3')">转 交</el-button>
        </el-button>
      </el-button>
      <el-button type="text">
        <el-button
          v-if="!!petitionInfo.finishPerm && petitionInfo.state != 2 && petitionInfo.state != 3"
          @click="sendTo('7')"
          type="primary"
          >办 结</el-button
        >
        <el-button type="text" v-if="petitionInfo.state == '2' || petitionInfo.state == '3'">
          <template v-if="petitionInfo.trackingStatus == 0">
            <el-button @click="sendTo('9')" type="primary">开启追踪</el-button>
            <el-button @click="sendTo('8')" type="primary">评 价</el-button>
          </template>
          <template v-else>
            <el-button @click="sendTo('10')" type="primary">关闭追踪</el-button>
            <el-button @click="sendTo('4')">反 馈</el-button>
          </template>
        </el-button>
      </el-button>
    </div>
    <Feedback
      v-if="showFeedBack"
      :info="petitionInfo"
      @close="showFeedBack = false"
      @success="FeedbackSuccess"
    ></Feedback>
    <Up v-if="showUp" :info="petitionInfo" @close="showUp = false" @success="sendSuccess"></Up>
    <Evaluation
      v-if="showEvaluation"
      :info="petitionInfo"
      @close="showEvaluation = false"
      @success="evaluSuccess"
    ></Evaluation>
    <FlowInfo v-if="flowInfoDialog" @close="flowInfoDialog = false" :propsData="petitionInfo"></FlowInfo>
    <RepeatLetter
      v-if="showRepeatLetter"
      :info="petitionInfo"
      @close="showRepeatLetter = false"
      @success="addRpeatSuccess"
    ></RepeatLetter>
  </div>
</template>

<script>
import Feedback from './dialog/feedback.vue';
import Up from './dialog/up.vue';
import Evaluation from './dialog/evaluation.vue';
import FlowInfo from './dialog/flowInfo.vue';
import RepeatLetter from './dialog/repeatLetter.vue';

import { getPetitionInfo, petitionInfoPost, delPetitionInfo, updatePetitionInfo } from '@/api/worship/petitionInfo';

export default {
  props: {},
  components: { Feedback, Up, Evaluation, FlowInfo, RepeatLetter },
  dicts: [
    'sys_worship_xfzt',
    'sys_worship_xfmd',
    'sys_worship_djjb',
    'sys_worship_jjcd',
    'sys_worship_xfdjqd',
    'sys_worship_xfmdlx',
    'sys_worship_wczt',
  ],
  data() {
    return {
      activities: [],
      petitionInfoRepeatList: [],
      visibleContent: '',
      typeMap: {
        1: '上报',
        2: '下派',
        3: '转交',
        4: '反馈',
        7: '办结',
        9: '开启追踪',
        10: '关闭追踪',
      },
      showFeedBack: false,
      showEvaluation: false,
      flowInfoDialog: false,
      showRepeatLetter: false,
      petitionInfo: {},
      showUp: false,
      visible: false,
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.getData();
  },
  methods: {
    sendTo(flowType) {
      // this.activeInfo = Object.assign({}, this.petitionInfo);
      this.petitionInfo.flowType = flowType;
      switch (flowType) {
        case '1':
          this.showUp = true;
          break;
        case '2':
          this.showUp = true;
          break;
        case '3':
          this.showUp = true;
          break;
        case '4':
          this.showFeedBack = true;
          break;
        case '5':
          this.showUp = true;
          break;
        case '7':
          this.over();
          break;
        case '8':
          this.showEvaluation = true;
          break;
        case '9':
          this.over();
          break;
        case '10':
          this.over();
          break;
        case '11':
          this.flowInfoDialog = true;
          break;
      }
    },
    over() {
      this.$confirm(`确定${this.typeMap[this.petitionInfo.flowType]}该信访吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        let obj = {
          id: this.petitionInfo.id,
          petitionInfoFlowBo: {
            operType: this.petitionInfo.flowType,
          },
        };

        petitionInfoPost(obj).then(() => {
          this.$message.success('操作成功');
          this.getData();
        });
      });
    },
    back() {
      this.$router.go(-1);
    },
    getData() {
      getPetitionInfo(this.$route.params.id).then((res) => {
        if (res.code === 200) {
          this.petitionInfo = res.data;
          this.petitionInfoRepeatList = res.data.repeatList;
        }
      });
    },
    appraiseText(value) {
      switch (value) {
        case 1:
          return '很不满意';
        case 2:
          return '不满意';
        case 3:
          return '一般';
        case 4:
          return '满意';
        case 5:
          return '很满意';
        default:
          return '请评分';
      }
    },
    FeedbackSuccess() {
      this.showFeedBack = false;
      this.getData();
    },
    evaluSuccess() {
      this.showEvaluation = false;
      this.getData();
    },
    sendSuccess() {
      this.showUp = false;
      this.getData();
    },
    addRpeatSuccess() {
      this.showRepeatLetter = false;
      this.getData();
    },
    visibleClose() {
      this.visible = false;
      this.petitionInfo.flowContent = '';
    },
    handleRepeat() {
      this.showRepeatLetter = true;
      let { name, personId, id, serialNumber } = this.petitionInfo;
      this.activeRow = { name, personId, serialNumber, parentId: id };
    },
    backItem() {
      let obj = {
        id: this.petitionInfo.id,
        petitionInfoFlowBo: {
          operType: 5,
          flowContent: this.petitionInfo.flowContent,
        },
      };
      petitionInfoPost(obj).then(() => {
        this.$message.success('操作成功');
        this.visible = false;
        this.petitionInfo.flowContent = '';

        this.getData();
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$modal
        .confirm('是否确认删除信访编号为"' + row.serialNumber + '"的数据项？')
        .then(() => {
          this.loading = true;
          return delPetitionInfo(row.id);
        })
        .then(() => {
          this.loading = false;
          this.getData();
          this.$modal.msgSuccess('删除成功');
        })
        .catch(() => {})
        .finally(() => {
          this.loading = false;
        });
    },
    changeItem(row, type, title) {
      this.$modal
        .confirm(`是否确认将信访编号为${row.serialNumber}的数据${title}？`)
        .then(() => {
          row.isAccumulation = type;
          this.loading = true;
          return updatePetitionInfo(row);
        })
        .then(() => {
          this.loading = false;
          this.getData();
          this.$modal.msgSuccess('操作成功');
        })
        .catch(() => {})
        .finally(() => {
          this.loading = false;
        });
    },
    exportItem(row) {
      this.download(
        '/worship/petitionCirculationLog/exportWord',
        {
          flowId: row.id,
        },
        `流转单.docx`
      );
    },
  },
};
</script>

<style scoped lang="scss">
.w100 {
  width: 100% !important;
}
.back {
  cursor: pointer;
}
.title {
  display: flex;
  justify-content: space-between;
  // align-items: center;
  .title-name {
    font-size: 22px;
    font-weight: 600;
    color: #333333;
    margin-bottom: 20px;
  }
}
main {
  background: #fff;
  padding: 0 20px;
  height: 70vh;
  overflow: auto;
  box-sizing: border-box;
  .main-list {
    display: flex;
    border-bottom: 1px solid #eee;
    padding: 20px 0;
    box-sizing: border-box;
    .main-title {
      width: 10%;
      font-size: 22px;
      font-weight: 600;
      color: #333333;
      margin-bottom: 20px;
    }
    .main-content {
      flex: 1;
      display: flex;
      flex-wrap: wrap;
      .main-item {
        width: 30%;
        font-size: 16px;
        display: flex;
        align-items: center;
      }
      .main-item:nth-child(n + 4) {
        margin: 20px 0 0 0;
      }
    }
  }
  .main-box {
    display: flex;
    margin: 20px 0 0 0;
    flex-wrap: wrap;
    border-bottom: 1px solid #eee;
  }

  .rank-title {
    width: 10%;
    font-size: 22px;
    font-weight: 600;
    color: #333333;
  }
  .rank-content {
    flex: 1;
  }
}
.btn {
  padding: 10px;
  box-sizing: border-box;
  margin: 20px 0 0 0;
  background: #fff;
  display: flex;
  justify-content: flex-end;
}
.rank-text {
  color: #e6a23c;
}
.repeat {
  background: #f6f6f6;
  padding: 16px 24px;
  box-sizing: border-box;
  .label {
    font-weight: 600;
    font-size: 24px;
  }
  header {
    height: 40px;
    display: flex;
    align-items: center;
  }
}
li {
  list-style-type: none;
}
.detail {
  overflow: hidden;
  flex: 1;
  li {
    width: 33.3%;
    float: left;
    line-height: 3;
    display: flex;
    &.line {
      width: 100%;
      word-break: break-all;
      word-wrap: break-word;
    }
    span {
      margin-right: 10px;
    }
  }
  .repeat {
    background: #f6f6f6;
    padding: 16px 24px;
    box-sizing: border-box;
    header {
      height: 40px;
    }
  }
}
</style>
