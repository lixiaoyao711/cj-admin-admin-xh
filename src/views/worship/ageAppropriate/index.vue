<template>
  <div class="app-container">
    <div class="header">我要参军</div>
    <div class="tabs">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane v-for="(item, index) in tabsMap" :key="item.path" :label="item.label" :name="item.name">
        </el-tab-pane>
      </el-tabs>
    </div>
    <component :is="activeName"></component>
  </div>
</template>

<script>
import ageAppropriate from './ageAppropriate/index';
import newSoldier from './newSoldier/index';
export default {
  components: {
    ageAppropriate,
    newSoldier,
  },
  data() {
    return {
      tabsMap: [
        {
          label: '适龄人员',
          name: 'ageAppropriate',
        },
        {
          label: '新兵名单',
          name: 'newSoldier',
        },
      ],
      activeName: 'ageAppropriate',
    };
  },
  computed: {},
  watch: {},
  created() {
    this.activeName = this.$route.query.tab || 'ageAppropriate';
  },
  methods: {
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
