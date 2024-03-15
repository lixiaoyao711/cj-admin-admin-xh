<template>
  <div class="loginLog">
    <div class="toolbar">
      <el-form :model="query" ref="form" :inline="true">
        <div class="left">
          <el-form-item label="">
            <el-tabs v-model="mainTab" @tab-click="handleClick">
              <el-tab-pane
                v-for="(item, index) in tabsList"
                :key="index"
                :label="item.label"
                :name="item.name"
              ></el-tab-pane>
            </el-tabs>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <component ref="component" v-model="query" :propsQuery="query" :is="mainTab"></component>
  </div>
</template>

<script>
import loginLogInfo from './loginLogInfo.vue';
import loginLogCount from './loginLogCount.vue';
export default {
  props: {},
  components: {
    loginLogInfo,
    loginLogCount,
  },
  data() {
    return {
      mainTab: 'loginLogInfo',
      searchTime: null,
      tabsList: [
        {
          label: '登录明细',
          name: 'loginLogInfo',
        },
        {
          label: '登录统计',
          name: 'loginLogCount',
        },
      ],
      query: {
        page: 1,
        size: 30,
        departType: '3',
        platType: 0,
        departCode: '',
      },
    };
  },
  computed: {

  },
  watch: {},
  created() {
    this.mainTab = this.$route.query.subTab || this.tabsList[0].name;
  },
  mounted() {},
  methods: {
    search() {
      this.$refs.component.getList();
    },
    reset() {
      this.query = {
        page: 1,
        size: 30,
        departType: this.query.departType,
        platType: 0,
        departCode: '',
        searchTime: null,
      };
      setTimeout(() => {
        this.search();
      }, 200);
    },
    handleClick(vm) {
      this.query.searchTime = null;
      this.$router.replace({
        name: '',
        query: {
          ...this.$route.query,
          subTab: vm.name,
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
