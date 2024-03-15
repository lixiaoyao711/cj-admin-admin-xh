<template>
  <div class="todo app-container">
    <header>
      <div class="todo-title">访客预约</div>
    </header>
    <div class="toolbar">
      <el-form :model="form" ref="form" :inline="true">
        <div class="left">
          <div v-if="mainTab === '1'">
            <el-form-item label="" prop="infoLevel">
              <el-input v-model="form.searchValue" placeholder="请输入接访人进行搜索">
                <i slot="prefix" class="el-input__icon el-icon-search"></i
              ></el-input>
            </el-form-item>
          </div>
          <div v-if="mainTab === '0'">
            <el-form-item label="预约类型:" prop="infoLevel">
              <el-select v-model="form.type">
                <el-option
                  v-for="dict in dict.type.sys_worship_yylx"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="" prop="searchValue">
              <el-input v-model="form.searchValue" placeholder="输入主题馆关键字进行搜索">
                <i slot="prefix" class="el-input__icon el-icon-search"></i
              ></el-input>
            </el-form-item>
          </div>
        </div>
        <div class="right">
          <el-button type="primary" @click="getList">查询</el-button>
          <el-button @click="reset">重置</el-button>
        </div>
      </el-form>
    </div>
    <div class="table" v-if="mainTab === '0'">
      <div class="subToolbar">
        <div class="sub">
          <div class="title">预约列表</div>
        </div>
        <div class="btn">
          <el-button :disabled="checkData.length === 0" @click="toExcelData">导 出</el-button>
        </div>
      </div>
      <el-table
        :data="tableData"
        border
        header-row-class-name="table-header"
        size="medium"
        style="width: 100%; height: 100%"
        height="calc(100% - 40px)"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column key="theme" prop="theme" label="到访主题"></el-table-column>
        <el-table-column key="place" prop="place" label="预约地点"></el-table-column>
        <el-table-column key="appointmentPerson" prop="appointmentPerson" label="预约人"></el-table-column>
        <el-table-column key="appointmentTime" prop="appointmentTime" label="预约时间"></el-table-column>
        <el-table-column key="receptionTime" prop="receptionTime" label="接访时间"></el-table-column>
        <el-table-column key="receptionAddress" prop="receptionAddress" label="接访地点"></el-table-column>
        <el-table-column key="receptionName" prop="receptionName" label="接待人"></el-table-column>
        <el-table-column key="appointmentType" prop="appointmentType" label="预约类型"></el-table-column>
        <el-table-column key="status" prop="status" label="状态">
          <template slot-scope="{ row }">
            <div>
              <el-popover trigger="click" popper-class="tri-popper" :value="row.showPop">
                <el-button
                  class="tri-popper-color"
                  :type="colorMarkMap[row.status] ? colorMarkMap[row.status].type : 'warning'"
                  plain
                  slot="reference"
                  >{{ colorMarkMap[row.status] ? colorMarkMap[row.status].text : '未核实' }}</el-button
                >
                <el-button @click="changePopperType(row, 0)" type="info" plain>未签到</el-button><br />
                <el-button @click="changePopperType(row, 1)" type="success" plain>已签到</el-button><br />
              </el-popover>
            </div>
          </template>
        </el-table-column>
        <el-table-column key="content1" prop="content" label="操作">
          <!-- <template slot-scope="{ row }">
            <el-button type="text" @click="openDetail(row)">详情</el-button>
            <el-button type="text" @click="openEdit(row)">编辑</el-button>
            <el-button type="text">
              <el-popconfirm title="确定删除吗？" @confirm="removeItem(row)">
                <span slot="reference">删除</span>
              </el-popconfirm>
            </el-button>
          </template> -->
        </el-table-column>
      </el-table>
    </div>

    <div class="pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="form.pageNum"
        :page-sizes="[10, 15, 30, 50, 100]"
        :page-size="form.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import AddLeader from './dialog/addLeader';
