<template>
  <div class="interview app-container">
    <header>
      <div class="h-title">风险排查表</div>
    </header>
    <el-tabs v-model="mainTab" class="main-tab" @tab-click="mainTabClick">
      <el-tab-pane v-for="(item, index) in stateMap" :key="index" :name="index">
        <span slot="label">{{ item.label }}</span>
      </el-tab-pane>
    </el-tabs>
    <div v-if="mainTab === '1'" class="table-box">
      <div class="toolbar">
        <el-form :model="form" ref="form" :inline="true">
          <div class="left">
            <el-form-item label="行政区划:" prop="departCode">
              <!-- length>1是社区权限角色,直接禁用,不能筛选 -->
              <TreeSelectDivision
                v-model="form.departCode"
                @treeselectChange="(e) => treeselectChange(e, queryParams, 'departCode')"
              ></TreeSelectDivision>
            </el-form-item>
            <el-form-item label="选择月份:" prop="departCode">
              <el-date-picker
                v-model="form.statMonth"
                type="month"
                placeholder="选择月"
                value-format="yyyy-MM-dd HH:mm:ss"
                :default-time="['00:00:00', '23:59:59']"
              >
              </el-date-picker>
            </el-form-item>
          </div>
          <div class="right">
            <el-button @click="handleExport('/worship/riskScreen/exportTemplate', '导入模板')">导入模板下载</el-button>

            <el-button @click="handleExport('/worship/riskScreenStat/export', '每月不稳定风险排查表')">导出</el-button>
            <el-button type="primary" @click="search">查询</el-button>
            <el-button @click="reset">重置</el-button>
          </div>
        </el-form>
      </div>
      <div class="table">
        <el-tabs v-model="subTab" @tab-click="subTabClick">
          <el-tab-pane label="镇街列表" name="2"></el-tab-pane>
          <el-tab-pane label="综合查看" name="1"></el-tab-pane>
        </el-tabs>
        <div class="postData">
          {{ motn }}月已提交：{{ submitValue }}个镇街 {{ motn }}月未提交：{{ uncommittValue }}个镇街
        </div>
        <MonthView ref="monthView" :propsQuery="form" v-if="subTab === '1'" />
        <el-table
          v-if="subTab === '2'"
          :data="tableData"
          border
          header-row-class-name="table-header"
          size="medium"
          style="width: 100%; height: 100%"
          height="calc(100% - 40px)"
        >
          <el-table-column prop="departName" label="镇街"></el-table-column>
          <el-table-column v-if="mainTab == 1" prop="sexText" label="本月已提交" width="300">
            <template slot-scope="{ row }">
              {{ row.whetherCommit == 1 ? '是' : '否' }}
            </template>
          </el-table-column>
          <el-table-column v-else prop="sexText" label="本日已提交" width="300">
            <template slot-scope="{ row }">
              {{ row.whetherCommit == 1 ? '是' : '否' }}
            </template>
          </el-table-column>

          <el-table-column label="操作" width="100" fixed="right">
            <template slot-scope="{ row }">
              <div>
                <el-button type="text" size="small" @click="openDetail(row)">查看</el-button>
                <el-button v-if="row.whetherCommit == 1" type="text" size="small" @click="handleExport(row.id)"
                  >导出</el-button
                >
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pagination"></div>
    </div>
    <div v-if="mainTab === '2'" class="table-box">
      <div class="toolbar">
        <el-form :model="form" ref="form" :inline="true">
          <div class="left">
            <el-form-item label="行政区划:" prop="departCode">
              <!-- length>1是社区权限角色,直接禁用,不能筛选 -->

              <TreeSelectDivision
                v-model="form.departCode"
                @treeselectChange="(e) => treeselectChange(e, queryParams, 'departCode')"
              ></TreeSelectDivision>
            </el-form-item>
            <el-form-item label="选择日期:" prop="departCode">
              <el-date-picker
                :picker-options="PickerOptions"
                v-model="form.statMonth"
                type="date"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期"
              >
              </el-date-picker>
            </el-form-item>
          </div>
          <div class="right">
            <el-button @click="handleExport('/worship/riskZero/exportTemplate', '导入模板')">导入模板下载</el-button>

            <el-button @click="handleExport('/worship/riskZero/export', '风险零报详情列表')">导出</el-button>
            <el-button type="primary" @click="search">查询</el-button>
            <el-button @click="reset">重置</el-button>
          </div>
        </el-form>
      </div>
      <div class="table">
        <el-tabs v-model="subTab" @tab-click="subTabClick">
          <el-tab-pane label="镇街列表" name="2"></el-tab-pane>
          <el-tab-pane label="综合查看" name="1"></el-tab-pane>
        </el-tabs>
        <div class="postData">
          <div>{{ day }}已提交：{{ submitValue }}个镇街 {{ day }}未提交：{{ uncommittValue }}个镇街</div>
        </div>
        <DayView ref="dayView" v-if="subTab === '1'" :propsQuery="form" />
        <el-table
          v-if="subTab === '2'"
          :data="tableData"
          border
          header-row-class-name="table-header"
          size="medium"
          style="width: 100%; height: 100%"
          height="calc(100% - 40px)"
        >
          <el-table-column prop="departName" label="镇街"></el-table-column>
          <el-table-column v-if="mainTab == 1" prop="sexText" label="本月已提交" width="300">
            <template slot-scope="{ row }">
              {{ row.whetherCommit == 1 ? '是' : '否' }}
            </template>
          </el-table-column>
          <el-table-column v-else prop="sexText" label="本日已提交" width="300">
            <template slot-scope="{ row }">
              {{ row.whetherCommit == 1 ? '是' : '否' }}
            </template>
          </el-table-column>

          <el-table-column label="操作" width="100" fixed="right">
            <template slot-scope="{ row }">
              <div>
                <el-button type="text" size="small" @click="openDetail(row)">查看</el-button>
                <el-button v-if="row.whetherCommit == 1" type="text" size="small" @click="handleExport(row.id)"
                  >导出</el-button
                >
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pagination"></div>
    </div>
    <div v-if="mainTab === '3'">
      <IrregularRisk />
    </div>
  </div>
