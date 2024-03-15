<template>
  <div class="app-container">
    <div class="tabs">
      <span class="back" @click="$router.push('/index')"><i class="el-icon-back"></i> 返回 </span> 
      <el-tabs v-model="mainTab" @tab-click="handleMainClick">
        <el-tab-pane v-for="(item,index) in tabList" :key="index" :label="item.label" :name="item.name"></el-tab-pane>
      </el-tabs>
    </div>
    <div class="tabs">
      <el-tabs v-model="secondaryTab" @tab-click="handleSecondaryClick">
        <el-tab-pane v-if="mainTab !== 'noActive'" :label="`退役军人(${tabNum[0]})`" name="1"></el-tab-pane>
        <el-tab-pane v-if="mainTab !== 'noActive'" :label="`其他优抚对象(${tabNum[1]})`" name="2"></el-tab-pane>
        <el-tab-pane :label="`现役军人家属(${this.tabNum[2]})`" name="3"></el-tab-pane>
      </el-tabs>
    </div>
    <verification :query="query"></verification>
  </div>
</template>

<script>
import { listServiceFamily } from '@/api/worship/serviceFamily';
import { listBasicPerson } from '@/api/worship/retiredSoldier';
import verification from './components/verification';
export default {
  name: 'informationVerification',
  dicts: [],
  components: {
    verification
  },
  data() {
    return {
      secondaryTab:'1',
      mainTab:'noPhone',
      query:{},
      tabNum:[0,0,0],
      tabData:{
        verification:[
          {
            name:'noPhone',
            label:'手机号信息不全',
          },
          {
            name:'noIdCard',
            label:'身份证信息不全',
          },
          {
            name:'noActive',
            label:'未关联现役军人的家属',
          },
        ],
        reachAgePerson:[
          {
            name:'ageMale',
            label:'三个月内即将满60岁男性',
          },
          {
            name:'ageFemale',
            label:'三个月内即将满55岁女性',
          },
        ],
        deceasedPerson:[
          {
            name:'thisMonthDeath',
            label:'本月去世人员',
          },
          {
            name:'deathStatus',
            label:'所有去世人员',
          },
        ]
      }
    };
  },
  computed: {
    tabList(){
      return this.tabData[this.$route.query.name]
    }
  },
  created() {
    this.mainTab = this.$route.query.tab
    this.$route.query.tab === 'noActive' ? this.secondaryTab = '3' : ''
    this.query[this.$route.query.tab] = '1'
    this.query['attribute'] = '1'
    this.getTabNumber()
  },
  methods: {
    getTabNumber(){
      let query = Object.assign({},this.query,{
        pageNum: 1,
        pageSize: 10,
      })
      query.attribute = '1'
      listBasicPerson(query).then(res =>{
        this.$set(this.tabNum, 0, res.total)
      })
      query.attribute = '2'
      listBasicPerson(query).then(res =>{
        this.$set(this.tabNum, 1, res.total)
      })
      query.attribute = '3'
      listBasicPerson(query).then(res =>{
        this.$set(this.tabNum, 2, res.total)
      })
    },
    handleMainClick(val) {
      this.query = {
        divisionCode: this.$store.state.user.divisionCode,
      }
      this.mainTab = this.$route.query.tab = val.name
      this.$route.query.tab === 'noActive' ? this.secondaryTab = '3' : ''
      this.query[this.$route.query.tab] = '1'
      this.query['attribute'] = this.secondaryTab
      this.getTabNumber()
    },
    handleSecondaryClick(val){
      this.query = {
        divisionCode: this.$store.state.user.divisionCode,
      }
      this.secondaryTab = val.name
      this.query[this.$route.query.tab] = '1'
      this.query['attribute'] = this.secondaryTab
    },
  },
};
</script>
<style lang="scss" scoped>
.header {
  height: 34.33px;
  font-family: PingFangSC-Medium;
  font-weight: 600;
  font-size: 26.67px;
  color: #000000d9;
  letter-spacing: 0;
  line-height: 37.33px;
  margin-bottom: 16px;
  
}
.back{
  font-weight: 400;
  font-size: 16px;
  margin-right: 20px;
  margin-top: 2px;
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
