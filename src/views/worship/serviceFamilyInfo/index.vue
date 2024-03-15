<!-- 现役军人家属详情 -->
<template>
  <div class="index">
    <header>
      <div class="header-left">
        <div class="back" @click="back">
          <i class="el-icon-arrow-left"></i>
          <span>返回</span>
        </div>
        <div class="user-name">
          <span>{{ userInfo.name }}</span>
        </div>
        <div class="data-time">
          <span>数据更新时间:{{ userInfo.createTime }}</span>
        </div>
      </div>
      <div class="header-right">
        <el-button type="text">
          <el-tag size="medium" type="success">已核实</el-tag>
        </el-button>
      </div>
    </header>
    <div class="tabs">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane v-for="(item, index) in tabs" :key="item.path" :label="item.name" :name="item.path"> </el-tab-pane>
      </el-tabs>
    </div>
    <component class="component mt20" :is="activeName"></component>
  </div>
</template>

<script>
import basicInfo from './basicInfo/index.vue'; // 基本信息
import assistanceInfo from './assistanceInfo/index.vue'; // 帮扶援助信息
import rightsInfo from '@/views/worship/peopleInfo/rightsInfo/index.vue'; // 权益维护
import visitInfo from '@/views/worship/peopleInfo/visitInfo/index.vue'; // 走访慰问
import recordInfo from '@/views/worship/peopleInfo/recordInfo/index.vue'; // 办事记录
import commemorationInfo from '@/views/worship/peopleInfo/commemorationInfo/index'; // 褒扬纪念
import medicalInfo from '@/views/worship/peopleInfo/medicalInfo/index.vue'; // 医保自负
import { getBasicPerson, addBasicPerson, updateBasicPerson } from '@/api/worship/retiredSoldier';
export default {
  name: 'ServiceFamilyInfo',
  props: {},
  dicts: ['sys_worship_personneltag', 'sys_worship_ethnicgroup', 'sys_user_sex'],
  components: {
    basicInfo,
    assistanceInfo,
    rightsInfo,
    visitInfo,
    recordInfo,
    commemorationInfo,
    medicalInfo,
  },
  data() {
    return {
      tabs: [
        {
          name: '基本信息',
          path: 'basicInfo',
        },
        {
          name: '帮扶援助信息',
          path: 'assistanceInfo',
        },
        {
          name: '权益维护',
          path: 'rightsInfo',
        },
        {
          name: '走访慰问',
          path: 'visitInfo',
        },
        {
          name: '办事记录',
          path: 'recordInfo',
        },
        // {
        //   name: '褒扬纪念',
        //   path: 'commemorationInfo',
        // },
        {
          name: '医保自负',
          path: 'medicalInfo',
        },
      ],
      activeName: 'basicInfo',
      userInfo: {},
    };
  },
  computed: {},
  watch: {},
  created() {
    this.getServiceFamilyBaseInfo();
  },
  mounted() {
    this.activeName = this.$route.query.tab || 'basicInfo';
  },
  methods: {
    back() {
      this.$router.go(-1);
    },
    handleClick(value) {
      this.$router.replace({
        path: ``,
        query: {
          tab: value.name,
        },
      });
    },
    async getServiceFamilyBaseInfo() {
      let res = await getBasicPerson(this.$route.params.id);
      console.log('🚀 ~ 现役军人家属人员详情 getServiceFamilyBaseInfo:', res.data);
      if (res.data) {
        this.userInfo = res.data;
      }
    },
  },
};
</script>

<style scoped lang="scss">
.index {
  box-sizing: border-box;
  padding: 20px;
  header {
    display: flex;
    justify-content: space-between;
    .header-left {
      display: flex;
      .back {
        font-size: 16px;
        display: flex;
        align-items: center;
        cursor: pointer;
      }
      .user-name {
        font-size: 32px;
        font-weight: 600;
        margin: 0 20px;
      }
      .tags {
        display: flex;
        align-items: center;
        .el-tag {
          margin: 0 10px 0 0;
        }
      }
      .data-time {
        margin: 0 0 0 10px;
        font-size: 14px;
        display: flex;
        align-items: center;
      }
    }
  }
  .tabs {
    background: #fff;
    padding: 10px 10px 0 10px;
    box-sizing: border-box;
    margin: 10px 0 0 0;
  }
  .component {
    height: 74vh;
  }
}
::v-deep .el-tabs__nav-wrap::after {
  height: 0px !important;
}
</style>
