<template>
  <div class="app-container">
    <div class="header">义务兵父母体检</div>
    <div class="tabs">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="体检计划" name="physicalExaminationPlan"></el-tab-pane>
        <el-tab-pane :label="`体检申请（${total}）`" name="physicalExaminationApplication"></el-tab-pane>
      </el-tabs>
    </div>
    <component :is="activeName"></component>
  </div>
</template>

<script>

import physicalExaminationPlan from './physicalExaminationPlan/index';
import physicalExaminationApplication from './physicalExaminationApplication/index.vue';
import { listPhysicalExaminationApplication } from "@/api/worship/physicalExaminationApplication";
export default {
  name: 'physicalExamination',
  components: {
    physicalExaminationPlan,
    physicalExaminationApplication,
  },
  data() {
    return {
      activeName: 'physicalExaminationPlan',
      total:0,
    };
  },
  created() {
    this.activeName = this.$route.query.tab || 'physicalExaminationPlan';
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
    getApplication() {
      listPhysicalExaminationApplication({pageNum: -1}).then(response => {
        this.total = response.total || 0;
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
