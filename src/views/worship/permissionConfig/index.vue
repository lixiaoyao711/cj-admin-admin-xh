<template>
  <div class="app-container">
    <div class="header">权限配置</div>
    <div class="tabs">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane v-for="(item, index) in tabs" :key="index" :label="item.label" :name="item.name"></el-tab-pane>
      </el-tabs>
    </div>
    <component :is="activeName"></component>
  </div>
</template>

<script>
import personnelManagement from './personnelManagement/index.vue';
import zhezhengding from './zhezhengding/index.vue';
import commonPersonnel from './commonPersonnel/index.vue';
import roleManagement from './roleManagement/index.vue';
export default {
  components: {
    personnelManagement,
    zhezhengding,
    commonPersonnel,
    roleManagement,
  },
  data() {
    return {
      activeName: 'personnelManagement',
      tabs: [
        {
          label: '人员管理',
          name: 'personnelManagement',
        },
        {
          label: '浙政钉组织',
          name: 'zhezhengding',
        },
        {
          label: '常用人员',
          name: 'commonPersonnel',
        },
        {
          label: '角色管理',
          name: 'roleManagement',
        },
      ],
    };
  },
  created() {
    this.activeName = this.$route.query.tab || 'personnelManagement';
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
  display: flex;
  justify-content: space-between;
  .search-right {
    width: 10%;
  }
}

.table {
  background: #fff;
  margin: 16px 0 0 0;
  padding: 16px;
  box-sizing: border-box;
  height: 710px;
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
