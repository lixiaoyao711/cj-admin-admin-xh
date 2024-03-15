<template>
  <div class="app-container">
    <div class="header">
      <span>信访咨询动态</span>

      <router-link :to="'/petitionInfo/registerToday/'" class="link-type">
        <!-- <router-link :to="'/worship/people-info/info/' + scope.row.id + '?tab=assistanceInfo'" class="link-type"> -->
        <el-button size="mini">今日登记情况</el-button>
      </router-link>
    </div>
    <div class="tabs">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane v-for="(item, index) in tabsMap" :key="item.path" :name="item.path">
          <span slot="label"
            >{{ item.name }}<span class="num">({{ item.count }})</span></span
          ></el-tab-pane
        >
      </el-tabs>
    </div>
    <component :is="activeName" @getList="getTabNum"></component>
  </div>
</template>

<script>
import { getTabNum } from '@/api/worship/petitionInfo';
import all from './all/index';
import pending from './pending/index';
import processing from './processing/index';
import completed from './completed/index';
import evaluated from './evaluated/index';
import backlog from './backlog/index';
import tracking from './tracking/index';

export default {
  name: 'petitionInfo',
  components: {
    all,
    pending,
    processing,
    completed,
    evaluated,
    backlog,
    tracking,
  },
  data() {
    return {
      tabsMap: [
        {
          name: '全部',
          count: 0,
          path: 'all',
        },
        {
          name: '待处理',
          count: 0,
          path: 'pending',
        },
        {
          name: '受理中',
          count: 0,
          path: 'processing',
        },
        {
          name: '已结案',
          count: 0,
          path: 'completed',
        },
        {
          name: '已评价',
          count: 0,
          path: 'evaluated',
        },
        {
          name: '积案',
          count: 0,
          path: 'backlog',
        },
        {
          name: '追踪列表',
          count: 0,
          path: 'tracking',
        },
      ],
      activeName: 'all',
    };
  },
  computed: {},
  watch: {},
  created() {
    this.activeName = this.$route.query.tab || 'all';
    this.getTabNum();
  },
  methods: {
    getTabNum(queryParams = {}) {
      getTabNum(queryParams).then((res) => {
        console.log(res);
        if (res.code === 200) {
          this.tabsMap.forEach((item) => {
            item.count = res.data[item.name] || 0;
          });
        }
      });
    },
    handleClick(vm) {
      this.$router.replace({
        path: '',
        query: {
          tab: vm.name,
        },
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.header {
  height: 37.33px;
  font-family: PingFangSC-Medium;
  font-weight: 600;
  font-size: 26.67px;
  color: #000000d9;
  letter-spacing: 0;
  line-height: 37.33px;
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;
}

.search-form {
  background-color: #fff;
  padding: 20px 0 0 20px;
  box-sizing: border-box;

  .search-right {
    float: right;
  }
}

.table {
  background: #fff;
  margin: 16px 0 0 0;
  padding: 16px;
  box-sizing: border-box;
  // height: 544px;

  .table-title-box {
    display: flex;
    justify-content: space-between;

    .title-name {
      font-family: PingFangSC-Medium;
      font-weight: 600;
      font-size: 18px;
      color: #333333;
    }
  }
}

.el-icon-location-information {
  font-size: 24px;
  margin: 5px 0 0 18px;
  cursor: pointer;
}
.df {
  display: flex;
  align-items: center;
  .el-icon-setting {
    font-size: 20px;
    cursor: pointer;
  }
}

.longTerm {
  margin: 0 0 0 16px;
}
.tabs {
  display: flex;
  line-height: 40px;

  .el-tabs {
    margin: 0 20px 0 0;
  }
}
::v-deep .el-tabs__nav-wrap::after {
  height: 0px !important;
}
</style>
