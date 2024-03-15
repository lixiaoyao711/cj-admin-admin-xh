<template>
  <div class="main">
    <div class="user-info">
      <div class="header">
        <peopleTitle>基础身份信息</peopleTitle>

        <el-button @click="openDialog('lifeSituationOpen')" size="mini">编 辑</el-button>
      </div>
      <peopleTable :tableData="lifeSituation" :count="3" />
    </div>
    <div class="user-info">
      <div class="header">
        <peopleTitle>退役军人村、社区“两委”成员（兵支书）基本情况</peopleTitle>
        <el-button @click="openDialog('selfInfoOpen')" size="mini">编 辑</el-button>
      </div>
      <div class="header-title">本人情况</div>
      <peopleTable :tableData="selfInfo" :count="3" />
      <div class="header-title">任职村（社区）情况</div>
      <peopleTable :tableData="jobSituation" :count="3" />
    </div>
    <div class="user-info">
      <div class="header">
        <peopleTitle>志愿服务情况</peopleTitle>

        <el-button @click="openDialog('volunteerServiceOpen', '', '新增志愿服务情况')" size="mini">新 增</el-button>
      </div>
      <peopleTable :tableData="volunteerService" :tableProps="volunteerServiceProps" :count="3">
        <template slot="post" slot-scope="{ row }">
          <el-button @click="openDialog('volunteerServiceOpen', row.id, '编辑志愿服务情况')" type="text"
            >编辑</el-button
          >
          <el-button type="text">
            <el-popconfirm @confirm="delVolunteer(row)" title="确定要删除该志愿服务吗?">
              <el-button slot="reference" type="text">删除</el-button>
            </el-popconfirm>
          </el-button>
        </template>
      </peopleTable>
    </div>
    <div class="user-info">
      <div class="header">
        <peopleTitle>参加志愿活动</peopleTitle>

        <!-- <el-button size="mini">编 辑</el-button> -->
      </div>
      <peopleTable :tableData="joinPartyActivities" :tableProps="joinPartyActivitiesProps" :count="3" />
    </div>
    <lifeSituationDialog
      v-if="lifeSituationOpen"
      :propsId="itemId.lifeSituationId"
      @success="getList"
      @close="lifeSituationOpen = false"
    />
    <selfInfoDialog v-if="selfInfoOpen" :propsId="itemId.selfInfoId" @success="getList" @close="selfInfoOpen = false" />
    <volunteerServiceDialog
      v-if="volunteerServiceOpen"
      :propsId="getId"
      @success="getList"
      :title="title"
      @close="volunteerServiceOpen = false"
    />
  </div>
</template>

<script>
import peopleTable from '@/views/worship/peopleInfo/common/peopleTable/index';
import peopleTitle from '@/views/worship/peopleInfo/common/title/index';
import { personExpandPersonExpandList, delPersonExpand } from '@/api/worship/retiredSoldier';
import lifeSituationDialog from './dialog/lifeSituationDialog.vue';
import selfInfoDialog from './dialog/selfInfoDialog.vue';
import volunteerServiceDialog from './dialog/volunteerServiceDialog.vue';
import {
  listPartyActivities,
  getPartyActivities,
  delPartyActivities,
  addPartyActivities,
  updatePartyActivities,
} from '@/api/worship/partyActivities';

