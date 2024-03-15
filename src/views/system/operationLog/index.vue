<template>
  <div class="conscripts app-container">
    <div class="title-label">日志查看</div>

    <el-tabs v-model="mainTab" @tab-click="handleClick">
      <el-tab-pane v-for="(item, index) in tabsList" :key="item.name" :label="item.label" :name="item.name">
        <component :is="mainTab"></component>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
// 组件
import handleLog from './handleLog.vue';
import loginLog from './loginLog/loginLog.vue';
import dataSyncLog from './dataSyncLog.vue';
export default {
  props: {},
  components: { loginLog, handleLog, dataSyncLog },
  data() {
    return {
      mainTab: 'handleLog',

      tabsList: [
        {
          label: '操作日志',
          name: 'handleLog',
        },
        {
          label: '登录日志',
          name: 'loginLog',
        },
        {
          label: '数据同步日志',
          name: 'dataSyncLog',
        },
        {
          label: '赋分情况',
          name: 'assignPoints',
        },
      ],
    };
  },
  computed: {},
  watch: {},
  created() {
    this.mainTab = this.$route.query.tab || this.tabsList[0].name;
  },
  mounted() {},
  methods: {
    handleClick(vm) {
      this.$router.replace({
        name: '',
        query: {
          tab: vm.name,
        },
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.title-label {
  font-size: 24px;
  font-weight: 600;
}
</style>
