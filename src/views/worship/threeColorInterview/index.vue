<template>
  <div class="interview app-container">
    <header>
      <div class="sub-title">三色走访</div>
    </header>
    <el-tabs v-model="form.colorMark" class="main-tab" @tab-click="mainTabClick">
      <el-tab-pane v-for="(item, index) in stateMap" :key="index" :name="index">
        <span slot="label"
          >{{ item.label }}<span class="num">{{ item.count }}</span></span
        >
      </el-tab-pane>
    </el-tabs>
    <div class="toolbar">
      <el-form :model="form" ref="form" :inline="true">
        <div class="left">
          <el-form-item label="行政区划:" prop="departCode">
            <TreeSelectDivision
              v-model="form.divisionCode"
              @treeselectChange="(e) => treeselectChange(e, form, 'divisionCode')"
            ></TreeSelectDivision>
          </el-form-item>
        </div>
        <div class="right">
          <el-form-item prop="keyWord">
            <el-input placeholder="请输入搜索关键字" v-model="form.keyWord" maxlength="100"></el-input>
          </el-form-item>
          <el-button type="primary" @click="getList">查询</el-button>
          <el-button @click="reset">重置</el-button>
        </div>
      </el-form>
    </div>
    <div class="table">
      <div class="subToolbar">
        <div class="sub">
          <div class="sub-title">
            {{ activeState.label }}
          </div>
          <div class="tip">走访周期：{{ activeState.rankUnit }} 天{{ activeState.rankNumber }}次</div>
        </div>
      </div>
      <el-table
        :data="tableData"
        border
        header-row-class-name="table-header"
        size="medium"
        style="width: 100%; height: 100%"
        height="calc(100% - 40px)"
      >
        <el-table-column prop="name" label="姓名" width="100"></el-table-column>
        <el-table-column prop="sex" label="性别" width="100">
          <template slot-scope="{ row }">
            <dict-tag :options="dict.type.sys_user_sex" :value="row.sex" />
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="联系方式" width="120"></el-table-column>
        <el-table-column prop="divisionName" label="行政区划" width=""></el-table-column>
        <el-table-column prop="outHomeAddress" label="家庭住址" width=""></el-table-column>
        <el-table-column prop="lastVisitTime" label="上次走访日期" width=""></el-table-column>
        <el-table-column prop="nextVisitTime" label="距下次走访还有" width="180">
          <template slot-scope="{ row }">
            <div>{{ row.nextVisitTime }}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" fixed="right">
          <template slot-scope="scope">
            <el-button type="text">
              <router-link :to="'/worship/people-info/info/' + scope.row.personId" class="link-type">
                <el-button size="mini" type="text">详情</el-button>
              </router-link>
            </el-button>
            <el-button type="text" size="small" @click="handleAddInterview(scope.row)">回访</el-button>
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
    <AddInterview
      v-if="showAddInterview"
      :info="activeRow"
      :row="activeForm"
      @close="showAddInterview = false"
      @success="addSuccess"
    ></AddInterview>
  </div>
</template>