export default {
  props: {},
  components: {
    peopleTable,
    peopleTitle,
    lifeSituationDialog,
    selfInfoDialog,
    volunteerServiceDialog,
  },
  data() {
    return {
      lifeSituation: [
        {
          name: '所在党支部',
          value: '',
          type: 'text',
        },
        {
          name: '入党时间',
          value: '',
          type: 'text',
        },
        {
          name: '是否按时缴纳党费',
          value: '',
          type: 'text',
        },
        {
          name: '是否担任党组织职务',
          value: '',
          type: 'text',
        },
        {
          name: '是否脱离组织',
          value: '',
          type: 'text',
        },
        {
          name: '上年度参加组织活动次数',
          value: '',
          type: 'text',
        },
      ],
      selfInfo: [
        {
          name: '职务',
          value: '',
          type: 'text',
        },
        {
          name: '社会职务',
          value: '',
          type: 'text',
        },
        {
          name: '首次任职时间',
          value: '',
          type: 'text',
        },
        {
          name: '本届任期',
          value: '',
          type: 'text',
        },
        {
          name: '离任时间',
          value: '',
          type: 'text',
        },
        {
          name: '是否兼任乡镇干部',
          value: '',
          type: 'text',
        },
        {
          name: '是否兼任退役军人服务站长',
          value: '',
          type: 'text',
        },
        {
          name: '有无村干部经历',
          value: '',
          type: 'text',
        },
        {
          name: '年限',
          value: '',
          type: 'text',
        },
        {
          name: '任期内受表彰情况',
          value: '',
          type: 'text',
        },
        {
          name: '岗位年收入',
          value: '',
          type: 'text',
        },
        {
          name: '优势特长',
          value: '',
          type: 'text',
        },
        {
          name: '其他优势特长说明',
          value: '',
          type: 'text',
        },
      ],
      jobSituation: [
        {
          name: '名称',
          value: '',
          type: 'text',
        },
        {
          name: '人口数量',
          value: '',
          type: 'text',
        },
        {
          name: '村集体经济年收入（万元）',
          value: '',
          type: 'text',
        },
        {
          name: '区域面积（平方公里）',
          value: '',
          type: 'text',
        },
        {
          name: '“两委”成员总人数',
          value: '',
          type: 'text',
        },
        {
          name: '特色产业',
          value: '',
          type: 'text',
        },
        {
          name: '其他特色产业说明',
          value: '',
          type: 'text',
        },
        {
          name: '受表彰级别',
          value: '',
          type: 'text',
        },
        {
          name: '表彰事项',
          value: '',
          type: 'text',
        },
        {
          name: '其他表彰事项说明',
          value: '',
          type: 'text',
        },
        {
          name: '年度工作满意度评价',
          value: '',
          type: 'text',
        },
      ],
      volunteerService: [],
      volunteerServiceProps: [
        {
          prop: 'volunteerServiceSituation',
          label: '所在志愿服务组织',
        },
        {
          prop: 'mainServiceItems',
          label: '主要服务项目',
        },
        {
          prop: 'volunteerActivities',
          label: '何时参加志愿服务活动',
        },
        {
          prop: 'durationOfParticipation',
          label: '累计参加志愿服务时数',
        },
        {
          prop: 'organizationalUnit',
          label: '组织单位',
        },
        {
          label: '操作',
          prop: 'post',
        },
      ],
      joinPartyActivities: [],
      joinPartyActivitiesProps: [
        {
          prop: 'divisionName',
          label: '行政区划',
        },
        {
          prop: 'activityTitle',
          label: '活动标题',
        },

        {
          prop: 'numOfParticipants',
          label: '参与人数',
        },
        {
          prop: 'activityTime',
          label: '活动日期',
        },
      ],
      getId: '',
      title: '',
      itemId: {
        lifeSituationId: '',
        selfInfoId: '',
        jobSituationId: '',
        volunteerServiceId: '',
        joinPartyActivitiesId: '',
      },
      lifeSituationOpen: false,
      selfInfoOpen: false,
      volunteerServiceOpen: false,
    };
  },
  computed: {},
  watch: {},
  created() {
    this.getList();
    this.getData();
  },
  mounted() {},
  methods: {
    getList() {
      personExpandPersonExpandList({
        expandParentType: 'B',
        personId: this.$route.params.id,
      }).then((response) => {
        const data = response.rows.map((item) => {
          item.expandContent = JSON.parse(item.expandContent);
          return item;
        });
        console.log('personExpandPersonExpandList', data);
        //基础身份信息
        const lifeSituationData = data.find((item) => item.expandChildType === 'B1');
        if (lifeSituationData) {
          this.itemId.lifeSituationId = lifeSituationData.id;
          this.lifeSituation = [
            {
              name: '所在党支部',
              value: lifeSituationData.expandContent.partyBranch,
              type: 'text',
            },
            {
              name: '入党时间',
              value: lifeSituationData.expandContent.partyJoiningTime,
              type: 'text',
            },
            {
              name: '是否按时缴纳党费',
              value: lifeSituationData.expandContent.payPartyFeesOnTime,
              type: 'text',
            },
            {
              name: '是否担任党组织职务',
              value: lifeSituationData.expandContent.holdPositionInPartyOrg,
              type: 'text',
            },
            {
              name: '是否脱离组织',
              value: lifeSituationData.expandContent.whetherLeaveTheOrg,
              type: 'text',
            },
            {
              name: '上年度参加组织活动次数',
              value: lifeSituationData.expandContent.lastYearNumPartOrgActivities,
              type: 'text',
            },
          ];
        }
        //退役军人村、社区“两委”成员（兵支书）基本情况
        //本人情况
        const selfInfoData = data.find((item) => item.expandChildType === 'B2');
        if (selfInfoData) {
          this.itemId.selfInfoId = selfInfoData.id;
          this.selfInfo = [
            {
              name: '职务',
              value: selfInfoData.expandContent.post,
              type: 'text',
            },
            {
              name: '社会职务',
              value: selfInfoData.expandContent.socialPosition,
              type: 'text',
            },
            {
              name: '首次任职时间',
              value: selfInfoData.expandContent.firstEmploymentTime,
              type: 'text',
            },
            {
              name: '本届任期',
              value: selfInfoData.expandContent.currentTerm.join('-'),
              type: 'text',
            },
            {
              name: '离任时间',
              value: selfInfoData.expandContent.departureTime,
              type: 'text',
            },
            {
              name: '是否兼任乡镇干部',
              value: selfInfoData.expandContent.whetherConcurrentlyServeXz,
              type: 'text',
            },
            {
              name: '是否兼任退役军人服务站长',
              value: selfInfoData.expandContent.whetherConcurrentlyServeTy,
              type: 'text',
            },
            {
              name: '有无村干部经历',
              value: selfInfoData.expandContent.expVillageCadres,
              type: 'text',
            },
            {
              name: '年限',
              value: selfInfoData.expandContent.age,
              type: 'text',
            },
            {
              name: '任期内受表彰情况',
              value: selfInfoData.expandContent.recognitionStatus,
              type: 'text',
            },
            {
              name: '岗位年收入',
              value: selfInfoData.expandContent.annualIncome,
              type: 'text',
            },
            {
              name: '优势特长',
              value: selfInfoData.expandContent.specialties,
              type: 'text',
            },
            {
              name: '其他优势特长说明',
              value: selfInfoData.expandContent.otherStrengths,
              type: 'text',
            },
          ];
        }
        //任职村（社区）情况
        const jobSituationData = data.find((item) => item.expandChildType === 'B2');
        if (jobSituationData) {
          this.jobSituation = [
            {
              name: '名称',
              value: jobSituationData.expandContent.streetName,
              type: 'text',
            },
            {
              name: '人口数量',
              value: jobSituationData.expandContent.personNum,
              type: 'text',
            },
            {
              name: '村集体经济年收入（万元）',
              value: jobSituationData.expandContent.collectiveAnnualIncome,
              type: 'text',
            },
            {
              name: '区域面积（平方公里）',
              value: jobSituationData.expandContent.area,
              type: 'text',
            },
            {
              name: '“两委”成员总人数',
              value: jobSituationData.expandContent.totalNumberOfMembers,
              type: 'text',
            },
            {
              name: '特色产业',
              value: jobSituationData.expandContent.industry,
              type: 'text',
            },
            {
              name: '其他特色产业说明',
              value: jobSituationData.expandContent.otherIndustry,
              type: 'text',
            },
            {
              name: '受表彰级别',
              value: jobSituationData.expandContent.commendationLevel,
              type: 'text',
            },
            {
              name: '表彰事项',
              value: jobSituationData.expandContent.commendationMatters,
              type: 'text',
            },
            {
              name: '其他表彰事项说明',
              value: jobSituationData.expandContent.otherCommendationMatters,
              type: 'text',
            },
            {
              name: '年度工作满意度评价',
              value: jobSituationData.expandContent.jobSatisfactionEvaluation,
              type: 'text',
            },
          ];
        }
        //志愿服务情况
        const volunteerServiceData = data.filter((item) => item.expandChildType === 'B3');
        console.log("🚀 ~ getList ~ volunteerServiceData:", volunteerServiceData)
        if (volunteerServiceData) {
          this.volunteerService = volunteerServiceData.map((item) => {
            return {
              ...item.expandContent,
              id: item.id,
              personId: item.personId,
            };
          });
        }
        // //参加党员活动
        // const joinPartyActivities = data.filter((item) => item.expandChildType === 'B4');
        // if (joinPartyActivities) {
        //   this.joinPartyActivities = joinPartyActivities.map((item) => item.expandContent);
        // }
      });
    },

    getData() {
      listPartyActivities({
        participantsPersonId: this.$route.params.id,
        pageNum: 1,
        pageSize: 9999,
        activityType: 3,
      }).then((response) => {
        this.joinPartyActivities = response.rows;
      });
    },

    openDialog(type, id = '', title = '') {
      this[type] = true;
      this.getId = id;
      this.title = title;
    },
    delVolunteer(row) {
      console.log(row);
      delPersonExpand(row.id).then((response) => {
        this.$modal.msgSuccess('删除成功');
        this.getList();
      });
    },
  },
};
</script>

<style scoped lang="scss">
.main {
  box-sizing: border-box;
  height: 80vh;
  overflow: scroll;

  .user-info {
    margin: 10px 0 0 0;
    padding: 10px;
    box-sizing: border-box;
    background: #fff;
    .header {
      display: flex;
      justify-content: space-between;
    }
    .header-title {
      margin: 10px 0 0 0;
    }
  }
}
/* 去除滚动条 */
::-webkit-scrollbar {
  display: none;
}
</style>
