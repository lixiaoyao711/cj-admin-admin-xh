<template>
  <div class="main">
    <div class="user-info">
      <div class="header">
        <peopleTitle>服役情况</peopleTitle>

        <el-button @click="openDialog('serviceStatusOpen')" size="mini">编 辑</el-button>
      </div>
      <peopleTable :tableData="serviceStatus" :count="3" />
    </div>
    <div class="user-info">
      <div class="header">
        <peopleTitle>职级情况</peopleTitle>

        <el-button @click="openDialog('jobGradeStatusOpen')" size="mini">编 辑</el-button>
      </div>
      <peopleTable :tableData="jobGradeStatus" :count="3" />
    </div>

    <div class="user-info">
      <div class="header">
        <peopleTitle>奖惩情况</peopleTitle>

        <el-button @click="openDialog('honorPenaltyOpen')" size="mini">编 辑</el-button>
      </div>
      <peopleTable :tableData="honorPenalty" :count="2" />
    </div>
    <div class="user-info">
      <div class="header">
        <peopleTitle>特殊地区服役情况</peopleTitle>
        <el-button @click="openDialog('specialCaseOpen')" size="mini">编 辑</el-button>
      </div>
      <peopleTable :tableData="specialCase" :count="3" />
    </div>
    <div class="user-info">
      <div class="header">
        <peopleTitle>附件信息</peopleTitle>

        <el-button @click="openDialog('fileListOpen')" size="mini">编 辑</el-button>
      </div>
      <peopleTable :tableData="fileList" :count="3" />
    </div>
    <serviceStatusDialog
      v-if="serviceStatusOpen"
      :propsId="itemId.serviceStatusId"
      @success="getList"
      @close="serviceStatusOpen = false"
    />
    <jobGradeStatusDialog
      v-if="jobGradeStatusOpen"
      :propsId="itemId.jobGradeStatusId"
      @success="getList"
      @close="jobGradeStatusOpen = false"
    />
    <honorPenaltyDialog
      v-if="honorPenaltyOpen"
      :propsId="itemId.honorPenaltyId"
      @success="getList"
      @close="honorPenaltyOpen = false"
    />
    <specialCaseDialog
      v-if="specialCaseOpen"
      :propsId="itemId.specialCaseId"
      @success="getList"
      @close="specialCaseOpen = false"
    />
    <fileListDialog :propsId="itemId.fileListId" v-if="fileListOpen" @success="getList" @close="fileListOpen = false" />
  </div>
</template>

<script>
import peopleTable from '@/views/worship/peopleInfo/common/peopleTable/index';
import peopleTitle from '@/views/worship/peopleInfo/common/title/index';
import { personExpandPersonExpandList } from '@/api/worship/retiredSoldier';
import serviceStatusDialog from './dialog/serviceStatusDialog.vue';
import jobGradeStatusDialog from './dialog/jobGradeStatusDialog.vue';
import honorPenaltyDialog from './dialog/honorPenaltyDialog.vue';
import specialCaseDialog from './dialog/specialCaseDialog.vue';
import fileListDialog from './dialog/fileListDialog.vue';

