<template>
  <div class="app-container">
    <div class="header">通知发布</div>
    <div class="tabs">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane v-for="(item, index) in tabMap" :key="index" :label="item.label" :name="item.name"> </el-tab-pane>
      </el-tabs>
    </div>
    <component :is="activeName"></component>
  </div>
</template>

<script>
import Banner from './banner/index.vue';
import Notification from './notification/index.vue';
export default {
  name: 'NotificationRelease',
  components: {
    Banner,
    Notification,
  },
  data() {
    return {
      activeName: 'Banner',
      tabMap: [
        {
          label: 'Banner',
          name: 'Banner',
        },
        {
          label: '通知',
          name: 'Notification',
        },
      ],
    };
  },
  created() {
    this.activeName = this.$route.query.tab || 'Banner';
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
