<template>
  <div class="drawer app-container">
    <div class="back">
      <span @click="$router.go(-1)"><i class="el-icon-arrow-left"></i>返回</span>
    </div>
    <header>
      <div class="title">异动详情</div>
      <div class="btns">
        <el-button @click="handleEdit">编 辑</el-button>
        <el-button @click="handleDelete">删 除</el-button>
      </div>
    </header>
    <div class="desc">
      <section>
        <div class="label">异动详情</div>
        <ul class="detail">
          <li><span>预警人:</span> {{ petitionInfo.personNames }}</li>
          <li><span>预警人电话:</span> {{ petitionInfo.personPhones }}</li>

          <li>
            <span>诉求类别:</span>
            <dict-tag :options="dict.type.sys_worship_wczt" :value="petitionInfo.infoClassify" />
          </li>
          <li>
            <span>信息渠道:</span>
            <dict-tag :options="dict.type.sys_worship_xfdjqd" :value="petitionInfo.infoChannel" />
          </li>
          <li><span>登记人:</span> {{ petitionInfo.reportUser }}</li>
          <li><span>登记人电话:</span> {{ petitionInfo.reportPhone }}</li>
          <li><span>登记单位:</span> {{ petitionInfo.departName }}</li>
          <li>
            <span>登记级别:</span>
            <dict-tag :options="dict.type.sys_worship_djjb" :value="petitionInfo.infoSource" />
          </li>
          <li>
            <span>紧急程度:</span>
            <dict-tag :options="dict.type.sys_worship_jjcd" :value="petitionInfo.infoLevel" />
          </li>
          <li><span>登记日期:</span> {{ petitionInfo.petitionDate }}</li>
          <li><span>反馈期限:</span> {{ petitionInfo.deadline }}</li>

          <li class="line"><span>诉求内容:</span> {{ petitionInfo.content }}</li>

          <li class="line">
            <span>附件内容:</span>
            <fileUpload v-model="petitionInfo.fileUrl" isView></fileUpload>
          </li>
        </ul>
      </section>

      <section>
        <div class="label">处理动态</div>
        <div class="process">
          <div class="associates">
            <div v-if="dialogVisible">
              <el-dialog
                title="添加协作人"
                width="1000px"
                top="10vh"
                :visible.sync="dialogVisible"
                :close-on-click-modal="false"
              >
                <OftenPeople :isRadio="false" @checkClick="handleSelectionChange" />
                <div slot="footer" class="dialog-footer">
                  <el-button @click="dialogVisible = false">取 消</el-button>
                  <el-button type="primary" @click="addTags">添加协作人</el-button>
                </div>
              </el-dialog>
            </div>
          </div>
          <div class="item" v-for="item in petitionInfoLogList" :key="item.id">
            <div class="circle"></div>
            <div class="line"></div>
            <div class="content">
              <div class="time">{{ item.updateTime }}</div>
              <div class="info">
                <div class="flowContent">
                  {{ item.flowContent }}
                  <span @click="loadFile(item)" v-if="item.haveFile" class="down-load">下载流转单</span>
                </div>
                <div class="logContent">
                  {{ item.logContent }}
                  <span v-if="item.logType === '8'">{{ getScoreText(item.appraise | 0) }}</span>
                  <el-button v-if="item.logType === '8'" size="mini" @click="editEvaluation(item)">修改评价</el-button>
                </div>
                <div class="attach">
                  <fileUpload v-model="item.fileUrl" isView></fileUpload>

                  <!-- <a
                    :href="attach.url"
                    target="_blank"
                    class="attach"
                    v-for="attach in item.filePath"
                    :key="attach.id"
                    >{{ attach.name }}</a
                  > -->
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
    <footer>
      <el-button type="text">
        <el-button type="text" v-if="petitionInfo.state === 0">
          <el-button @click="backDialog = true" type="default">反 馈</el-button>

          <el-button type="text">
            <el-popconfirm title="确定要解除预警吗？" @confirm="changeRow">
              <el-button slot="reference" type="primary">解除预警</el-button>
            </el-popconfirm>
          </el-button>
        </el-button>
        <el-button type="text" v-if="petitionInfo.state === 1 && petitionInfo.trackState === 0">
          <el-button type="text">
            <el-popconfirm title="确定要开启预警吗？" @confirm="changeRow">
              <el-button slot="reference" type="primary">开启预警</el-button>
            </el-popconfirm>
          </el-button>
          <el-button type="text">
            <el-popconfirm title="确定要开启追踪吗？" @confirm="openRow">
              <el-button slot="reference" type="primary">开启追踪</el-button>
            </el-popconfirm>
          </el-button>
        </el-button>
        <el-button type="text" v-if="petitionInfo.trackState === 1">
          <el-button @click="backDialog = true" type="default">反 馈</el-button>
          <el-button type="text">
            <el-popconfirm title="确定要关闭追踪吗？" @confirm="openRow">
              <el-button slot="reference" type="primary">关闭追踪</el-button>
            </el-popconfirm>
          </el-button>
        </el-button>
      </el-button>
    </footer>

    <LetterContentForm
      v-if="showLetterContent"
      :info="activeRow"
      :people="selectedPeople"
      @close="showLetterContent = false"
      @success="addLetterSuccess"
    ></LetterContentForm>
    <backDialog :propsData="petitionInfo" v-if="backDialog" @close="backDialog = false" @save="backSuccess" />
  </div>
