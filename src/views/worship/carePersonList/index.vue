<template>
  <div class="app-container">
    <div class="header">关爱帮扶人员列表</div>
    <div class="tabs">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane 
        v-for="(item,index) in tabMap"
        :key="index"
        :label="index + `(${item.num})`"
        :name="item.name"></el-tab-pane>
      </el-tabs>
    </div>
    <component :is="activeName" @changeTag="getTab"></component>
  </div>
</template>

<script>

import { getTabNum } from "@/api/worship/carePersonList";
import suspectedDifficultyPerson from './components/suspectedDifficultyPerson.vue';
import difficultyPerson from './components/difficultyPerson.vue';
import verifyNotDifficulty from './components/verifyNotDifficulty.vue'
import getoutofPoverty from './components/getoutofPoverty.vue'
import tobeTransferred from './components/tobeTransferred.vue'
export default {
  name: 'carePersonList',
  components: {
    suspectedDifficultyPerson,
    difficultyPerson,
    verifyNotDifficulty,
    getoutofPoverty,
    tobeTransferred
  },
  data() {
    return {
      activeName: 'suspectedDifficultyPerson',
      tabMap:{
        疑似困难人员: {
          name:'suspectedDifficultyPerson',
          num: 0,
        },
        困难人员: {
          name:'difficultyPerson',
          num: 0,
        },
        核实非困难: {
          name:'verifyNotDifficulty',
          num: 0,
        },
        脱困记录: {
          name:'getoutofPoverty',
          num: 0,
        },
        待转出: {
          name:'tobeTransferred',
          num: 0,
        },
      }
    }
  },
  created() {
    this.activeName = this.$route.query.tab || 'suspectedDifficultyPerson';
    this.getTab()
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
    getTab() {
      this.loading = true;
      getTabNum({}).then(response => {
        for(let i in this.tabMap){
          response.data[i] ? this.tabMap[i].num = response.data[i] : ''
        }
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
