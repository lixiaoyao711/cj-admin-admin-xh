<template>
  <div class="app-container">
    <div class="header">就业创业</div>
    <div class="tabs">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane v-for="(item, index) in tabMap" :key="index" :label="item.label" :name="item.name"> </el-tab-pane>
      </el-tabs>
    </div>
    <component :is="activeName"></component>
  </div>
</template>

<script>
import business from './business';
import relevantPolicy from './relevantPolicy';
import finance from './finance';
export default {
  name: 'Entrepreneurship',
  components: {
    business,
    relevantPolicy,
    finance,
  },
  data() {
    return {
      activeName: 'business',
      tabMap: [
        {
          label: '创业帮扶',
          name: 'business',
        },
        {
          label: '相关政策',
          name: 'relevantPolicy',
        },
        {
          label: '拥军金融',
          name: 'finance',
        },
      ],
    };
  },
  created() {
    this.activeName = this.$route.query.tab || 'business';
  },
  methods: {
    handleClick() {
      this.$router.push({
        path: '',
        query: {
          tab: this.activeName,
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
