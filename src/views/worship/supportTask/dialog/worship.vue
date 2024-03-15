<template>
  <div class="conscripts">
    <div class="serch">
      <el-form :inline="true" :model="query" class="demo-form-inline">
        <div class="left">
          <el-form-item label="状态：">
            <el-select v-model="query.state">
              <el-option
                v-for="dict in dict.type.sys_worship_rwzt"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="right">
          <el-form-item label="" prop="searchValue">
            <el-input placeholder="请输入搜索关键字" v-model="query.searchValue" class="input-with-select search">
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search">查 询</el-button>
            <el-button @click="onSubmit">重 置</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="table">
      <div class="table-title">
        <!-- <el-tabs v-model="tableTab" @tab-click="tableTabClick" class="main-tab">
          <el-tab-pane :label="`所有需求(${total})`" name="1"></el-tab-pane>
          部队角色才显示部队清单的我的待办我的已办
          <el-tab-pane :label="`我的待办(${pendingTotal})`" name="2"></el-tab-pane>
          <el-tab-pane :label="`我的已办(${forcesPendTotal})`" name="3"></el-tab-pane>
        </el-tabs> -->
        <!-- <div class="right" v-if="tableTab === '1'">
          <el-button type="primary" @click="addItem">新 建</el-button>
          <el-button type="text">
            <el-popconfirm title="确定批量删除吗？" @confirm="delItem">
              <el-button slot="reference" class="del-button" :disabled="checkData.length === 0">删 除</el-button>
            </el-popconfirm>
          </el-button>
        </div> -->
        我收到的
      </div>
      <el-table
        :data="tableData"
        border
        header-row-class-name="table-header"
        size="medium"
        style="width: 100%"
        height="calc(100% - 80px)"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column prop="taskContent" label="任务内容" />
        <el-table-column prop="demandDeptName" label="需求单位" />
        <el-table-column prop="receiveDeptName" label="接收部门/部队" />
        <el-table-column prop="taskContent" label="任务状态">
          <template slot-scope="{ row }">
            <dict-tag :options="dict.type.sys_worship_rwzt" :value="row.state" />
          </template>
        </el-table-column>
        <el-table-column prop="taskContent" label="紧急程度">
          <template slot-scope="{ row }">
            <dict-tag :options="dict.type.sys_worship_jjcd" :value="row.urgencyLevel" />
          </template>
        </el-table-column>
        <el-table-column prop="finishDate" label="办结期限" />
        <el-table-column label="操作" fixed="right">
          <template slot-scope="{ row }">
            <el-button @click="viewItem(row)" type="text">详情</el-button>
          </template>
          <!-- 接收部门为空的时候显示编辑删除 -->
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="query.pageNum"
        :page-sizes="[10, 15, 30, 50, 100]"
        :page-size="query.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>
    <!-- 新增编辑弹窗 -->
    <WorshipAddOrEdit
      v-if="addOrEditDialog"
      @close="addOrEditClose"
      :propsData="addOrEditData"
      :titleName="addOrEditTitleName"
    />
    <!-- 详情弹窗 -->
    <AirServiceInfoData v-if="infoDialog" @close="infoDataClose" :propsData="infoData" />
    <!-- 反馈弹窗 -->
    <WorshipFeedback
      v-if="feedbackDialog"
      :titleName="feedbackTitleName"
      @close="feedbackClose"
      :propsData="feedbackData"
    />
    <!-- <OftenOrgDialog v-if="oftenOrgDialog" @close="oftenOrgClose" @success="oftenOrgSuccess" /> -->
  </div>
</template>

<script>
// api

