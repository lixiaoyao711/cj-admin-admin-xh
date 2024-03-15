<template>
  <div class="allPeople">
    <div class="table">
      <div class="subToolbar">
        <div class="sub">
          <div class="msg-title">短信发送历史</div>
          <div class="btns">
            <el-button type="primary" @click="sendMsgDialog = true"> 群发短信 </el-button>
            <!-- <el-button type="text">
              <el-popconfirm title="确定批量删除吗？" @confirm="deleteRow">
                <el-button slot="reference" :disabled="selection.length === 0">删 除</el-button>
              </el-popconfirm>
            </el-button> -->
          </div>
        </div>
      </div>
      <el-table :data="tableData" height="74.5vh" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="45"> </el-table-column>

        <el-table-column label="内容" prop="content"> </el-table-column>
        <el-table-column label="发送人" prop="sendName"> </el-table-column>
        <el-table-column label="接收人" prop="receiveName"> </el-table-column>
        <el-table-column label="操作" width="60" fixed="right">
          <template slot-scope="scope">
            <el-button type="text">
              <el-popconfirm title="确定删除该信息吗？" @confirm="deleteRow(scope.row)">
                <span slot="reference">删除</span>
              </el-popconfirm>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="form.page"
        :page-sizes="[10, 15, 30, 50, 100]"
        :page-size="form.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>
    <!-- 群发短信弹窗 -->
    <SendMsgDialog v-if="sendMsgDialog" @close="sendMsgClose" :propsData="sendMsgData" />
  </div>
</template>

<script>
import SendMsgDialog from './dialog/sendMsgDialog';
import { listSendSmsLog } from '@/api/worship/messagePlatform';
import { deleteSendSmsLog } from '@/api/worship/messagePlatform';
export default {
  props: {},
  components: {
    SendMsgDialog,
  },
  data() {
    return {
      mainTab: '0',
      mainTabList: ['短信发送历史'],
      colorMarkMap: [
        // 0:未确认,1:已确认,2:待确认
        { type: 'info', text: '未确认' },
        { type: 'success', text: '已确认' },
        { type: 'warning', text: '待确认' },
      ],
      subTab: '',
      tableData: [],
      form: {
        pageNum: 1,
        pageSize: 30,
        sendType: 2,
      },
      peopleCategoryList: [],
      total: 0,
      selection: [],
      headers: {
        Authorization: sessionStorage.token,
      },
      activeRow: {},
      confirmedData: {},
      sendMsgData: {},
      showAddChildren: false,
      sendMsgDialog: false,
      showAddPeople: false,
      showAddOut: false,
      showUserDetail: false,
      showTransferDifficult: false,
      showTransferReview: false,
      confirmedDialog: false,
      transferTitle: '',
    };
  },
  computed: {},
  watch: {},
  created() {
    this.getList();
  },
  methods: {
    async getList(type) {
      //   搜索的时候page置为1
      type ? (this.form.page = 1) : '';
      const { data } = await listSendSmsLog(this.form);
      console.log(data);
      this.tableData = data.records;
      this.total = data.total;
    },
    sendMsgClose() {
      this.sendMsgDialog = false;
      this.getList();
    },
    uploadSuccess() {
      this.$message.success('导入成功');
      this.form.page = 1;
      this.getList();
    },
    deleteAll() {
      //   let ids = this.selection.map((e) => e.id).join(',');
      //   if (!ids) {
      //     this.$message.warning('请选择数据');
      //     return;
      //   }
      //   this.$confirm('确定删除这些数据吗?', '提示', {
      //     confirmButtonText: '确定',
      //     cancelButtonText: '取消',
      //     type: 'warning',
      //   }).then(() => {
      //     let module = this.subTab === 'children' ? 'activeInfoChildren' : 'retireInfo';
      //     axios.get(`/${module}/delete?id=` + ids).then((res) => {
      //       this.$message.success('删除成功');
      //       this.getList();
      //     });
      //   });
    },
    deleteRow(row) {
      // if (this.selection.length !== 0) {
      //   let id = this.selection.map((item) => item.id).join(',');
      //   axios({
      //     url: '/sendSmsLog/delete',
      //     method: 'get',
      //     params: {
      //       id,
      //     },
      //   }).then((res) => {
      //     this.$message.success('批量删除成功');
      //     this.getList();
      //   });
      //   return;
      // }
      deleteSendSmsLog(row.id).then((res) => {
        this.$message.success('删除成功');
        this.getList();
      });
    },
    handleExport() {
      let ids = this.selection.map((e) => e.id).join(',');
      if (!ids) {
        this.$message.warning('请选择数据');
        return;
      }
      fetch(`/worship/retireInfo/export?ids=${ids}`, {
        headers: {
          Authorization: sessionStorage.token,
        },
      }).then((res) => {
        res.blob().then((blob) => {
          var a = document.createElement('a');
          var url = window.URL.createObjectURL(blob);
          var filename = '退役军人.xlsx';
          a.href = url;
          a.download = filename;
          a.click();
          window.URL.revokeObjectURL(url);
        });
      });
    },
    openUserDetail(row) {
      console.log(row, this.mainTab - 1);
      this.activeRow = Object.assign({}, row, {
        formModel: '查看',
      });
      if (this.subTab === 'out') {
        this.showAddOut = true;
      } else {
        this.$router.push({
          name: 'detail',
          query: {
            id: row.id,
          },
        });
      }
    },
    tansferReview(row) {
      this.activeRow = row;
      this.showTransferReview = true;
    },
    handleAddPeople() {
      this.showAddPeople = true;
      this.activeRow = {};
    },
    editRow(row) {
      console.log(row);
      this.activeRow = Object.assign({}, row, {
        formModel: '编辑',
      });
      if (this.subTab === 'out') {
        this.showAddOut = true;
      } else {
        this.showAddPeople = true;
      }
    },
    handleAddOut() {
      this.activeRow = {};
      this.showAddOut = true;
    },
    addMember() {
      this.activeRow = {};
      if (this.subTab === 'children') {
        this.showAddChildren = true;
      } else {
        this.showAddFamily = true;
      }
    },
    addSuccess() {
      this.showAddPeople = false;
      this.getList();
    },
    handleSelectionChange(val) {
      this.selection = val;
    },
    handleCurrentChange(val) {
      this.form.page = val;
      this.getList();
    },
    handleSizeChange(val) {
      this.form.size = val;
      this.getList();
    },
    mainTabClick(vm) {
      console.log('tab', vm.name);
      this.$router.replace({
        query: {
          tab: vm.name,
        },
      });
      switch (vm.name) {
        case '3':
          this.subTab = 'family';
          break;
        default:
          this.subTab = '';
      }
      this.resetForm();
    },
    subTabClick(vm) {
      this.$router.replace({
        query: {
          tab: this.$route.query.tab,
          subTab: vm.name,
        },
      });
      this.subTab = vm.name;
      this.resetForm();
    },
    resetForm() {
      // this.$refs['form'].resetFields();
      this.form = {
        departCode: [],
        peopleCategory: '',
        keyType: '',
        keyWord: '',
        verifyStatus: '',
        page: 1,
        size: 30,
      };
      this.peopleCategoryList = [];
      this.getList();
    },
    changePopperType(row, index) {
      //   if (index == '2') {
      //     this.confirmedData = JSON.parse(JSON.stringify(row));
      //     this.confirmedDialog = true;
      //     return;
      //   }
      //   row.verifyStatus = index;
      //   let obj = [row];
      //   axios({
      //     url: '/retireInfo/update',
      //     method: 'post',
      //     data: obj,
      //   }).then((res) => {
      //     this.getList();
      //   });
    },
    toPath() {
      this.$router.push('/pendingPeople');
    },
    confirmedClose() {
      this.confirmedDialog = false;
      this.getList();
    },
  },
};
</script>

