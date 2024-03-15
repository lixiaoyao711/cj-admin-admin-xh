<template>
  <div class="loginLog">
    <el-tabs v-model="topTab" @tab-click="topClick">
      <el-tab-pane v-for="(item, index) in topTabsList" :key="item.name" :label="item.label" :name="item.name">
        <component ref="component" :is="topTab"></component>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import adminLog from './admingLog.vue';
import zlbLog from './zlbLog.vue';
export default {
  props: {},
  components: {
    adminLog,
    zlbLog,
  },
  data() {
    return {
      topTab: 'adminLog',
      topTabsList: [
        {
          label: '崇军系统登录日志',
          name: 'adminLog',
        },
        {
          label: '浙里办登录日志',
          name: 'zlbLog',
        },
      ],
    };
  },
  computed: {

  },
  watch: {},
  created() {
    this.topTab = this.$route.query.topTab || this.topTabsList[0].name;
  },
  mounted() {},
  methods: {
    topClick(vm) {
      this.$router.replace({
        name: '',
        query: {
          ...this.$route.query,
          topTab: vm.name,
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.toolbar {
  display: flex;
  align-items: center;
  background: #fff;
  height: 60px;
  padding: 0 24px;
  v-deep {
    .el-form {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
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
.left {
  display: flex;
  align-items: center;
}
</style>
