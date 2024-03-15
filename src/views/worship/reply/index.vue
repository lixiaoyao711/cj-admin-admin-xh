<template>
  <div class="reply app-container">
    <header>
      <div class="reply-title">咨询回复</div>
    </header>
    <main>
      <div class="icon-box">
        <div @click="tabChange(index)" v-for="(item, index) in itemData" :key="index">
          <div v-if="item.show" class="item" :class="{ changeItem: currentIndex === index }">
            <img :src="item.img" alt="" />
            <div>{{ item.name }}</div>
          </div>
        </div>
      </div>
      <div class="info" v-if="currentIndex === 0">
        <div class="info-left">
          <el-input @input="search" v-model="query.searchValue" placeholder="输入姓名搜索" prefix-icon="el-icon-search">
          </el-input>
          <div class="msg-box">
            <div
              @click="msgClick(index, item)"
              class="item"
              :class="msgIndex === index ? 'changeItem' : ''"
              v-for="(item, index) in tableData"
              :key="index"
            >
              <div class="name">
                <span>{{ item.nickName }}</span>
                <el-tag v-if="item.status != null" size="mini" :type="statusMap[item.status].type">{{
                  statusMap[item.status].name
                }}</el-tag>
              </div>
              <div class="msg">{{ item.content }}</div>
            </div>
          </div>
        </div>
        <div class="info-right">
          <div class="right-title">
            {{ showRow.nickName }}
          </div>
          <div class="change-box">
            <div v-if="tableData.length">
              <span>信息传达给:</span>
              <el-tag @close="closeTag" v-if="deptName" type="info" :closable="userInfo.rankLevel === '区'">{{
                deptName
              }}</el-tag
              ><el-tag v-if="userInfo.rankLevel === '区'" @click="openDialog" type="info" effect="plain">
                {{ deptName ? '变更' : '+ 新增' }}</el-tag
              >
            </div>
          </div>
          <div class="msg-box">
            <div class="msg-list">
              <div
                v-for="(item, index) in msgRecordsData"
                :key="index"
                :class="item.type == 1 ? 'msgLeft' : 'msgRight'"
              >
                <div class="back">
                  <div class="time">{{ item.createdDateStr }}</div>
                  <div v-if="item.type === 2" class="name">{{ item.nickName }}</div>
                </div>
                <div class="text">
                  {{ item.content }}
                </div>
              </div>
            </div>
            <div class="back-msg">
              <el-input
                type="textarea"
                :autosize="{ minRows: 4 }"
                placeholder="请输入内容"
                v-model="msgContent"
                resize="none"
              >
              </el-input>
              <div class="btn">
                <el-button @click="sendWxMsg" type="primary">发送</el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="info1" v-if="currentIndex === 1">
        <div class="toolbar">
          <el-form :model="query" ref="form" :inline="true">
            <div class="left">
              <el-form-item>
                <el-input v-model="query.searchValue" placeholder="请输入咨询人搜索" prefix-icon="el-icon-search">
                </el-input>
              </el-form-item>
            </div>
            <div class="right">
              <el-button type="primary" @click="search">查询</el-button>
              <el-button @click="reset">重置</el-button>
            </div>
          </el-form>
        </div>
        <el-table :data="tableData" style="width: 100%">
          <el-table-column prop="content" label="最新消息" width="800">
            <template slot-scope="{ row }">
              <div>
                <img
                  @click="viewImg(row.content)"
                  class="content-img"
                  v-if="row.isFile && row.isFile !== '0'"
                  :src="row.content"
                  alt=""
                />
                <div v-else>
                  {{ row.content }}
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="咨询人"> </el-table-column>
          <el-table-column prop="createTime" label="最新咨询时间"> </el-table-column>
          <el-table-column prop="replyDate" label="回复时间"> </el-table-column>
          <el-table-column prop="address" label="操作" width="120" fixed="right">
            <template slot-scope="{ row }">
              <div>
                <el-button @click="getById(row, 1)" type="text">回复</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="query.pageNum"
            :page-sizes="[5, 15, 30, 50, 100]"
            :page-size="query.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          >
          </el-pagination>
        </div>
        <ConsultingServiceBack
          @close="directorClose"
          v-if="directorMailboxInfo"
          :url="'consulting'"
          :info="info"
          :consultingType="consultingType"
        />
      </div>
      <div class="info1" v-if="currentIndex === 2">
        <div class="toolbar">
          <el-form :model="query" ref="form" :inline="true">
            <div class="left">
              <el-form-item>
                <el-input v-model="query.searchValue" placeholder="请输入咨询人搜索" prefix-icon="el-icon-search">
                </el-input>
              </el-form-item>
            </div>
            <div class="right">
              <el-button type="primary" @click="search">查询</el-button>
              <el-button @click="reset">重置</el-button>
            </div>
          </el-form>
        </div>
        <el-table :data="tableData" style="width: 100%">
          <el-table-column prop="content" label="最新消息" width="800">
            <template slot-scope="{ row }">
              <div>
                <img
                  @click="viewImg(row.content)"
                  class="content-img"
                  v-if="row.isFile && row.isFile !== '0'"
                  :src="row.content"
                  alt=""
                />
                <div v-else>
                  {{ row.content }}
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="咨询人"> </el-table-column>
          <el-table-column prop="createTime" label="最新咨询时间"> </el-table-column>
          <el-table-column prop="replyDate" label="回复时间"> </el-table-column>
          <el-table-column prop="address" label="操作" width="120" fixed="right">
            <template slot-scope="{ row }">
              <div>
                <el-button @click="getById(row, 2)" type="text">回复</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="query.pageNum"
            :page-sizes="[5, 15, 30, 50, 100]"
            :page-size="query.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          >
          </el-pagination>
        </div>
        <ConsultingServiceBack
          @close="directorClose"
          v-if="directorMailboxInfo"
          :url="'consulting'"
          :info="info"
          :consultingType="consultingType"
        />
      </div>
      <div class="info1" v-if="currentIndex === 3">
        <div class="toolbar">
          <el-form :model="query" ref="form" :inline="true">
            <div class="left">
              <el-form-item>
                <el-input v-model="query.searchValue" placeholder="输入关键字搜索" prefix-icon="el-icon-search">
                </el-input>
              </el-form-item>
            </div>
            <div class="right">
              <el-button type="primary" @click="getList">查询</el-button>
              <el-button @click="reset">重置</el-button>
            </div>
          </el-form>
        </div>
        <el-table :data="tableData" style="width: 100%">
          <el-table-column prop="date" label="最新消息" width="800"> </el-table-column>
          <el-table-column prop="name" label="咨询人"> </el-table-column>
          <el-table-column prop="address" label="最新咨询时间"> </el-table-column>
          <el-table-column prop="address" label="回复时间"> </el-table-column>
          <el-table-column prop="address" label="操作" width="120" fixed="right"> </el-table-column>
        </el-table>
      </div>
    </main>
    <!-- <OftenOrgDialog v-if="oftenOrgDialog" @close="oftenOrgClose" @success="oftenOrgSuccess" /> -->

    <el-dialog class="img-dialog" append-to-body :visible.sync="imgDialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template>

