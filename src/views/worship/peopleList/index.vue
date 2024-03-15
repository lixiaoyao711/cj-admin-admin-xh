<template>
  <div class="app-container">
    <div class="header">权益维护人员</div>
    <div class="tabs">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane
          v-for="(item, index) in tabMap"
          :key="item.name"
          :label="item.label"
          :name="item.name"
        ></el-tab-pane>
      </el-tabs>
    </div>
    <component :is="activeName"></component>
  </div>
</template>

<script>
import indoor from './indoor/index';
import outdoors from './outdoors/index';
import keyGroup from './keyGroup/index.vue';
export default {
  name: 'physicalExamination',
  components: {
    indoor,
    outdoors,
    keyGroup,
  },
  data() {
    return {
      activeName: 'indoor',
      tabMap: [
        {
          label: '户内人员',
          name: 'indoor',
        },
        {
          label: '户外人员',
          name: 'outdoors',
        },
        {
          label: '重点群体',
          name: 'keyGroup',
        },
      ],
    };
  },
  created() {
    this.activeName = this.$route.query.tab || 'indoor';
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

  .el-tabs {
    margin: 0 20px 0 0;
  }
}
::v-deep .el-tabs__nav-wrap::after {
  height: 0px !important;
}
</style>