</template>

<script>
import LetterContentForm from '@/views/worship/petitionWarning/dialog/abnormalInfo/letterContentForm';

import backDialog from './backDialog.vue';
import { getPetitionWarning, deletePetitionWarning, openOrClose, trackOnOrOff } from '@/api/worship/petitionWarning';
export default {
  props: [],
  dicts: ['sys_worship_djjb', 'sys_worship_jjcd', 'sys_worship_xfdjqd', 'sys_worship_xfmd', 'sys_worship_wczt'],

  components: {
    LetterContentForm,
    backDialog,
  },
  data() {
    return {
      detailId: this.$route.params.id,
      showUp: false,
      step: 0,
      mainTab: '1',
      activeInfo: {},
      petitionInfo: {},
      petitionInfoRepeatList: [],
      petitionInfoLogList: [],
      petitionInfoFlow: [],
      // petitionInfoFileList: [],
      checkData: [],
      flowInfoData: {},
      dialogVisible: false,
      flowInfoDialog: false,
      backDialog: false,
      mainTabList: [
        '其他信息',
        '权益维护',
        '关爱帮扶',
        '走访慰问(10)',
        '办事记录(10)',
        '党员信息(999+)',
        '志愿信息(10)',
        '就业情况（失业）',
        '创业情况',
        '褒扬纪念(5)',
      ],
      tags: [],
      visible: false,
      visibleContent: '',
      //dialog drawer
      activeRow: {},
      selectedPeople: {},
      showLetterPeople: false,
      showLetterContent: false,
      showRepeatLetter: false,
      showFeedBack: false,
      showEvaluation: false,
    };
  },
  computed: {
    dictMap() {
      return this.$store.state.dictMap;
    },
    processState() {
      return Math.min(Number(this.petitionInfo.state) + 1, 4);
    },
    notFeedback() {
      return this.$route.query.feedback !== 1;
    }, // 如果是从待办进入，则无权操作
    userinfo() {
      return this.$store.state.userinfo;
    },
  },
  watch: {
    $route: {
      handler(val, oldVal) {
        // 大屏跳转
        this.detailId = this.$route.params.id || '';
        this.$route.params.id && this.getDetail();
      },
      immediate: true,
    },
  },
  created() {
    console.log(this.detailId, this.$route.query.feedback !== 1);
    this.getDetail();
  },
  mounted() {
    console.log(this.petitionInfo);
  },
  methods: {
    getDetail() {
      getPetitionWarning(this.$route.params.id).then((res) => {
        this.petitionInfoLogList = res.data.petitionWarningLogList;
        this.petitionInfo = res.data;
      });
      // axios({
      //   methods: 'get',
      //   url: '/petitionWarning/getById',
      //   params: { id: this.detailId },
      // }).then((res) => {
      //   this.petitionInfoLogList = res.petitionWarningLogList;
      //   this.petitionInfo = res;
      // });
    },
    getList() {
      axios({
        url: '/petitionInfo/getPetitionInfoListByRetireIdAndPersonType',
        method: 'get',
        params: {
          id: this.$route.params.id,
          personType: this.$route.query.tab != 2 ? 1 : 2,
        },
      }).then((res) => {});
    },
    editEvaluation(item) {
      this.activeInfo = item;
      this.showEvaluation = true;
    },
    getScoreText(appraise) {
      switch (appraise) {
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
    visibleClose() {
      this.visible = false;
      this.visibleContent = '';
    },
    backItem() {
      axios({
        url: '/petitionInfo/returnBack',
        method: 'get',
        params: {
          id: this.petitionInfo.id,
          content: this.visibleContent,
        },
      }).then((res) => {
        console.log(res);
        this.visible = false;
        this.visibleContent = '';
        this.getDetail();
      });
    },
    repeatEdit(repeatInfo) {
      this.showRepeatLetter = true;
      repeatInfo.name = this.petitionInfo.name;
      this.activeRow = repeatInfo;
    },
    handleRepeat() {
      this.showRepeatLetter = true;
      let { name, personId, id, serialNumber } = this.petitionInfo;
      this.activeRow = { name, personId, serialNumber, parentId: id };
    },
    handleEdit() {
      this.showLetterContent = true;
      this.activeRow = this.petitionInfo;
    },
    changeCase(val) {
      axios({
        url: '/petitionInfo/update',
        method: 'post',
        data: {
          id: this.petitionInfo.id,
          isAccumulation: val,
        },
      }).then((res) => {
        this.$message.success(`${val == '1' ? '转为积案' : '移出积案'}成功`);
        this.getDetail();
      });
    },
    handleDelete() {
      this.$confirm('确定删除该异动吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        deletePetitionWarning(this.$route.params.id).then((res) => {
          this.$message.success('删除成功');
          this.$router.go(-1);
        });
      });
    },

    sendSuccess() {
      this.showUp = false;
      this.getDetail();
    },
    evaluSuccess() {
      this.showEvaluation = false;
      this.getDetail();
    },
    FeedbackSuccess() {
      this.showFeedBack = false;
      this.getDetail();
    },
    over() {
      this.$confirm(`确定办结该信访吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        let formData = this.petitionInfo;
        formData.flowType = '4';
        formData.type = 1;
        axios.post(`/petitionInfo/update`, formData).then(() => {
          this.$message.success('操作成功');
          this.getDetail();
        });
      });
    },
    reject() {},
    addPeopleSuccess() {
      this.showLetterPeople = false;
      this.form.reportUser = people.name;
    },
    addLetterSuccess() {
      this.showLetterContent = false;
      this.getDetail();
    },
    addRpeatSuccess() {
      this.showRepeatLetter = false;
      this.getDetail();
    },
    addTags() {
      if (this.checkData.length < 1) {
        this.$message.error('请选择协同人');
        return;
      }
      let oriIds = this.petitionInfo.helpPersonId;
      let curIds = this.checkData.map((e) => e.userId).join(',');
      let oriNames = this.petitionInfo.helpPersonName;
      let curNames = this.checkData.map((e) => e.nickName).join(',');
      let ids = oriIds ? oriIds + ',' + curIds : curIds;
      let names = oriNames ? oriNames + ',' + curNames : curNames;
      axios({
        url: '/petitionInfo/update',
        method: 'post',
        data: {
          id: this.petitionInfo.id,
          helpPersonId: ids,
          helpPersonName: names,
          flowType: 0,
        },
      }).then((res) => {
        this.$message.success('操作成功');
        this.dialogVisible = false;
        this.getDetail();
      });
    },
    handleSelectionChange(data) {
      console.log(data);
      this.checkData = data;
    },

    loadFile(row) {
      fetch(`/worship/petitionFeedbackLog/exportWord?id=${row.id}`, {
        headers: {
          Authorization: sessionStorage.token,
        },
      }).then((res) => {
        res.blob().then((blob) => {
          var a = document.createElement('a');
          var url = window.URL.createObjectURL(blob);
          var filename = '流转审签单.docx';
          a.href = url;
          a.download = filename;
          a.click();
          window.URL.revokeObjectURL(url);
        });
      });
    },
    //开启or关闭预警
    changeRow() {
      openOrClose(this.$route.params.id).then((res) => {
        this.$message.success('操作成功');
        this.getDetail();
      });
    },
    //开启or关闭追踪
    openRow() {
      trackOnOrOff(this.$route.params.id).then((res) => {
        this.$message.success('操作成功');
        this.getDetail();
      });
    },
    backSuccess() {
      this.backDialog = false;
      this.getDetail();
    },
  },
};
</script>

<style scoped lang="scss">
.down-load {
  cursor: pointer;
  color: #1890ff !important;
}
.drawer {
  padding-bottom: 60px;
}
.back {
  span {
    cursor: pointer;
  }
}
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  line-height: 40px;
  height: 60px;
  .title {
    font-size: 20px;
    font-weight: bold;
  }
}
.desc {
  background: #fff;
  padding: 16px 24px;
  section {
    display: flex;
    margin-top: 24px;
    padding-bottom: 24px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
    &:first-child {
      margin-top: 0;
      .label {
        line-height: 40px;
      }
    }
    .label {
      font-size: 18px;
      font-weight: bold;
      width: 120px;
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
  .steps {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .tip {
      background: #ffdc7f;
      visibility: hidden;
      padding: 4px 10px;
      font-size: 12px;
    }
    .step {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      &:last-child {
        width: 30%;
        flex: none;
        justify-content: flex-start;
        &::after {
          display: none;
        }
      }
      &::after {
        content: '';
        display: block;
        width: 20px;
        flex: 1;
        border-top: 1px solid #ddd;
        margin-right: 16px;
      }
      .icon {
        width: 30px;
        height: 30px;
        line-height: 30px;
        border-radius: 50%;
        border: 1px solid #aaa;
        text-align: center;
        color: #999;
        font-size: 18px;
      }
      .text {
        font-size: 16px;
        margin: 0 10px;
      }
    }
  }
}
.process {
  .associates {
    margin-bottom: 18px;
    .tags {
      margin-right: 8px;
    }
  }
  .item {
    display: flex;
    position: relative;
    .circle {
      width: 11px;
      height: 11px;
      border: 2px solid #1890ff;
      background: #fff;
      border-radius: 50%;
      position: absolute;
      left: -6px;
      top: 0;
    }
    .line {
      border-left: 1px solid #ddd;
      margin-right: 24px;
    }
    .content {
      padding-bottom: 24px;
      line-height: 1;
      .time {
        color: rgba(0, 0, 0, 0.45);
      }
      .info {
        line-height: 1.5;
        padding-top: 5px;
        word-break: break-all;
        width: 50vw;
        span {
          color: #fc9a22;
          margin: 0 10px;
        }
      }
    }
    &:last-child {
      .line {
        visibility: hidden;
      }
    }
  }
}
.process .associates .button-new-tag .el-button--mini,
.process .associates .button-new-tag .el-button--mini.is-round {
  padding: 5.4px 15px;
}
footer {
  position: fixed;
  bottom: 0;
  right: 0;
  background: #fff;
  width: calc(100% - 200px);
  line-height: 50px;
  padding-right: 24px;
  box-sizing: border-box;
  text-align: right;
}
.attach {
  margin-right: 20px;
  white-space: nowrap;
}
.repeat {
  border-bottom: 1px solid #ddd;
}
::v-deep .el-step__icon {
  width: 8px;
  height: 8px;
}
</style>