// 组件
import WorshipAddOrEdit from '../dialog/worshipAddOrEdit.vue';
import AirServiceInfoData from '../dialog/airServiceInfoData.vue';
import WorshipFeedback from '../dialog/worshipFeedback';
// 常用组织机构
// import OftenOrgDialog from '@/components/oftenOrgDialog';
import { listSupportTask } from '@/api/worship/supportTask';
export default {
  provide() {
    return {
      dad: this,
    };
  },
  dicts: ['sys_worship_jjcd', 'sys_worship_rwzt'],

  props: {},
  components: { WorshipAddOrEdit, AirServiceInfoData, WorshipFeedback },
  data() {
    return {
      query: {
        pageNum: 1,
        pageSize: 30,
        tabType: 0,
        // forces: null,
        state: '',
        searchValue: '',
      },
      departmentQuery: {
        type: '',
      },
      oftenOrgDialog: false,
      tableColumns: [
        {
          width: 500,
          label: '任务内容',
          prop: 'missionContent',
        },
        {
          width: 0,
          label: '需求单位',
          prop: 'reflectPersonnel',
        },
        {
          width: 0,
          label: '接收部门',
          prop: 'receiveForcesName',
        },
        {
          width: 0,
          label: '任务状态',
          prop: 'statusName',
        },
        {
          width: 0,
          label: '任务类型',
          prop: 'taskTypeName',
        },
        {
          width: 0,
          label: '办结日期',
          prop: 'transferredDate',
        },
      ],
      tableData: [],
      pendingTableData: [],
      forcesPendTableData: [],
      departmentData: [],
      feedbackData: [],
      checkData: [],
      total: 0,
      pendingTotal: 0,
      forcesPendTotal: 0,
      // -----------------tabs---------------------
      mainTab: '1',
      tableTab: '1',
      // -----------------dialog-------------------
      addOrEditDialog: false,
      infoDialog: false,
      feedbackDialog: false,
      addOrEditTitleName: '新建内容',
      feedbackTitleName: '反馈',
      addOrEditData: {},
      infoData: {},
      // userinfo: this.$store.state.userinfo,
      changeRow: {},
    };
  },
  computed: {
    dictMap() {
      return this.$store.state.dictMap;
    },
    userinfo() {
      return this.$store.state.userinfo;
    },
  },
  watch: {},
  created() {},
  mounted() {
    this.getAllData();
    this.getDepartmentList();
    console.log('userinfo', this.userinfo);
    // this.tableTab = this.$route.query.subTab || '1';
    this.tableTab = '1';
  },
  methods: {
    getAllData() {
      this.getList();
      this.getPendingList();
      this.getForcesPendList();
    },
    async getList() {
      // supportsAllRequirements(this.query).then((res) => {
      //   this.tableData = res.records.map((item) => {
      //     item.statusName = this.dictMap['supports_status'][Number(item.status)].dictLabel;
      //     return item;
      //   });
      //   console.log(this.tableData);
      //   // transferText(this.tableData);
      //   this.total = res.total;
      // });
      const data = await listSupportTask(this.query);
      console.log(data);
      if (data.code === 200) {
        this.tableData = data.rows;
        this.total = data.total;
      }
    },
    // 获取我的代办
    getPendingList() {
      // supportsPendingList(this.query).then((res) => {
      //   this.pendingTableData = res.records.map((item) => {
      //     item.statusName = this.dictMap['supports_status'][Number(item.status)].dictLabel;
      //     return item;
      //   });
      //   this.pendingTotal = res.total;
      // });
    },
    // 获取我的已办
    getForcesPendList() {
      // supportsForcesPendList(this.query).then((res) => {
      //   this.forcesPendTableData = res.records.map((item) => {
      //     item.statusName = this.dictMap['supports_status'][Number(item.status)].dictLabel;
      //     return item;
      //   });
      //   this.forcesPendTotal = res.total;
      // });
    },
    // 获取部门
    getDepartmentList() {
      this.departmentQuery.type = 1;
      // systemRoleSelectRolesByType(this.departmentQuery).then((res) => {
      //   this.departmentData = res;
      // });
    },
    mainTabClick(tab) {
      this.mainTab = tab.name;
      this.$router.replace({
        query: {
          tab: tab.name,
          subTab: this.$route.query.subTab,
        },
      });
      // this.getList()
    },
    tableTabClick(tab) {
      this.tableTab = tab.name;
      if (tab.name === '1') {
        this.getList();
      }
      if (tab.name === '2') {
        this.getPendingList();
        // this.total = this.pendingTotal;
      }
      if (tab.name === '3') {
        this.getForcesPendList();
        // this.total = this.forcesPendTotal;
      }
      this.$router.replace({
        query: {
          tab: this.$route.query.tab,
          subTab: tab.name,
        },
      });
    },
    onSubmit() {
      this.query = {
        pageNum: 1,
        pageSize: 30,
        tabType: 0,
        state: undefined,
        searchValue: '',
      };
      this.getList();
    },
    search() {
      this.query.page = 1;
      switch (this.tableTab) {
        case '1':
          this.getList();
          break;
        case '2':
          this.getPendingList();
          break;
        case '3':
          this.getForcesPendList();
          break;
        default:
          break;
      }
    },
    addItem() {
      this.addOrEditDialog = true;
      this.addOrEditTitleName = '新建内容';
    },
    editItem(row) {
      this.addOrEditDialog = true;
      this.addOrEditTitleName = '编辑内容';
      this.addOrEditData = JSON.parse(JSON.stringify(row));
    },
    delItem(row) {
      // 批量删除
      if (this.checkData.length) {
        let id = this.checkData.map((item) => item.id).join(',');
        // supportsDelete(id).then((res) => {
        //   this.$message.success('批量删除成功');
        //   this.getList();
        //   return;
        // });
      }
      // supportsDelete(row.id).then((res) => {
      //   this.$message.success('删除成功');
      //   this.getList();
      // });
    },
    viewItem(row) {
      this.infoData = JSON.parse(JSON.stringify(row));
      this.infoDialog = true;
    },
    handleSelectionChange(data) {
      this.checkData = data;
    },
    // 重新提交
    submitItem(row) {
      row.currentName = this.userinfo.nickName;
      // supportsReload(row).then((res) => {
      //   this.$message.success('重新提交成功');
      //   this.getList();
      // });
    },
    feedbackItem(row) {
      row.currentName = this.userinfo.nickName;
      this.feedbackData = JSON.parse(JSON.stringify(row));
      this.feedbackDialog = true;
    },
    // 接收
    handleReceive(row) {
      row.recipientName = this.userinfo.nickName;
      row.currentName = this.userinfo.nickName;
      // supportsReceive(row).then(async (res) => {
      //   this.$message.success('认领成功');
      //   await this.getAllData();
      // });
    },
    // 办结
    handleOver(row) {
      row.currentName = this.userinfo.nickName;
      // supportsOver(row).then(async (res) => {
      //   this.$message.success('办结成功');
      //   await this.getAllData();
      //   switch (this.tableTab) {
      //     case '2':
      //       this.getPendingList();
      //       break;
      //     case '3':
      //       this.getForcesPendList();
      //       break;
      //     default:
      //       break;
      //   }
      // });
    },
    addOrEditClose() {
      this.addOrEditDialog = false;
      this.addOrEditData = {};
      this.getList();
    },
    async infoDataClose() {
      this.infoDialog = false;
      // this.getList();
      await this.getAllData();
      switch (this.tableTab) {
        case 2:
          this.getPendingList();
          break;
        case 3:
          this.tableData = this.forcesPendTableData;
          break;
        default:
          break;
      }
      console.log(this.tableData);
    },
    async feedbackClose() {
      this.feedbackDialog = false;
      // this.getList();
      await this.getAllData();
      switch (this.tableTab) {
        case '2':
          this.getPendingList();
          break;
        case '3':
          this.tableData = this.forcesPendTableData;
          break;
        default:
          break;
      }
    },
    // 选择部门弹窗
    changeReceive(row) {
      this.changeRow = row;
      this.oftenOrgDialog = true;
    },
    oftenOrgClose() {
      this.oftenOrgDialog = false;
    },
    oftenOrgSuccess(deptId) {
      this.changeRow.receiveForces = deptId;
      // supportsHand(this.changeRow).then((res) => {
      //   this.$message.success('流转成功');
      //   this.getList();
      // });
    },
    handleCurrentChange(val) {
      this.query.page = val;
      this.getList();
    },
    handleSizeChange(val) {
      this.query.size = val;
      this.getList();
    },
  },
};
</script>

<style scoped lang="scss">
.conscripts {
  height: auto;
  .serch {
    // height: 60px;
    padding: 16px;
    background: #ffffff;
    border-radius: 2px;
    display: flex;
    align-items: center;
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
  .table {
    height: calc(100vh - 32vh);
    background-color: #fff;
    margin-top: 16px;
    padding: 6px 24px;
    .table-title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;
      font-size: 24px;
      font-weight: 600;
    }
  }
  .pagination {
    height: 40px;
    padding-top: 10px;
    background: #fff;
    text-align: right;
    padding-right: 24px;
  }
  .receive {
    cursor: pointer;
    color: #52a7ff;
  }
}
</style>
<style lang="scss">
.template-btn {
  display: flex;
  align-items: center;
  .el-button {
    margin-right: 8px;
  }
}
</style>