export default {
  props: {},
  components: {
    peopleTable,
    peopleTitle,
    serviceStatusDialog,
    jobGradeStatusDialog,
    honorPenaltyDialog,
    specialCaseDialog,
    fileListDialog,
  },
  data() {
    return {
      serviceStatus: [
        {
          name: '入伍时间',
          value: '',
          type: 'text',
        },
        {
          name: '入伍时户籍',
          value: '',
          type: 'text',
        },
        {
          name: '入伍地',
          value: '',
          type: 'text',
        },
        {
          name: '部队代号',
          value: '',
          type: 'text',
        },
        {
          name: '大单位',
          value: '',
          type: 'text',
        },
        {
          name: '二次入伍情况',
          value: '',
          type: 'text',
        },
        {
          name: '军人类别',
          value: '',
          type: 'text',
        },
        {
          name: '军衔',
          value: '',
          type: 'text',
        },
      ],
      jobGradeStatus: [
        {
          name: '干部类别',
          value: '',
          type: 'text',
        },
        {
          name: '',
          value: '',
          type: 'text',
        },
        {
          name: '',
          value: '',
          type: 'text',
        },
        {
          name: '军官类别',
          value: '',
          type: 'text',
        },
        {
          name: '行政军官原最高职级',
          value: '',
          type: 'text',
        },
        {
          name: '技术军官原最高职级',
          value: '',
          type: 'text',
        },
        {
          name: '文职类别',
          value: '',
          type: 'text',
        },
        {
          name: '管理文职原最高职级',
          value: '',
          type: 'text',
        },
        {
          name: '技术文职原最高职级',
          value: '',
          type: 'text',
        },
      ],
      honorPenalty: [
        {
          name: '立功受奖奖项',
          value: '',
          type: 'text',
        },
        {
          name: '立功受奖奖项说明',
          value: '',
          type: 'text',
        },
        {
          name: '处分',
          value: '',
          type: 'text',
        },
        {
          name: '惩罚处分说明',
          value: '',
          type: 'text',
        },
      ],
      specialCase: [
        {
          name: '特殊地区性质',
          value: '',
          type: 'text',
        },
        {
          name: '服役时长（月）',
          value: '',
          type: 'text',
        },
        {
          name: '特殊岗位',
          value: '',
          type: 'text',
        },
      ],
      fileList: [
        {
          name: '入伍材料',
          value: '',
          type: 'text',
        },
        {
          name: '奖惩材料',
          value: '',
          type: 'text',
        },
      ],
      serviceStatusOpen: false,
      jobGradeStatusOpen: false,
      honorPenaltyOpen: false,
      specialCaseOpen: false,
      fileListOpen: false,
      title: '',
      itemId: {
        serviceStatusId: '',
        jobGradeStatusId: '',
        honorPenaltyId: '',
        specialCaseId: '',
        fileListId: '',
      },
    };
  },
  computed: {},
  watch: {},
  created() {
    this.getList();
  },
  mounted() {},
  methods: {
    getList() {
      personExpandPersonExpandList({
        expandParentType: 'C',
        personId: this.$route.params.id,
      }).then((response) => {
        const data = response.rows.map((item) => {
          item.expandContent = JSON.parse(item.expandContent);
          return item;
        });
        console.log('personExpandPersonExpandList', data);
        // 服役情况
        const serviceStatusData = data.find((item) => item.expandChildType === 'C1');
        if (serviceStatusData) {
          this.itemId.serviceStatusId = serviceStatusData.id;
          this.serviceStatus = [
            {
              name: '入伍时间',
              value: serviceStatusData.expandContent.dateOfEnlistment,
              type: 'text',
            },
            {
              name: '入伍时户籍',
              value: serviceStatusData.expandContent.rwRegisteredResidence,
              type: 'text',
            },
            {
              name: '入伍地',
              value: serviceStatusData.expandContent.conscriptionSite,
              type: 'text',
            },
            {
              name: '部队代号',
              value: serviceStatusData.expandContent.unitCode,
              type: 'text',
            },
            {
              name: '大单位',
              value: serviceStatusData.expandContent.largeUnits,
              type: 'text',
            },
            {
              name: '二次入伍情况',
              value: serviceStatusData.expandContent.secondEnlistment,
              type: 'text',
            },
            {
              name: '军人类别',
              value: serviceStatusData.expandContent.militaryCategory,
              type: 'text',
            },
            {
              name: '军衔',
              value: serviceStatusData.expandContent.militaryRank,
              type: 'text',
            },
          ];
        }
        //职级情况
        const jobGradeStatusData = data.find((item) => item.expandChildType === 'C2');
        if (jobGradeStatusData) {
          this.itemId.jobGradeStatusId = jobGradeStatusData.id;
          this.jobGradeStatus = [
            {
              name: '干部类别',
              value: jobGradeStatusData.expandContent.cadreCategory,
              type: 'text',
            },
            {
              name: '',
              value: '',
              type: 'text',
            },
            {
              name: '',
              value: '',
              type: 'text',
            },
            {
              name: '军官类别',
              value: jobGradeStatusData.expandContent.officerCategory,
              type: 'text',
            },
            {
              name: '行政军官原最高职级',
              value: jobGradeStatusData.expandContent.xzHighestRank,
              type: 'text',
            },
            {
              name: '技术军官原最高职级',
              value: jobGradeStatusData.expandContent.jsHighestRank,
              type: 'text',
            },
            {
              name: '文职类别',
              value: jobGradeStatusData.expandContent.civilianCategory,
              type: 'text',
            },
            {
              name: '管理文职原最高职级',
              value: jobGradeStatusData.expandContent.wzHighestRank,
              type: 'text',
            },
            {
              name: '技术文职原最高职级',
              value: jobGradeStatusData.expandContent.jsWzHighestRank,
              type: 'text',
            },
          ];
        }
        //奖惩情况
        const honorPenaltyData = data.find((item) => item.expandChildType === 'C3');
        if (honorPenaltyData) {
          this.itemId.honorPenaltyId = honorPenaltyData.id;
          this.honorPenalty = [
            {
              name: '立功受奖奖项',
              value: honorPenaltyData.expandContent.meritoriousDeedsAndAwards,
              type: 'text',
            },
            {
              name: '立功受奖奖项说明',
              value: honorPenaltyData.expandContent.awardDescription,
              type: 'text',
            },
            {
              name: '处分',
              value: honorPenaltyData.expandContent.punishment,
              type: 'text',
            },
            {
              name: '惩罚处分说明',
              value: honorPenaltyData.expandContent.punishmentMsg,
              type: 'text',
            },
          ];
        }
        //特殊地区服役情况
        const specialCaseData = data.find((item) => item.expandChildType === 'C4');
        if (specialCaseData) {
          this.itemId.specialCaseId = specialCaseData.id;
          this.specialCase = [
            {
              name: '特殊地区性质',
              value: specialCaseData.expandContent.specialRegionalNature,
              type: 'text',
            },
            {
              name: '服役时长（月）',
              value: specialCaseData.expandContent.serviceDuration,
              type: 'text',
            },
            {
              name: '特殊岗位',
              value: specialCaseData.expandContent.specialPositions,
              type: 'text',
            },
          ];
        }
        //附件信息
        const fileListData = data.find((item) => item.expandChildType === 'C5');
        if (fileListData) {
          this.itemId.fileListId = fileListData.id;
          this.fileList = [
            {
              name: '入伍材料',
              value: fileListData?.expandContent?.enlistmentMaterialsUrl?.split(',').length ? '查看' : '暂无附件',
              file: fileListData?.expandContent?.enlistmentMaterialsUrl?.split(','),
              type: 'file',
            },
            {
              name: '奖惩材料',
              value: fileListData?.expandContent?.rewardPunishmentUrl?.split(',').length ? '查看' : '暂无附件',
              file: fileListData?.expandContent?.rewardPunishmentUrl?.split(','),
              type: 'file',
            },
          ];
        }
      });
    },
    openDialog(type, id = '', title = '') {
      this[type] = true;
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
    .title {
      margin: 10px 0 0 0;
    }
  }
}
/* 去除滚动条 */
::-webkit-scrollbar {
  display: none;
}
</style>
