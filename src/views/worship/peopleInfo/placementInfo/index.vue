<template>
  <div class="main">
    <div class="user-info">
      <div class="header">
        <peopleTitle>退役信息</peopleTitle>
        <el-button @click="openDialog('retireDateDialogOpen')" size="mini">编 辑</el-button>
      </div>
      <peopleTable :tableData="retireDate" :count="3" />
    </div>
    <div class="user-info">
      <div class="header">
        <peopleTitle>人员类别（按安置方式区分）</peopleTitle>
        <el-button @click="openDialog('peopleTypeOpen')" size="mini">编 辑</el-button>
      </div>
      <peopleTable :tableData="peopleType" :count="2" />
    </div>
    <div class="user-info">
      <div class="header">
        <peopleTitle>领取退役金情况</peopleTitle>

        <el-button @click="openDialog('retirementFundAmountOpen')" size="mini">编 辑</el-button>
      </div>
      <peopleTable :tableData="retirementFundAmount" :count="3" />
    </div>
    <div class="user-info">
      <div class="header">
        <peopleTitle>退役安置情况</peopleTitle>
        <el-button @click="openDialog('placementStatusReportOpen')" size="mini">编 辑</el-button>
      </div>
      <peopleTable :tableData="placementStatusReport" :count="3" />
    </div>
    <div class="user-info">
      <div class="header">
        <peopleTitle>军休安置情况</peopleTitle>

        <el-button @click="openDialog('militaryRetirementDateOpen')" size="mini">编 辑</el-button>
      </div>
      <peopleTable :tableData="militaryRetirementDate" :count="3" />
    </div>
    <div class="user-info">
      <div class="header">
        <peopleTitle>附件信息</peopleTitle>
        <el-button @click="openDialog('fileListOpen')" size="mini">编 辑</el-button>
      </div>
      <peopleTable :tableData="fileList" :count="2" />
    </div>
    <retireDateDialog
      v-if="retireDateDialogOpen"
      :propsId="itemId.retireDateId"
      :title="'退役信息'"
      @success="getList"
      @close="retireDateDialogOpen = false"
    />
    <peopleTypeDialog
      v-if="peopleTypeOpen"
      :propsId="itemId.peopleTypeId"
      :title="'人员类别（按安置方式区分）'"
      @success="getList"
      @close="peopleTypeOpen = false"
    />
    <retirementFundAmountDialog
      v-if="retirementFundAmountOpen"
      :propsId="itemId.retirementFundAmountId"
      :title="'领取退役金情况'"
      @success="getList"
      @close="retirementFundAmountOpen = false"
    />
    <placementStatusReportDialog
      v-if="placementStatusReportOpen"
      :propsId="itemId.placementStatusReportId"
      :title="'退役安置情况'"
      @success="getList"
      @close="placementStatusReportOpen = false"
    />
    <militaryRetirementDateDialog
      v-if="militaryRetirementDateOpen"
      :propsId="itemId.militaryRetirementDateId"
      :title="'军休安置情况'"
      @success="getList"
      @close="militaryRetirementDateOpen = false"
    />
    <fileListDialog
      v-if="fileListOpen"
      :propsId="itemId.fileListId"
      :title="'附件信息'"
      @success="getList"
      @close="fileListOpen = false"
    />
  </div>
</template>

<script>
import peopleTable from '@/views/worship/peopleInfo/common/peopleTable/index';
import peopleTitle from '@/views/worship/peopleInfo/common/title/index';
import { personExpandPersonExpandList } from '@/api/worship/retiredSoldier';
import retireDateDialog from './dialog/retireDateDialog.vue';
import peopleTypeDialog from './dialog/peopleTypeDialog.vue';
import retirementFundAmountDialog from './dialog/retirementFundAmountDialog.vue';
import placementStatusReportDialog from './dialog/placementStatusReportDialog.vue';
import militaryRetirementDateDialog from './dialog/militaryRetirementDateDialog.vue';
import fileListDialog from './dialog/fileListDialog.vue';