</template>

<script>
import AddLeader from './addLeader.vue';
import MonthView from './common/monthView.vue';
import DayView from './common/dayView';
import IrregularRisk from './common/IrregularRisk/IrregularRisk.vue';
import { listRiskScreen, listRiskZeroStat, listRiskScreenStat, listRiskZeroStatStat } from '@/api/worship/risk';

export default {
  props: {},
  components: { AddLeader, MonthView, DayView, IrregularRisk },
  data() {
    return {
      //日期不能设置在今天之后
      PickerOptions: {
        // 限制时间
        disabledDate(time) {
          // 今天之后都禁用
          return time.getTime() > Date.now();
        },
      },
      tableData: [{}],
      stateMap: {
        1: { label: '每月不稳定风险排查表', count: 0, time: '', times: '', start: '', end: '' },
        2: { label: '信访不稳定因素每日零报告表', count: 0, time: '', times: '', start: '', end: '' },
        3: { label: '不定期风险报告', count: 0, time: '', times: '', start: '', end: '' },
      },
      todoCount: 0,
      done: 0,
      mainTab: '1',
      subTab: '2',
      form: {
        pageNum: 1,
        pageSize: 30,
        statMonth: null,
      },
      total: 0,
      //dialog drawer
      activeRow: {},
      selectedPeople: {},
      addLeaderDialog: false,
      submitValue: 0,
      uncommittValue: 0,
      headers: {
        Authorization: sessionStorage.token,
      },
      motn: new Date().getMonth() + 1,
      day: `${new Date().getMonth() + 1}月${new Date().getDate()}日`,
    };
  },
  computed: {
    userinfo() {
      return this.$store.state.user;
    },
  },
  watch: {
    userinfo(newVal, oldValu) {
      this.form.departCode = this.userinfo.divisionCode;
    },
  },
  created() {
    this.form.departCode = this.userinfo.divisionCode;
    this.form.statMonth = this.parseTime(new Date());
    this.mainTab = this.$route.query.tab || '1';
    let timer = setInterval(() => {
      if (this.form.departCode !== null) {
        this.getList();
        clearInterval(timer);
      }
    }, 100);
  },
  methods: {
    search() {
      console.log(this.subTab, this.mainTab);
      if (this.subTab === '1' && this.mainTab === '1') {
        this.$refs.monthView.getList();
        // return;
      }
      if (this.subTab === '1' && this.mainTab === '2') {
        this.$refs.dayView.getList();
        // return;
      }
      this.getList();
    },
    getList() {
      console.log(this.form);
      this.tableData = [];
      this.submitValue = 0;
      this.uncommittValue = 0;
      // 显示查询月份
      this.motn = this.form.statMonth ? this.form.statMonth.slice(5, 7) : new Date().getMonth() + 1;
      // 显示查询天数
      this.day = this.form.statMonth
        ? `${this.form.statMonth.slice(5, 7)}月${this.form.statMonth.slice(8, 10)}日`
        : `${new Date().getMonth() + 1}月${new Date().getDate()}日`;
      let url = ['/worshipRiskScreenStat/stat', '/worshipRiskZeroStat/stat'];

      if (this.mainTab == 1) {
        listRiskScreenStat(this.form).then((res) => {
          this.tableData = res.data;
          for (const item of this.tableData) {
            item.whetherCommit == 1 ? this.submitValue++ : this.uncommittValue++;
          }
        });
      } else {
        listRiskZeroStatStat(this.form).then((res) => {
          this.tableData = res.data;
          for (const item of this.tableData) {
            item.whetherCommit == 1 ? this.submitValue++ : this.uncommittValue++;
          }
        });
      }

      // axios({
      //   url: url[this.mainTab - 1],
      //   method: 'get',
      //   params: Object.assign({}, this.form, {}),
      // }).then((res) => {
      //   this.tableData = res;
      //   for (const item of this.tableData) {
      //     item.whetherCommit == 1 ? this.submitValue++ : this.uncommittValue++;
      //   }
      // });
    },
    transferText(tableData) {
      tableData.forEach((e) => {
        let typeMap = ['danger', 'warning', 'success'];
        e.infoLevelType = typeMap[e.infoLevel - 1] || '';
        e.infoLevelText = e.infoLevel ? this.dictMap['info_level'][e.infoLevel].dictLabel : '';
      });
      console.log('transfer', tableData);
    },
    removeItem() {},
    openDetail(row) {
      if (this.mainTab == 1) {
        this.$emit('viewItemMonth', { ...row, searchTime: this.form.statMonth });
      } else {
        this.$emit('viewItemDay', { ...row, searchTime: this.form.statMonth });
      }
    },
    openEdit() {
      this.addLeaderDialog = true;
    },
    openAdd() {
      this.addLeaderDialog = true;
    },
    leaderColose() {
      this.addLeaderDialog = false;
      this.getList();
    },
    handleCurrentChange(val) {
      this.form.page = val;
      this.getList();
    },
    handleSizeChange(val) {
      this.form.size = val;
      this.getList();
    },
    //导入
    uploadSuccess() {
      this.$message.success('导入成功');
      this.getList();
    },
    uploadTemp(path, name) {
      fetch(path, {
        headers: {
          Authorization: sessionStorage.token,
        },
      }).then((res) => {
        res.blob().then((blob) => {
          var a = document.createElement('a');
          var url = window.URL.createObjectURL(blob);
          var filename = `${name}.xlsx`;
          a.href = url;
          a.download = filename;
          a.click();
          window.URL.revokeObjectURL(url);
        });
      });
    },
    handleExport(path, name) {
      let ids = '';
      if (typeof id == 'number') {
        ids = id;
      } else {
        ids = this.tableData
          .filter((e) => e.whetherCommit == 1)
          .map((e) => e.id)
          .join(',');
      }
      if (!ids) {
        this.$message.warning('当前无镇街已提交,无导出数据');
        return;
      }
      this.download(path, { statId: ids }, `${name}_${new Date().getTime()}.xlsx`);
    },
    reset() {
      this.form = {
        page: 1,
        size: 30,
        statMonth: this.parseTime(new Date()),
        departCode: this.userinfo.divisionCode,
      };

      this.$nextTick(() => {
        this.search();
      });
    },
    mainTabClick(vm) {
      console.log(vm.name);
      this.$router.replace({
        query: {
          tab: vm.name,
        },
      });
      this.getList();
    },
    subTabClick() {
      this.form.statMonth = null;
      this.getList();
    },
  },
};
</script>

<style scoped lang="scss">
.interview {
  height: 100%;
  position: relative;
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 40px;
    .h-title {
      font-size: 20px;
      font-weight: bold;
    }
  }
  .main-tab {
    height: 60px;
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
    height: 66vh;
    background: #fff;
    margin-top: 16px;
    padding: 6px 24px;
    .state {
      .today {
        background: #fc9a22;
        color: #fff;
        padding: 4px 8px;
      }
      &.state2 {
        color: #fc9a22;
      }
      &.state3 {
        color: #ff0909;
      }
    }
    .table-header {
      height: calc(100% - 40px);
    }
    .subToolbar {
      height: 50px;
      overflow: hidden;
    }
    .sub {
      height: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
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
.right {
  display: flex;
  .upload {
    margin-right: 12px;
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
    }
  }
}
.table-box {
  height: 90%;
}
.postData {
  margin: 0 0 16px 0;
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