<script>
// 常用组织机构
// import OftenOrgDialog from '@/components/oftenOrgDialog';
// 消息回复弹窗
import ConsultingServiceBack from './dialog/consultingServiceBack.vue';
import { checkPermFromRoles, listConsulting, listGetPageForLawyer } from '@/api/worship/reply';

export default {
  props: {},
  components: { ConsultingServiceBack },
  data() {
    return {
      query: {
        pageNum: 1,
        pageSize: 30,
        searchValue: '',
      },
      msgContent: '',
      consultingType: 0,
      oftenOrgDialog: false,
      itemData: [
        {
          img: 'img/wx.png',
          name: '微信咨询',
          show: false,
        },
        {
          img: 'img/zlb.png',
          name: '浙里办咨询',
          show: false,
        },
        {
          img: 'img/fl.png',
          name: '法律咨询',
          show: false,
        },
        // {
        //   img: 'img/ms.png',
        //   name: '码上咨询',
        //   show: false,
        // },
      ],
      tableData: [],
      msgRecordsData: [],
      deptName: '',
      showRow: {},
      statusMap: {
        1: {
          name: '已回复',
          type: 'success',
        },
        0: {
          name: '未回复',
          type: 'danger',
        },
      },
      currentIndex: 0,
      msgIndex: 0,
      imgDialogVisible: false,
      dialogImageUrl: '',
      info: '',
      directorMailboxInfo: false,
      total: 0,
    };
  },
  computed: {
    userInfo() {
      return this.$store.state.userinfo;
    },
  },
  watch: {},
  created() {},
  mounted() {
    this.currentIndex = Number(this.$route.query.tab) || 1;
    this.getList();
    this.getMenu();
  },
  methods: {
    // 获取列表
    getList(isGet = false) {
      // if (this.currentIndex === 0) {
      //   axios({
      //     url: '/wechatConsulting/getPage',
      //     method: 'get',
      //     params: {
      //       size: -1,
      //       searchValue: this.query.searchValue,
      //     },
      //   }).then((res) => {
      //     this.tableData = res.records;
      //     if (this.tableData.length) {
      //       if (isGet == false) {
      //         this.deptName = this.tableData[this.msgIndex].deptName;
      //         this.showRow = this.tableData[0];
      //         this.getMsgRecords(this.tableData[0].userId);
      //       }
      //     } else {
      //       this.deptName = '';
      //       this.showRow = {};
      //       this.msgRecordsData = [];
      //     }
      //   });
      // }
      if (this.currentIndex === 1) {
        listConsulting(this.query).then((res) => {
          this.tableData = res.rows;
          this.total = res.total;
        });
        // axios({
        //   url: '/consulting/getPage',
        //   method: 'get',
        //   params: this.query,
        // }).then((res) => {
        //   this.tableData = res.records;
        //   this.total = res.total;
        // });
      }
      if (this.currentIndex === 2) {
        listGetPageForLawyer(this.query).then((res) => {
          this.tableData = res.rows;
          this.total = res.total;
        });
        // axios({
        //   url: '/consulting/getPageForLawyer',
        //   method: 'get',
        //   params: this.query,
        // }).then((res) => {
        //   this.tableData = res.records;
        //   this.total = res.total;
        // });
      }
    },
    openDialog() {
      this.oftenOrgDialog = true;
    },
    oftenOrgClose() {
      this.oftenOrgDialog = false;
    },
    oftenOrgSuccess(deptId) {
      // axios({
      //   url: '/wechatConsulting/setDeptId',
      //   method: 'get',
      //   params: {
      //     deptId,
      //     userId: this.showRow.userId,
      //   },
      // }).then((res) => {
      //   this.getList();
      // });
    },
    handleCurrentChange(val) {
      this.query.pageNum = val;
      this.getList();
    },
    handleSizeChange(val) {
      this.query.pageSize = val;
      this.getList();
    },
    search() {
      this.getList();
    },
    async getMenu() {
      const { data } = await checkPermFromRoles();
      if (data['其他咨询']) {
        // this.itemData[0].show = true;
        this.itemData[1].show = true;
      }
      if (data['律师咨询']) {
        this.itemData[2].show = true;
      }
    },
    // 微信咨询-----------start
    tabChange(index) {
      this.currentIndex = index;
      this.reset();
      this.$router.replace({
        path: '',
        query: { tab: this.currentIndex },
      });
    },
    closeTag(row) {
      // axios({
      //   url: '/wechatConsulting/setDeptId',
      //   method: 'get',
      //   params: {
      //     deptId: '',
      //     userId: this.showRow.userId,
      //   },
      // }).then((res) => {
      //   this.getList();
      // });
    },
    msgClick(index, row) {
      this.showRow = row;
      this.msgIndex = index;
      this.deptName = row.deptName;
      this.getMsgRecords(row.userId);
    },

    // 获取聊天记录
    getMsgRecords(userId) {
      // axios({
      //   url: '/wechatConsulting/getListByUserId',
      //   method: 'get',
      //   params: {
      //     userId,
      //   },
      // }).then((res) => {
      //   this.msgRecordsData = res;
      // });
    },
    sendWxMsg() {
      // axios({
      //   url: '/wechatConsulting/reply',
      //   method: 'get',
      //   params: {
      //     content: this.msgContent,
      //     targetUserId: this.showRow.userId,
      //     type: 2,
      //   },
      // }).then((res) => {
      //   this.getList(true);
      //   this.getMsgRecords(this.showRow.userId);
      //   this.msgContent = '';
      // });
    },

    // 微信咨询-----------end
    // 浙里办咨询-----------start
    viewImg(url) {
      this.dialogImageUrl = url;
      this.imgDialogVisible = true;
    },
    getById(row, type = 0) {
      this.consultingType = type;
      console.log(this.consultingType);
      this.info = row;
      this.directorMailboxInfo = true;
    },
    directorClose() {
      this.directorMailboxInfo = false;
      this.getList();
    },
    reset() {
      this.query = {
        pageNum: 1,
        pageSize: 30,
        searchValue: '',
      };
      this.getList();
    },
  },
};
</script>

