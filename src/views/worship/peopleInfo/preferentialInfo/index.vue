<template>
  <div class="main">
    <div class="user-info">
      <div class="header">
        <peopleTitle>抚恤优待情况</peopleTitle>
        <el-button @click="openDialog('preferentialTreatmentDialogOpen')" size="mini">编 辑</el-button>
      </div>
      <peopleTable :tableData="preferentialTreatment" :count="3" />
    </div>
    <div class="user-info">
      <div class="header">
        <peopleTitle>服役时残疾情况</peopleTitle>
        <el-button @click="openDialog('disabilityStatusDialogOpen')" size="mini">编 辑</el-button>
      </div>
      <peopleTable :tableData="disabilityStatus" :count="3" />
    </div>

    <div class="user-info">
      <div class="header">
        <peopleTitle>烈士遗属情况</peopleTitle>

        <el-button @click="openDialog('martyrFamilyDialogOpen')" size="mini">编 辑</el-button>
      </div>
      <peopleTable :tableData="martyrFamily" :count="3" />
    </div>
    <div class="user-info">
      <div class="header">
        <peopleTitle>因公牺牲军人遗属情況</peopleTitle>

        <el-button @click="openDialog('sacrificeForDutyDialogOpen')" size="mini">编 辑</el-button>
      </div>
      <peopleTable :tableData="sacrificeForDuty" :count="3" />
    </div>
    <div class="user-info">
      <div class="header">
        <peopleTitle>病故军人遗属情况</peopleTitle>

        <el-button @click="openDialog('deceasedVeteranDialogOpen')" size="mini">编 辑</el-button>
      </div>
      <peopleTable :tableData="deceasedVeteran" :count="3" />
    </div>
    <div class="user-info">
      <div class="header">
        <peopleTitle>附件信息</peopleTitle>

        <el-button @click="openDialog('fileListDialogOpen')" size="mini">编 辑</el-button>
      </div>
      <peopleTable :tableData="fileList" :count="2" />
    </div>
    <preferentialTreatmentDialog
      v-if="preferentialTreatmentDialogOpen"
      :propsId="itemId.preferentialTreatmentId"
      :title="'抚恤优待情况'"
      @close="preferentialTreatmentDialogOpen = false"
      @success="getList"
    />
    <disabilityStatusDialog
      v-if="disabilityStatusDialogOpen"
      :propsId="itemId.disabilityStatusId"
      :title="'服役时残疾情况'"
      @close="disabilityStatusDialogOpen = false"
      @success="getList"
    />
    <martyrFamilyDialog
      v-if="martyrFamilyDialogOpen"
      :propsId="itemId.martyrFamilyId"
      :title="'烈士遗属情况'"
      @close="martyrFamilyDialogOpen = false"
      @success="getList"
    />
    <sacrificeForDutyDialog
      v-if="sacrificeForDutyDialogOpen"
      :propsId="itemId.sacrificeForDutyId"
      :title="'因公牺牲军人遗属情況'"
      @close="sacrificeForDutyDialogOpen = false"
      @success="getList"
    />
    <deceasedVeteranDialog
      v-if="deceasedVeteranDialogOpen"
      :propsId="itemId.deceasedVeteranId"
      :title="'病故军人遗属情况'"
      @close="deceasedVeteranDialogOpen = false"
      @success="getList"
    />
    <fileListDialog
      v-if="fileListDialogOpen"
      :propsId="itemId.fileListId"
      :title="'附件信息'"
      @close="fileListDialogOpen = false"
      @success="getList"
    />
  </div>
</template>

<script>
import peopleTable from '@/views/worship/peopleInfo/common/peopleTable/index';
import peopleTitle from '@/views/worship/peopleInfo/common/title/index';
import { personExpandPersonExpandList } from '@/api/worship/retiredSoldier';
import preferentialTreatmentDialog from './dialog/preferentialTreatmentDialog';
import disabilityStatusDialog from './dialog/disabilityStatusDialog';
import martyrFamilyDialog from './dialog/martyrFamilyDialog';
import sacrificeForDutyDialog from './dialog/sacrificeForDutyDialog';
import deceasedVeteranDialog from './dialog/deceasedVeteranDialog';
import fileListDialog from './dialog/fileListDialog';
import { String2Array, Array2String } from '@/utils/toolFn.js';