<style scoped lang="scss">
.allPeople {
  height: 100%;
  position: relative;
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 40px;
    .msg-title {
      font-size: 20px;
      font-weight: bold;
    }
  }
  .main-tab {
    height: 60px;
  }
  .sub {
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .num {
      background: rgba(140, 140, 140, 0.1);
      border-radius: 20px;
      padding: 0 5px;
      height: 20px;
      line-height: 20px;
      font-size: 12px;
      margin-left: 5px;
    }

    .el-tabs__item {
      &.is-active {
        .num {
          color: #1890ff;
          background: #e6f7ff;
        }
      }
    }
  }
  .table {
    height: calc(100% - 170px);
    background: #fff;
    margin-top: 16px;
    padding: 6px 24px;
    .subToolbar {
      height: 50px;
      overflow: hidden;
    }

    .msg-title {
      font-size: 16px;
      height: 34px;
      font-weight: bold;
    }
  }
  .pagination {
    height: 40px;
    background: #fff;
    text-align: right;
    padding-right: 24px;
  }
}
.toolbar {
  display: flex;
  align-items: center;
  background: #fff;
  height: 60px;
  padding: 0 24px;
  ::v-deep {
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
      .el-select {
        .el-input {
          width: 8vw;
        }
      }
      .peopleCategory {
        .el-select {
          .el-input {
            width: 12vw;
          }
        }
      }
    }
  }
}
.upload {
  display: inline-block;
  margin: 0 10px;
}
</style>
<style lang="scss">
.tri-popper-color {
  width: 80px;
}
.tri-popper {
  min-width: 0;
  width: 80px;
  .el-button {
    margin-bottom: 10px;
    width: 100%;
  }
}
</style>
