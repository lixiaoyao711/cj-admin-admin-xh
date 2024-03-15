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
        <div></div>
        <div class="right">
          <el-button type="primary" @click="addItem">新 建</el-button>

          <el-button @click="delItem" :disabled="checkData.length === 0">删 除</el-button>
        </div>
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
            <template v-if="!row.receiveDeptId">
              <el-button @click="editItem(row)" type="text">编辑</el-button>
              <el-button @click="delItem(row)" type="text" size="small">删除</el-button>
            </template>
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
    <AirServiceAddOrEdit
      v-if="addOrEditDialog"
      @close="addOrEditClose"
      :propsData="addOrEditData"
      :titleName="addOrEditTitleName"
    />
    <!-- 详情弹窗 -->
    <AirServiceInfoData v-if="infoDialog" @close="infoDataClose" :propsData="infoData" />
    <!-- 反馈弹窗 -->
    <AirServiceFeedback
      v-if="feedbackDialog"
      :titleName="feedbackTitleName"
      @close="feedbackClose"
      :propsData="feedbackData"
    />
  </div>
</template>

<script>
// api
import { listSupportTask, deleteSupportTask } from '@/api/worship/supportTask';

// 组件

import AirServiceAddOrEdit from '../dialog/airServiceAddOrEdit.vue';
import AirServiceInfoData from '../dialog/airServiceInfoData.vue';
import AirServiceFeedback from '../dialog/airServiceFeedback';

export default {
  provide() {
    return {
      dad: this,
    };
  },
  dicts: ['sys_worship_jjcd', 'sys_worship_rwzt'],

  props: {},
  components: { AirServiceAddOrEdit, AirServiceInfoData, AirServiceFeedback },
  data() {
    return {
      query: {
        pageNum: 1,
        pageSize: 30,
        tabType: 1,
        state: undefined,
        searchValue: '',
      },
      departmentQuery: {
        type: '1',
      },
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
          label: '接收部门/部队',
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
          label: '紧急程度',
          prop: 'taskTypeName',
        },
        {
          width: 0,
          label: '办结期限',
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
      ids: [],
    };
  },
  computed: {
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
      console.log(123);
    },

    getList() {
      listSupportTask(this.query).then((res) => {
        this.tableData = res.rows;
        console.log(this.tableData);

        this.total = res.total;
      });
    },
    // 获取我的代办
    getPendingList() {},
    // 获取我的已办
    getForcesPendList() {},
    // 获取部门
    getDepartmentList() {
      this.departmentQuery.type = 1;
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
      }
      if (tab.name === '3') {
        this.getForcesPendList();
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
        tabType: 1,
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
      const ids = row.id || this.ids;
      const name = row.demandDeptName ?? this.filterDelData(this.ids, this.tableData, 'demandDeptName');
      this.$modal
        .confirm('是否确认删除需求单位为"' + name + '"的数据项？')
        .then(() => {
          // this.loading = true;
          return deleteSupportTask(ids);
        })
        .then(() => {
          // this.loading = false;
          this.getList();
          this.$modal.msgSuccess('删除成功');
        })
        .catch(() => {})
        .finally(() => {
          this.loading = false;
        });
    },
    viewItem(row) {
      this.infoData = JSON.parse(JSON.stringify(row));
      this.infoDialog = true;
    },
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.checkData = selection;
    },
    // 重新提交
    submitItem(row) {
      row.currentName = this.userinfo.nickName;
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
    },
    // 办结
    handleOver(row) {
      row.currentName = this.userinfo.nickName;
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
    height: 60px;
    padding: 0 24px;
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
</style>