export default {
  props: {},
  components: {
    peopleTable,
    peopleTitle,
    retireDateDialog,
    peopleTypeDialog,
    retirementFundAmountDialog,
    placementStatusReportDialog,
    militaryRetirementDateDialog,
    fileListDialog,
  },
  data() {
    return {
      retireDateDialogOpen: false,
      peopleTypeOpen: false,
      retirementFundAmountOpen: false,
      placementStatusReportOpen: false,
      militaryRetirementDateOpen: false,
      fileListOpen: false,
      retireDate: [
        {
          name: '退役时间（转业/复原/离退休时间）',
          value: '',
          type: 'text',
        },
        {
          name: '军龄',
          value: '',
          type: 'text',
        },
        {
          name: '预备役情况',
          value: '',
          type: 'text',
        },
        {
          name: '退役证件类型',
          value: '',
          type: 'text',
        },
        {
          name: '退役证件号',
          value: '',
          type: 'text',
        },
      ],
      peopleType: [
        {
          name: '人员类别',
          value: '',
          type: 'text',
        },
      ],
      retirementFundAmount: [
        {
          name: '是否领取一次性退役金',
          value: '',
          type: 'text',
        },
        {
          name: '领取一次性退役金金额（元）',
          value: '',
          type: 'text',
        },
        {
          name: '领取时间',
          value: '',
          type: 'text',
        },
        {
          name: '逐月领取退役金金额（元）',
          value: '',
          type: 'text',
        },
      ],
      placementStatusReport: [
        {
          name: '安置/报道时间',
          value: '',
          type: 'text',
        },
        {
          name: '安置地',
          value: '',
          type: 'text',
        },
        {
          name: '安置单位名称',
          value: '',
          type: 'text',
        },
        {
          name: '安置单位性质',
          value: '',
          type: 'text',
        },
        {
          name: '安置职务级别',
          value: '',
          type: 'text',
        },
      ],
      militaryRetirementDate: [
        {
          name: '军休类别',
          value: '',
          type: 'text',
        },
        {
          name: '安置时间',
          value: '',
          type: 'text',
        },
        {
          name: '安置地',
          value: '',
          type: 'text',
        },
        {
          name: '安置管理单位名称',
          value: '',
          type: 'text',
        },
        {
          name: '安置管理单位性质',
          value: '',
          type: 'text',
        },
        {
          name: '服务管理机构名称',
          value: '',
          type: 'text',
        },
      ],
      fileList: [
        {
          name: '退役正面材料',
          value: '',
          type: 'text',
        },
      ],
      itemId: {
        retireDateId: '',
        peopleTypeId: '',
        retirementFundAmountId: '',
        placementStatusReportId: '',
        militaryRetirementDateId: '',
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
        expandParentType: 'D',
        personId: this.$route.params.id,
      }).then((response) => {
        const data = response.rows.map((item) => {
          item.expandContent = JSON.parse(item.expandContent);
          return item;
        });
        console.log('personExpandPersonExpandList', data);
        // 退役信息
        const retireDates = data.find((item) => item.expandChildType === 'D1');
        if (retireDates) {
          this.itemId.retireDateId = retireDates.id;
          this.retireDate = [
            {
              name: '退役时间（转业/复原/离退休时间）',
              value: retireDates.expandContent.retirementTime,
              type: 'text',
            },
            {
              name: '军龄',
              value: retireDates.expandContent.militarySeniority,
              type: 'text',
            },
            {
              name: '预备役情况',
              value: retireDates.expandContent.reserveSituation,
              type: 'text',
            },
            {
              name: '退役证件类型',
              value: retireDates.expandContent.retireCertificateType,
              type: 'text',
            },
            {
              name: '退役证件号',
              value: retireDates.expandContent.retireIdNumber,
              type: 'text',
            },
          ];
        }
        // 人员类别（按安置方式区分）
        const peopleTypeData = data.find((item) => item.expandChildType === 'D2');
        if (peopleTypeData) {
          this.itemId.peopleTypeId = peopleTypeData.id;
          this.peopleType = [
            {
              name: '人员类别',
              value: peopleTypeData.expandContent.personCategory,
              type: 'text',
            },
          ];
        }
        // 领取退役金情况
        const retirementFundAmountData = data.find((item) => item.expandChildType === 'D3');
        if (retirementFundAmountData) {
          this.itemId.retirementFundAmountId = retirementFundAmountData.id;
          this.retirementFundAmount = [
            {
              name: '是否领取一次性退役金',
              value: retirementFundAmountData.expandContent.whetherCollectOrNot,
              type: 'text',
            },
            {
              name: '领取一次性退役金金额（元）',
              value: retirementFundAmountData.expandContent.collectionMoney,
              type: 'text',
            },
            {
              name: '领取时间',
              value: retirementFundAmountData.expandContent.collectionTime,
              type: 'text',
            },
            {
              name: '逐月领取退役金金额（元）',
              value: retirementFundAmountData.expandContent.monthlyCollectionMoney,
              type: 'text',
            },
          ];
        }
        // 退役安置情况
        const placementStatusReportData = data.find((item) => item.expandChildType === 'D4');
        if (placementStatusReportData) {
          this.itemId.placementStatusReportId = placementStatusReportData.id;
          this.placementStatusReport = [
            {
              name: '安置/报道时间',
              value: placementStatusReportData.expandContent.reportingTime,
              type: 'text',
            },
            {
              name: '安置地',
              value: placementStatusReportData.expandContent.placementSite,
              type: 'text',
            },
            {
              name: '安置单位名称',
              value: placementStatusReportData.expandContent.placementOrgName,
              type: 'text',
            },
            {
              name: '安置单位性质',
              value: placementStatusReportData.expandContent.placementNature,
              type: 'text',
            },
            {
              name: '安置职务级别',
              value: placementStatusReportData.expandContent.placementPositionLevel,
              type: 'text',
            },
          ];
        }
        // 军休安置情况
        const militaryRetirementDates = data.find((item) => item.expandChildType === 'D5');
        if (militaryRetirementDates) {
          this.itemId.militaryRetirementDateId = militaryRetirementDates.id;
          this.militaryRetirementDate = [
            {
              name: '军休类别',
              value: militaryRetirementDates.expandContent.categoryMilitaryRest,
              type: 'text',
            },
            {
              name: '安置时间',
              value: militaryRetirementDates.expandContent.placementTime,
              type: 'text',
            },
            {
              name: '安置地',
              value: militaryRetirementDates.expandContent.placementSite,
              type: 'text',
            },
            {
              name: '安置管理单位名称',
              value: militaryRetirementDates.expandContent.placementOrgName,
              type: 'text',
            },
            {
              name: '安置管理单位性质',
              value: militaryRetirementDates.expandContent.placementOrgNature,
              type: 'text',
            },
            {
              name: '服务管理机构名称',
              value: militaryRetirementDates.expandContent.serverOrgName,
              type: 'text',
            },
          ];
        }
        // 附件信息
        const fileListData = data.find((item) => item.expandChildType === 'D7');
        if (fileListData) {
          this.itemId.fileListId = fileListData.id;
          this.fileList = [
            {
              name: '退役正面材料',
              value:fileListData?.expandContent?.materialUrl?.split(',').length? '查看':'暂无附件',
              file: fileListData?.expandContent?.materialUrl?.split(','),
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
      // .rectangle {
      //   width: 200px;
      //   height: 36px;
      //   background: linear-gradient(-45deg, transparent 52px, #1a70e8 0) bottom right,
      //     linear-gradient(-135deg, transparent 52px, #1a70e8 0) top right;
      //   background-size: 100% 100%;
      //   background-repeat: no-repeat;
      //   color: #fff;
      //   display: flex;
      //   align-items: center;
      //   padding: 0 0 0 16px;
      //   box-sizing: border-box;
      // }
      // .rectangle-plus {
      //   min-width: 300px;
      // }
    }
  }
}
/* 去除滚动条 */
::-webkit-scrollbar {
  display: none;
}
</style>