import AddVisitors from './dialog/addVisitors';
import { listVisitorsAppointment } from '@/api/worship/visitorsAppointment';
export default {
  props: {},
  dicts: ['sys_worship_yylx'],
  components: { AddLeader, AddVisitors },
  data() {
    return {
      tableData: [],
      checkData: [],
      titleName: '新增',
      statusMap: ['未签到', '已签到'],
      colorMarkMap: [
        // 0:未签到,1:已签到,2:待确认
        { type: 'info', text: '未签到' },
        { type: 'success', text: '已签到' },
      ],
      todoCount: 0,
      mainTab: '0',
      done: 0,
      form: {
        pageNum: 1,
        pageSize: 30,
        searchValue: null,
        appointmentType: '',
      },
      total: 0,
      //dialog drawer
      activeRow: {},
      addData: {},
      visitorsData: {},
      selectedPeople: {},
      addLeaderDialog: false,
      addVisitorsDialog: false,
    };
  },
  computed: {},
  watch: {},
  created() {
    this.getList();
  },
  methods: {
    async getList() {
      const res = await listVisitorsAppointment(this.form);
      if (res.code === 200) {
        this.tableData = res.rows;
        this.total = res.total;
      }
      //   let urlList = ['/visitorsAppointment/getPage', '/leadershipVisit/getPage'];
      //   axios({
      //     methods: 'get',
      //     url: urlList[this.mainTab],
      //     params: this.form,
      //   }).then((res) => {
      //     this.tableData = res.records;
      //     this.total = res.total;
      //   });
    },
    changePopperType(row, index) {
      row.status = index;
      axios({
        url: '/visitorsAppointment/update',
        method: 'post',
        data: row,
      }).then((res) => {
        this.getList();
      });
    },
    removeItem(row) {
      let urlList = ['/visitorsAppointment/delete', '/leadershipVisit/delete'];
      axios({
        url: urlList[this.mainTab],
        method: 'get',
        params: {
          id: row.id,
        },
      }).then((res) => {
        this.$message.success('删除成功');
        this.getList();
      });
    },
    openDetail(row) {
      this.addData = JSON.parse(JSON.stringify(row));
      this.titleName = '详情';
      this.mainTab === '1' ? (this.addLeaderDialog = true) : (this.addVisitorsDialog = true);
    },
    openEdit(row) {
      console.log(this.mainTab);
      this.addData = JSON.parse(JSON.stringify(row));
      this.titleName = '编辑';

      this.mainTab === '1' ? (this.addLeaderDialog = true) : (this.addVisitorsDialog = true);
    },
    openAdd() {
      this.titleName = '新建';
      this.addLeaderDialog = true;
    },
    leaderColose() {
      this.addLeaderDialog = false;
      this.addData = {};
      this.getList();
    },
    visitorsColose() {
      this.addVisitorsDialog = false;
      this.addData = {};
      this.getList();
    },
    handleCurrentChange(val) {
      this.form.pageNum = val;
      this.getList();
    },
    handleSizeChange(val) {
      this.form.pageSize = val;
      this.getList();
    },
    reset() {
      this.form = {
        pageNum: 1,
        pageSize: 30,
        name: null,
      };
      this.getList();
    },
    mainTabClick(tab) {
      this.mainTab = tab.name;
      this.$router.replace({
        query: {
          tab: tab.name,
          subTab: this.$route.query.subTab,
        },
      });
      this.getList();
    },
    handleSelectionChange(data) {
      this.checkData = data;
    },
    toExcelData() {
      let ids = this.checkData.map((e) => e.id).join(',');
      if (!ids) {
        this.$message.warning('请选择数据');
        return;
      }
      let urlList = ['/worship/visitorsAppointment/export', '/worship/leadershipVisit/export'];
      let name = ['预约列表', '接访列表'];
      fetch(`${urlList[this.mainTab]}?ids=${ids}`, {
        headers: {
          Authorization: sessionStorage.token,
        },
      }).then((res) => {
        res.blob().then((blob) => {
          var a = document.createElement('a');
          var url = window.URL.createObjectURL(blob);
          var filename = `${name[this.mainTab]}.xlsx`;
          a.href = url;
          a.download = filename;
          a.click();
          window.URL.revokeObjectURL(url);
        });
      });
    },
  },
};
</script>

<style scoped lang="scss">
.todo {
  height: 100%;
  position: relative;
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 40px;
    .todo-title {
      font-size: 20px;
      font-weight: bold;
    }
  }
  .sub {
    .num {
      background: rgba(140, 140, 140, 0.1);
      border-radius: 20px;
      padding: 0 5px;
      height: 20px;
      line-height: 20px;
      font-size: 12px;
      margin-left: 5px;
    }
    ::v-deep {
      .el-tabs__item {
        &.is-active {
          .num {
            color: #1890ff;
            background: #e6f7ff;
          }
        }
      }
    }
  }
  .table {
    height: 73vh;
    background: #fff;
    margin-top: 16px;
    padding: 6px 24px;
    ::v-deep {
      .process {
        &.process1 {
          color: #55c51e;
        }
        &.process2 {
          color: #1890ff;
        }
        &.process3 {
          color: #fc9a22;
        }
        &.process9 {
          color: #ff0909;
        }
      }
    }
    .red {
      color: #ff0909;
    }
    .table-header {
      height: calc(100% - 40px);
    }
    .subToolbar {
      height: 50px;
      overflow: hidden;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .sub {
      height: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .btn {
      .el-button {
        margin-right: 10px;
      }
    }
    .title {
      font-size: 16px;
      height: 34px;
      font-weight: bold;
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
.toolbar {
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
  }
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
