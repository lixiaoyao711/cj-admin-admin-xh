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
        <div class="tags">
          <dict-tag :options="dict.type.sys_worship_personneltag" :value="userInfo.personnelTags" />
        </div>
        <div class="data-time">
          <span>数据更新时间:{{ userInfo.updateTime }}</span>
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
import organizationInfo from './organizationInfo/index.vue'; // 组织生活、社会活动信息
import serviceInfo from './serviceInfo/index.vue'; // 服役信息
import placementInfo from './placementInfo/index.vue'; // 安置信息
import employmentInfo from './employmentInfo/index.vue'; // 就业创业信息
import educationInfo from './educationInfo/index.vue'; // 教育培训信息
import preferentialInfo from './preferentialInfo/index.vue'; // 抚恤优待信息
import encouragementInfo from './encouragementInfo/index.vue'; // 褒扬激励信息
import assistanceInfo from './assistanceInfo/index.vue'; // 帮扶援助信息
import rightsInfo from './rightsInfo/index.vue'; // 权益维护
import visitInfo from './visitInfo/index.vue'; // 走访慰问
import recordInfo from './recordInfo/index.vue'; // 办事记录
import commemorationInfo from './commemorationInfo/index.vue'; // 褒扬纪念
import medicalInfo from './medicalInfo/index.vue'; // 医保自负
import { getBasicPerson } from '@/api/worship/retiredSoldier'; // 获取基本信息

export default {
  dicts: ['sys_worship_personneltag'],
  props: {},
  components: {
    basicInfo,
    organizationInfo,
    serviceInfo,
    placementInfo,
    employmentInfo,
    educationInfo,
    preferentialInfo,
    encouragementInfo,
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
          name: '组织生活、社会活动信息',
          path: 'organizationInfo',
        },
        {
          name: '服役信息',
          path: 'serviceInfo',
        },
        {
          name: '安置信息',
          path: 'placementInfo',
        },
        {
          name: '就业创业信息',
          path: 'employmentInfo',
        },
        {
          name: '教育培训信息',
          path: 'educationInfo',
        },
        {
          name: '抚恤优待信息',
          path: 'preferentialInfo',
        },
        {
          name: '褒扬激励信息',
          path: 'encouragementInfo',
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
    this.getBasicPerson();
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
    getBasicPerson() {
      getBasicPerson(this.$route.params.id).then((response) => {
        this.userInfo = response.data;
      });
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
