<template>
  <div class="app-container">
    <div class="header">常态化联系退役军人</div>
    <div class="tabs">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="走访动态" name="visitTrends"></el-tab-pane>
        <el-tab-pane label="未走访情况" name="notVisited"></el-tab-pane>
      </el-tabs>
    </div>
    <component :is="activeName"></component>
  </div>
</template>

<script>
import visitTrends from './visitTrends/index.vue';
import notVisited from './notVisited/index.vue';
export default {
  name: 'Visiting',
  dicts: [
    'sys_worship_visittype',
    'sys_worship_visitingmethods',
    'sys_worship_assistancemeasures',
    'sys_worship_personneltype',
    'sys_worship_personneltag',
  ],
  components: {
    visitTrends,
    notVisited,
  },
  data() {
    return {
      activeName: 'visitTrends',
    };
  },
  created() {
    this.activeName = this.$route.query.tab || 'visitTrends';
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

.tabs {
  display: flex;
  line-height: 40px;
  .draft {
    background: url('~@/assets/images/draft.png');
    width: 102px;
    height: 40px;
    cursor: pointer;
  }
  .el-tabs {
    margin: 0 20px 0 0;
  }
}
::v-deep .el-tabs__nav-wrap::after {
  height: 0px !important;
}
</style>