export default {
  props: {},
  components: {
    peopleTable,
    peopleTitle,
    preferentialTreatmentDialog,
    disabilityStatusDialog,
    martyrFamilyDialog,
    sacrificeForDutyDialog,
    deceasedVeteranDialog,
    fileListDialog,
  },
  data() {
    return {
      preferentialTreatmentDialogOpen: false,
      disabilityStatusDialogOpen: false,
      martyrFamilyDialogOpen: false,
      sacrificeForDutyDialogOpen: false,
      deceasedVeteranDialogOpen: false,
      fileListDialogOpen: false,
      itemId: {
        preferentialTreatmentId: '',
        disabilityStatusId: '',
        martyrFamilyId: '',
        sacrificeForDutyId: '',
        deceasedVeteranId: '',
        fileListId: '',
      },
      preferentialTreatment: [
        {
          name: '人员类别',
          value: '',
          type: 'text',
        },
        {
          name: '享受优扶待遇情况',
          value: '',
          type: 'text',
        },
        {
          name: '供养情况',
          value: '',
          type: 'text',
        },
        {
          name: '孤老情况',
          value: '',
          type: 'text',
        },
        {
          name: '孤儿情况',
          value: '',
          type: 'text',
        },
      ],
      disabilityStatus: [
        {
          name: '劳动能力',
          value: '',
          type: 'text',
        },
        {
          name: '生活能力',
          value: '',
          type: 'text',
        },
        {
          name: '是否因患精神病评残',
          value: '',
          type: 'text',
        },
        {
          name: '残疾性质',
          value: '',
          type: 'text',
        },
        {
          name: '残疾等级',
          value: '',
          type: 'text',
        },
        {
          name: '残疾证件号',

          value: '',
          type: 'text',
        },
        {
          name: '评残时间',
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
      martyrFamily: [
        {
          name: '与烈士关系',
          value: '',
          type: 'text',
        },
        {
          name: '是否是持证人',
          value: '',
          type: 'text',
        },
        {
          name: '证明书编号',
          value: '',
          type: 'text',
        },
        {
          name: '烈士姓名',
          value: '',
          type: 'text',
        },
        {
          name: '性别',
          value: '',
          type: 'text',
        },
        {
          name: '出生日期',
          value: '',
          type: 'text',
        },
        {
          name: '入伍日期',
          value: '',
          type: 'text',
        },
        {
          name: '生前所在单位',
          value: '',
          type: 'text',
        },
        {
          name: '牺牲日期',
          value: '',
          type: 'text',
        },
        {
          name: '牺牲原因',
          value: '',
          type: 'text',
        },
        {
          name: '评定时间',
          value: '',
          type: 'text',
        },
        {
          name: '评定烈士单位',
          value: '',
          type: 'text',
        },
        {
          name: '烈士安葬情况',
          value: '',
          type: 'text',
        },
        {
          name: '烈士安葬地',
          value: '',
          type: 'text',
        },
      ],
      sacrificeForDuty: [
        {
          name: '与因公牺牲军人关系',
          value: '',
          type: 'text',
        },
        {
          name: '是否是持证人',
          value: '',
          type: 'text',
        },
        {
          name: '证明书编号',
          value: '',
          type: 'text',
        },
        {
          name: '因公牺牲军人姓名',
          value: '',
          type: 'text',
        },
        {
          name: '性别',
          value: '',
          type: 'text',
        },
        {
          name: '出生日期',
          value: '',
          type: 'text',
        },
        {
          name: '入伍日期',
          value: '',
          type: 'text',
        },
        {
          name: '生前所在单位',
          value: '',
          type: 'text',
        },
        {
          name: '牺牲日期',
          value: '',
          type: 'text',
        },
        {
          name: '牺牲原因',
          value: '',
          type: 'text',
        },
        {
          name: '认定时间',
          value: '',
          type: 'text',
        },
      ],
      deceasedVeteran: [
        {
          name: '与病故军人关系',
          value: '',
          type: 'text',
        },
        {
          name: '是否是持证人',
          value: '',
          type: 'text',
        },
        {
          name: '证明书编号',
          value: '',
          type: 'text',
        },
        {
          name: '病故军人姓名',
          value: '',
          type: 'text',
        },
        {
          name: '性别',
          value: '',
          type: 'text',
        },
        {
          name: '出生日期',
          value: '',
          type: 'text',
        },
        {
          name: '入伍日期',
          value: '',
          type: 'text',
        },
        {
          name: '生前所在单位',
          value: '',
          type: 'text',
        },
        {
          name: '牺牲日期',
          value: '',
          type: 'text',
        },
        {
          name: '牺牲原因',
          value: '',
          type: 'text',
        },
        {
          name: '认定时间',
          value: '',
          type: 'text',
        },
      ],
      fileList: [
        {
          name: '残疾军人证',
          value: '',
          type: 'file',
        },
        {
          name: '伤残民兵民工证',
          value: '',
          type: 'file',
        },
        {
          name: '因战因公伤残人员证',
          value: '',
          type: 'file',
        },
        {
          name: '烈士证明书',
          value: '',
          type: 'file',
        },
      ],
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
        expandParentType: 'G',
        personId: this.$route.params.id,
      }).then((response) => {
        const data = response.rows.map((item) => {
          item.expandContent = JSON.parse(item.expandContent);
          return item;
        });
        console.log('personExpandPersonExpandList', data);
        // 抚恤优待情况
        const preferentialTreatmentData = data.find((item) => item.expandChildType === 'G1');
        if (preferentialTreatmentData) {
          this.itemId.preferentialTreatmentId = preferentialTreatmentData.id;
          this.preferentialTreatment = [
            {
              name: '人员类别',
              value: String2Array(preferentialTreatmentData.expandContent.personnelCategory),
              type: 'tag',
            },
            {
              name: '享受优扶待遇情况',
              value: preferentialTreatmentData.expandContent.preferentialTreatment,
              type: 'tag',
            },
            {
              name: '供养情况',
              value: preferentialTreatmentData.expandContent.supportSituation,
              type: 'text',
            },
            {
              name: '供养单位',
              value: preferentialTreatmentData.expandContent.supportingUnit,
              type: 'text',
            },
            {
              name: '孤老情况',
              value: preferentialTreatmentData.expandContent.lonelyElderlySituation,
              type: 'text',
            },
            {
              name: '孤儿情况',
              value: preferentialTreatmentData.expandContent.orphan,
              type: 'text',
            },
          ];
        }
        // 服役时残疾情况
        const disabilityStatusData = data.find((item) => item.expandChildType === 'G2');
        if (disabilityStatusData) {
          this.itemId.disabilityStatusId = disabilityStatusData.id;
          this.disabilityStatus = [
            {
              name: '劳动能力',
              value: disabilityStatusData.expandContent.laborCapacity,
              type: 'text',
            },
            {
              name: '生活能力',
              value: disabilityStatusData.expandContent.livingAbility,
              type: 'text',
            },
            {
              name: '是否因患精神病评残',
              value: disabilityStatusData.expandContent.mentalIllness,
              type: 'text',
            },
            {
              name: '残疾性质',
              value: disabilityStatusData.expandContent.disabilityNature,
              type: 'text',
            },
            {
              name: '残疾等级',
              value: disabilityStatusData.expandContent.disabilityLevel,
              type: 'text',
            },
            {
              name: '残疾证件号',

              value: disabilityStatusData.expandContent.disabilityIdNumber,
              type: 'text',
            },
            {
              name: '评残时间',
              value: disabilityStatusData.expandContent.disabilityAssessmentTime,
              type: 'text',
            },
          ];
        }
        // 烈士遗属情况
        const martyrFamilyData = data.find((item) => item.expandChildType === 'G3');
        if (martyrFamilyData) {
          this.itemId.martyrFamilyId = martyrFamilyData.id;
          this.martyrFamily = [
            {
              name: '与烈士关系',
              value: martyrFamilyData.expandContent.martyrsRelations,
              type: 'text',
            },
            {
              name: '是否是持证人',
              value: martyrFamilyData.expandContent.holder,
              type: 'text',
            },
            {
              name: '证明书编号',
              value: martyrFamilyData.expandContent.certificateNumber,
              type: 'text',
            },
            {
              name: '烈士姓名',
              value: martyrFamilyData.expandContent.martyrsNames,
              type: 'text',
            },
            {
              name: '性别',
              value: martyrFamilyData.expandContent.sex,
              type: 'text',
            },
            {
              name: '出生日期',
              value: martyrFamilyData.expandContent.birthday,
              type: 'text',
            },
            {
              name: '入伍日期',
              value: martyrFamilyData.expandContent.dateOfEnlistment,
              type: 'text',
            },
            {
              name: '生前所在单位',
              value: martyrFamilyData.expandContent.livingUnit,
              type: 'text',
            },
            {
              name: '牺牲日期',
              value: martyrFamilyData.expandContent.sacrificialDate,
              type: 'text',
            },
            {
              name: '牺牲原因',
              value: martyrFamilyData.expandContent.sacrificialReasons,
              type: 'text',
            },
            {
              name: '评定时间',
              value: martyrFamilyData.expandContent.evaluationTime,
              type: 'text',
            },
            {
              name: '评定烈士单位',
              value: martyrFamilyData.expandContent.assessingMartyrsUnits,
              type: 'text',
            },
            {
              name: '烈士安葬情况',
              value: martyrFamilyData.expandContent.theBurialOfMartyrs,
              type: 'text',
            },
            {
              name: '烈士安葬地',
              value: martyrFamilyData.expandContent.martyrsBurialGround,
              type: 'text',
            },
          ];
        }
        // 因公牺牲军人遗属情況
        const sacrificeForDutyData = data.find((item) => item.expandChildType === 'G4');
        if (sacrificeForDutyData) {
          this.itemId.sacrificeForDutyId = sacrificeForDutyData.id;
          this.sacrificeForDuty = [
            {
              name: '与因公牺牲军人关系',
              value: sacrificeForDutyData.expandContent.relationship,
              type: 'text',
            },
            {
              name: '是否是持证人',
              value: sacrificeForDutyData.expandContent.holder,
              type: 'text',
            },
            {
              name: '证明书编号',
              value: sacrificeForDutyData.expandContent.certificateNumber,
              type: 'text',
            },
            {
              name: '因公牺牲军人姓名',
              value: sacrificeForDutyData.expandContent.nameSoldier,
              type: 'text',
            },
            {
              name: '性别',
              value: sacrificeForDutyData.expandContent.sex,
              type: 'text',
            },
            {
              name: '出生日期',
              value: sacrificeForDutyData.expandContent.birthday,
              type: 'text',
            },
            {
              name: '入伍日期',
              value: sacrificeForDutyData.expandContent.dateEnlistment,
              type: 'text',
            },
            {
              name: '生前所在单位',
              value: sacrificeForDutyData.expandContent.livingUnit,
              type: 'text',
            },
            {
              name: '牺牲日期',
              value: sacrificeForDutyData.expandContent.sacrificialDate,
              type: 'text',
            },
            {
              name: '牺牲原因',
              value: sacrificeForDutyData.expandContent.sacrificialReasons,
              type: 'text',
            },
            {
              name: '认定时间',
              value: sacrificeForDutyData.expandContent.recognitionTime,
              type: 'text',
            },
          ];
        }
        // 病故军人遗属情况
        const deceasedVeteranData = data.find((item) => item.expandChildType === 'G5');
        if (deceasedVeteranData) {
          this.itemId.deceasedVeteranId = deceasedVeteranData.id;
          this.deceasedVeteran = [
            {
              name: '与病故军人关系',
              value: deceasedVeteranData.expandContent.relationship,
              type: 'text',
            },
            {
              name: '是否是持证人',
              value: deceasedVeteranData.expandContent.holder,
              type: 'text',
            },
            {
              name: '证明书编号',
              value: deceasedVeteranData.expandContent.certificateNumber,
              type: 'text',
            },
            {
              name: '病故军人姓名',
              value: deceasedVeteranData.expandContent.nameSickSoldier,
              type: 'text',
            },
            {
              name: '性别',
              value: deceasedVeteranData.expandContent.sex,
              type: 'text',
            },
            {
              name: '出生日期',
              value: deceasedVeteranData.expandContent.birthday,
              type: 'text',
            },
            {
              name: '入伍日期',
              value: deceasedVeteranData.expandContent.dateEnlistment,
              type: 'text',
            },
            {
              name: '生前所在单位',
              value: deceasedVeteranData.expandContent.livingUnit,
              type: 'text',
            },
            {
              name: '牺牲日期',
              value: deceasedVeteranData.expandContent.sacrificialDate,
              type: 'text',
            },
            {
              name: '牺牲原因',
              value: deceasedVeteranData.expandContent.sacrificialReasons,
              type: 'text',
            },
            {
              name: '认定时间',
              value: deceasedVeteranData.expandContent.recognitionTime,
              type: 'text',
            },
          ];
        }
        // 附件信息
        const fileListData = data.find((item) => item.expandChildType === 'G6');
        if (fileListData) {
          this.itemId.fileListId = fileListData.id;
          this.fileList = [
            {
              name: '残疾军人证',
              value: fileListData?.expandContent?.disabledSoldierUrl?.split(',').length ? '查看' : '暂无附件',
              file: fileListData?.expandContent?.disabledSoldierUrl?.split(','),

              type: 'file',
            },
            {
              name: '伤残民兵民工证',
              value: fileListData?.expandContent?.disabledMilitiaUrl?.split(',').length ? '查看' : '暂无附件',
              file: fileListData?.expandContent?.disabledMilitiaUrl?.split(','),

              type: 'file',
            },
            {
              name: '因战因公伤残人员证',
              value: fileListData?.expandContent?.disabledPersonDueWarUrl?.split(',').length ? '查看' : '暂无附件',
              file: fileListData?.expandContent?.disabledPersonDueWarUrl?.split(','),

              type: 'file',
            },
            {
              name: '烈士证明书',
              value: fileListData?.expandContent?.martyrsCertificateUrl?.split(',').length ? '查看' : '暂无附件',
              file: fileListData?.expandContent?.martyrsCertificateUrl?.split(','),

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
