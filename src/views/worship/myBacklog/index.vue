<template>
  <div class="app-container">
    <div class="header">我的待办</div>
    <div class="tabs">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane v-for="(item, index) in tabsMap" :key="item.path" :name="item.path">
          <span slot="label"
            >{{ item.name }}<span class="num">({{ item.count }})</span></span
          ></el-tab-pane
        >
      </el-tabs>
    </div>
    <component :is="activeName" @getList="getListPetitionInfo"></component>
  </div>
</template>

<script>
import { listPetitionInfo, listPetitionFeedbackLog } from '@/api/worship/petitionInfo';
import pending from './pending/index';
import processing from './processing/index';
import completed from './completed/index';
import pendingEnd from './pendingEnd/index';

export default {
  components: {
    pending,
    processing,
    completed,
    pendingEnd,
  },
  data() {
    return {
      tabsMap: [
        {
          name: '待我处理',
          count: 0,
          path: 'pending',
        },
        {
          name: '我的已办',
          count: 0,
          path: 'pendingEnd',
        },
        {
          name: '待我审核',
          count: 0,
          path: 'processing',
        },
        {
          name: '我已审核',
          count: 0,
          path: 'completed',
        },
      ],
      activeName: 'pending',
    };
  },
  computed: {},
  watch: {},
  created() {
    this.activeName = this.$route.query.tab || 'pending';
    this.getListPetitionInfo();
  },
  methods: {
    getListPetitionInfo(queryParams = {}) {
      listPetitionInfo({ ...queryParams, pageNum: 1, pageSize: 99999, whetherTodo: 1, infoDivisionCode: 330106 }).then(
        (res) => {
          if (res.code === 200) {
            this.tabsMap[0].count = res.total;
          }
        }
      );
      listPetitionInfo({ ...queryParams, pageNum: 1, pageSize: 99999, whetherTodo: 2, infoDivisionCode: 330106 }).then(
        (res) => {
          if (res.code === 200) {
            this.tabsMap[1].count = res.total;
          }
        }
      );
      listPetitionFeedbackLog({
        ...queryParams,
        pageNum: 1,
        pageSize: 99999,
        permType: 0,
        infoDivisionCode: 330106,
      }).then((res) => {
        if (res.code === 200) {
          this.tabsMap[2].count = res.total;
        }
      });
      listPetitionFeedbackLog({
        ...queryParams,
        pageNum: 1,
        pageSize: 99999,
        permType: 1,
        infoDivisionCode: 330106,
      }).then((res) => {
        if (res.code === 200) {
          this.tabsMap[3].count = res.total;
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