<style scoped lang="scss">
.reply {
  height: 100%;
  position: relative;
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 40px;
    .reply-title {
      font-size: 20px;
      font-weight: bold;
    }
  }
  main {
    height: calc(100% - 110px);
    display: flex;
    .icon-box {
      .item {
        cursor: pointer;
        text-align: center;
        width: 76px;
        min-height: 74px;
        padding: 10px 0 10px 0;
        // box-sizing: border-box;
        margin: 16px 0 0 0;
        background: #fff;
        border-radius: 6px;
        img {
          width: 48px;
          height: 48px;
        }
      }
      .changeItem {
        border: 1px solid #1692fe;
      }
      margin: 0 16px 0 0;
    }
    .info {
      width: 100%;
      display: flex;
      .info-left {
        width: 20%;
        background: #fff;
        margin: 0 20px 0 0;
        padding: 10px 16px 0 10px;
        box-sizing: border-box;
        overflow: scroll;
        .msg-box {
          .item {
            min-height: 68px;
            background: #f4f4f4;
            padding: 10px 6px 16px 16px;
            box-sizing: border-box;
            margin: 16px 0 0 0;
            cursor: pointer;
            .name {
              font-size: 16px;
              display: flex;
              justify-content: space-between;
            }
            .msg {
              margin: 6px 0 0 0;
            }
          }
          .changeItem {
            background: #8fc3ff;
          }
        }
      }
      .info-right {
        width: 80%;
        background: #fff;
        .right-title {
          height: 58px;
          width: 100%;
          background: fff;
          font-size: 24px;
          font-weight: 500;
          color: #000;
          display: flex;
          align-items: center;
          padding: 0 0 0 30px;
          box-sizing: border-box;
          border-bottom: 1px solid #eee;
        }
        .change-box {
          border-bottom: 1px solid #eee;
          padding: 16px 30px;
          box-sizing: border-box;
          .el-tag {
            margin-right: 10px;
          }
        }
        .msg-box {
          background: rgb(255, 255, 255);
          height: calc(100% - 114px);

          padding: 30px 20px;
          box-sizing: border-box;
          position: relative;
          .msg-list {
            display: flex;
            flex-direction: column;
            height: calc(100% - 100px);
            overflow: scroll;
            padding: 0 0 20px 0;
            box-sizing: border-box;
            .msgLeft {
              max-width: 50%;
              width: fit-content;
              .back {
                display: flex;
                justify-content: space-between;
                .time {
                  font-size: 12px;
                }
              }
              .text {
                background: #f2f2f2;
                padding: 10px 6px;
                box-sizing: border-box;
              }
            }
            .msgRight {
              align-self: end;
              max-width: 50%;
              width: fit-content;
              .back {
                display: flex;
                justify-content: space-between;
                .time {
                  font-size: 12px;
                }
              }
              .text {
                background: #f2f2f2;
                padding: 10px 6px;
                box-sizing: border-box;
              }
            }
          }
          .back-msg {
            display: flex;
            align-items: center;
            position: absolute;
            bottom: 30px;
            width: 100%;
            padding: 0 30px 0 0;
            box-sizing: border-box;
            .el-input {
              width: 70%;
            }
            .btn {
              margin: 0 0 0 30px;
            }
          }
        }
      }
    }
    .info1 {
      width: calc(100% - 100px);
      .toolbar {
        // width: 100%;
        display: flex;
        align-items: center;
        background: #fff;
        height: 60px;
        padding: 0 24px;
        .el-form {
          width: 100%;
          display: flex;
          justify-content: space-between;
          .el-form-item {
            margin-bottom: 0;
          }
          .el-input {
            width: 12vw;
          }
          .el-select .el-input {
            width: 8vw;
          }
        }
      }
      .el-table {
        margin: 20px 0 0 0;
        height: calc(100% - 50px);
      }
      .content-img {
        width: 100px;
        height: 100px;
        cursor: pointer;
      }
    }

    .info2 {
      width: 100%;
      display: flex;
      .info-left {
        width: 20%;
        background: #fff;
        margin: 0 20px 0 0;
        padding: 10px 16px 0 10px;
        box-sizing: border-box;
        .msg-box {
          .item {
            height: 68px;
            background: #f4f4f4;
            padding: 10px 6px 16px 16px;
            box-sizing: border-box;
            margin: 16px 0 0 0;
            .name {
              font-size: 16px;
              display: flex;
              justify-content: space-between;
            }
            .msg {
              margin: 6px 0 0 0;
            }
          }
        }
      }
      .info-right {
        width: 80%;
        background: yellow;
        .right-title {
          height: 58px;
          width: 100%;
          background: #ffffff;
          font-size: 24px;
          font-weight: 500;
          color: #000;
          display: flex;
          align-items: center;
          padding: 0 0 0 30px;
          box-sizing: border-box;
          border-bottom: 1px solid #eee;
        }
        .change-box {
          border-bottom: 1px solid #eee;
          padding: 16px 30px;
          box-sizing: border-box;
          .el-tag {
            margin-right: 10px;
          }
        }
        .msg-box {
          background: rgb(255, 255, 255);
          height: calc(100% - 57px);

          padding: 30px 20px;
          box-sizing: border-box;
          position: relative;
          .msg-list {
            display: flex;
            flex-direction: column;
            height: calc(100% - 80px);
            overflow: scroll;
            padding: 0 0 20px 0;
            box-sizing: border-box;
            .msgLeft {
              max-width: 50%;
              width: fit-content;
              .time {
                font-size: 12px;
              }
              .text {
                background: #f2f2f2;
                padding: 10px 6px;
                box-sizing: border-box;
              }
            }
            .msgRight {
              align-self: end;
              max-width: 50%;
              width: fit-content;
              .back {
                display: flex;
                justify-content: space-between;
                .time {
                  font-size: 12px;
                }
              }
              .text {
                background: #f2f2f2;
                padding: 10px 6px;
                box-sizing: border-box;
              }
            }
          }
          .back-msg {
            display: flex;
            align-items: center;
            position: absolute;
            bottom: 30px;
            width: 100%;
            padding: 0 30px 0 0;
            box-sizing: border-box;
            .el-input {
              width: 70%;
            }
            .btn {
              margin: 0 0 0 30px;
            }
          }
        }
      }
    }
  }
  .pagination {
    height: 40px;
    padding-top: 10px;
    background: #fff;
    text-align: right;
    padding-right: 24px;
  }
}
::v-deep .el-dialog__header {
  border-bottom: none;
}
</style>