<script>
import AddInterview from './dialog/addInterview.vue';
import { countDay } from '@/utils/common';
import { mapState } from 'vuex';
import { listPetitionPerson, getTabNum } from '@/api/worship/peopleList';
import { queryByConfigType } from '@/api/system/disposition';
export default {
  props: {},
  components: {
    AddInterview,
  },
  dicts: ['sys_user_sex'],
  data() {
    return {
      mainTab: '1',
      tableData: [],
      stateMap: {
        1: {
          label: '活跃人员',
          count: 0,
          time: '',
          times: '',
          start: '',
          end: '',
          api: 'activeFrequency',
          rankUnit: 0,
          rankNumber: 0,
        },
        2: {
          label: '稳定人员',
          count: 0,
          time: '',
          times: '',
          start: '',
          end: '',
          api: 'stableFrequency',
          rankUnit: 0,
          rankNumber: 0,
        },
        3: {
          label: '化解人员',
          count: 0,
          time: '',
          times: '',
          start: '',
          end: '',
          api: 'resolveFrequency',
          rankUnit: 0,
          rankNumber: 0,
        },
      },
      form: {
        colorMark: 1,
        keyWord: '',
        pageNum: 1,
        pageSize: 10,
      },
      total: 0,
      triPopperType: '',

      //dialog drawer
      activeRow: {},
      activeForm: {},
      showAddPeople: false,
      showAddInterview: false,
    };
  },
  computed: {
    dictMap() {
      return this.$store.state.dictMap;
    },
    activeState() {
      return this.stateMap[this.form.colorMark];
    },
    // 距本轮截至日期
    countDay() {
      return countDay(this.activeState.end);
    },
    ...mapState(['userinfo']),
  },
  watch: {
    $route: {
      handler(route) {
        this.form.colorMark = route.query.tab || '1';
        this.form.doneFlag = route.query.doneFlag || '';
        // this.form.departCode = setDashboardFormDepartCode(this.$route.query.departCode);
        this.$route.query.departCode && this.getList();
      },
      immediate: true,
    },
  },
  created() {
    this.form.colorMark = this.$route.query.tab || '1';
    this.form.doneFlag = this.$route.query.doneFlag || '';
    // this.form.departCode = setDashboardFormDepartCode(this.$route.query.departCode)
    // this.form.departCode = this.userinfo.departCode;
    setTimeout(() => {
      this.getList();
    }, 500);
    this.getConfig();
    this.getCount();
  },
  mounted() {
    console.log(this.countDay);
  },
  methods: {
    getConfig() {
      let systemConfig = {};
      queryByConfigType('fuyang').then((res) => {
        systemConfig = res.data.systemConfig;
        console.log('systemConfig', systemConfig);
        for (const index in this.stateMap) {
          this.stateMap[index].rankUnit = systemConfig[this.stateMap[index].api].timeUnit;
          this.stateMap[index].rankNumber = systemConfig[this.stateMap[index].api].visitNum;
        }
      });
    },
    getCount() {
      getTabNum(this.form).then((res) => {
        for (const index in this.stateMap) {
          this.stateMap[index].count = res.data[index];
        }
      });
    },
    getList() {
      this.loading = true;

      listPetitionPerson(this.form).then((response) => {
        this.tableData = response.rows;
        this.total = response.total;
        this.loading = false;
      });
      // let departCode = getFormDepartCode(this.form.departCode).departCode;
      // axios({
      //   methods: 'get',
      //   url: '/petitionColorVisit/getPageByRetiredId',
      //   params: Object.assign({}, this.form, {
      //     departCode,
      //   }),
      // }).then((res) => {
      //   this.tableData = res.records;
      //   transferText(this.tableData);
      //   this.stateMap[1].count = res[1];
      //   this.stateMap[2].count = res[2];
      //   this.stateMap[3].count = res[3];
      //   this.total = res[this.form.colorMark];
      // });
    },

    handleAddInterview(row) {
      this.activeRow = row;
      this.activeForm = {};
      this.showAddInterview = true;
    },
    addSuccess() {
      this.showAddInterview = false;
      this.getList();
    },
    changePopperType(row, color, text) {
      row.stateText = text;
      row.color = color;
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
      console.log(vm.name);
      this.$router.replace({
        query: {
          tab: vm.name,
        },
      });
      this.getList();
    },
    subTabClick() {},
    handleSearch() {},
    reset() {
      this.form = {
        colorMark: this.form.colorMark,
        doneFlag: '',
        isRights: '1',
        // departCode: this.userinfo.departCode,
        page: 1,
        size: 30,
      };
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
    .sub-title {
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
}
.pagination {
  height: 40px;
  padding-top: 10px;
  background: #fff;
  text-align: right;
  padding-right: 24px;
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
.table {
  height: 67vh;
  background: #fff;
  margin-top: 16px;
  padding: 6px 24px;
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

// .table
//     height calc(100% - 240px)
//     background: #fff
//     margin-top 16px
//     padding 6px 24px
//     .state
//         .today
//             background: $warning
//             color #fff
//             padding 4px 8px
//         &.state2
//             color $warning
//         &.state3
//             color $danger
//     .table-header
//         height calc(100% - 40px)
//     .subToolbar
//         height: 50px
//         overflow: hidden
//     .sub
//         height: 100%
//         display: flex
//         justify-content: space-between
//         align-items: center
//     .title
//         font-size 16px
//         height 34px
//         font-weight: bold
</style>
