<template>
  <div class="main">
    <div class="user-info">
      <div class="header">
        <peopleTitle>就业情况</peopleTitle>

        <el-button @click="openDialog('employmentStatusDialogOpen')" size="mini">编 辑</el-button>
      </div>
      <peopleTable :tableData="employmentStatus" :count="3" />
    </div>
    <div class="user-info">
      <div class="header">
        <peopleTitle>单位就业情况</peopleTitle>

        <el-button @click="openDialog('employmentInstitutionDialogOpen')" size="mini">编 辑</el-button>
      </div>
      <peopleTable :tableData="employmentInstitution" :count="3" />
    </div>
    <div class="user-info">
      <div class="header">
        <peopleTitle>创业情况</peopleTitle>

        <el-button @click="openDialog('entrepreneurshipStatusDialogOpen')" size="mini">编 辑</el-button>
      </div>
      <peopleTable :tableData="entrepreneurshipStatus" :count="3" />
    </div>
    <div class="user-info">
      <div class="header">
        <peopleTitle>公益性岗位情况</peopleTitle>

        <el-button @click="openDialog('publicWelfareDialogOpen')" size="mini">编 辑</el-button>
      </div>
      <peopleTable :tableData="publicWelfare" :count="3" />
    </div>
    <div class="user-info">
      <div class="header">
        <peopleTitle>自由职业情况</peopleTitle>

        <el-button @click="openDialog('freelanceWorkListDialogOpen')" size="mini">编 辑</el-button>
      </div>
      <peopleTable :tableData="freelanceWorkList" :count="3" />
    </div>
    <div class="user-info">
      <div class="header">
        <peopleTitle>离退休情况</peopleTitle>

        <el-button @click="openDialog('retirementStatusDialogOpen')" size="mini">编 辑</el-button>
      </div>
      <peopleTable :tableData="retirementStatus" :count="3" />
    </div>
    <div class="user-info">
      <div class="header">
        <peopleTitle>未就业情况</peopleTitle>

        <el-button @click="openDialog('unemploymentStatusDialogOpen')" size="mini">编 辑</el-button>
      </div>
      <peopleTable :tableData="unemploymentStatus" :count="3" />
    </div>
    <div class="user-info">
      <div class="header">
        <peopleTitle>就业意向</peopleTitle>
        <div>
          <span>是否有就业意向:</span>
          <el-radio-group v-model="personData.workIntention">
            <el-radio label="1">有</el-radio>
            <el-radio label="0">无</el-radio>
          </el-radio-group>
          <el-button class="ml20" @click="openDialog('employmentIntentionDialogOpen', '', '新增就业意向')" size="mini"
            >新 建</el-button
          >
        </div>
      </div>
      <peopleTable :tableData="employmentIntention" :tableProps="employmentIntentionProps" :count="3">
        <template slot="post" slot-scope="{ row }">
          <el-button @click="openDialog('employmentIntentionDialogOpen', row.id, '编辑就业意向')" type="text"
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
    <employmentStatusDialog
      v-if="employmentStatusDialogOpen"
      :propsId="itemId.employmentStatusId"
      :title="'就业情况'"
      @close="employmentStatusDialogOpen = false"
      @success="getList"
    />
    <employmentInstitutionDialog
      v-if="employmentInstitutionDialogOpen"
      :propsId="itemId.employmentInstitutionId"
      :title="'单位就业情况'"
      @close="employmentInstitutionDialogOpen = false"
      @success="getList"
    />
    <entrepreneurshipStatusDialog
      v-if="entrepreneurshipStatusDialogOpen"
      :propsId="itemId.entrepreneurshipStatusId"
      :title="'创业情况'"
      @close="entrepreneurshipStatusDialogOpen = false"
      @success="getList"
    />
    <publicWelfareDialog
      v-if="publicWelfareDialogOpen"
      :propsId="itemId.publicWelfareId"
      :title="'公益性岗位情况'"
      @close="publicWelfareDialogOpen = false"
      @success="getList"
    />
    <freelanceWorkListDialog
      v-if="freelanceWorkListDialogOpen"
      :propsId="itemId.freelanceWorkListId"
      :title="'自由职业情况'"
      @close="freelanceWorkListDialogOpen = false"
      @success="getList"
    />
    <retirementStatusDialog
      v-if="retirementStatusDialogOpen"
      :propsId="itemId.retirementStatusId"
      :title="'离退休情况'"
      @close="retirementStatusDialogOpen = false"
      @success="getList"
    />
    <unemploymentStatusDialog
      v-if="unemploymentStatusDialogOpen"
      :propsId="itemId.unemploymentStatusId"
      :title="'未就业情况'"
      @close="unemploymentStatusDialogOpen = false"
      @success="getList"
    />

    <employmentIntentionDialog
      v-if="employmentIntentionDialogOpen"
      :propsId="itemId.employmentIntentionId"
      :title="title"
      @close="employmentIntentionDialogOpen = false"
      @success="getList"
    />
  </div>
</template>

<script>
import peopleTable from '@/views/worship/peopleInfo/common/peopleTable/index';
import peopleTitle from '@/views/worship/peopleInfo/common/title/index';
import { personExpandPersonExpandList, delPersonExpand, getBasicPerson } from '@/api/worship/retiredSoldier';
import employmentStatusDialog from './dialog/employmentStatusDialog';
import employmentInstitutionDialog from './dialog/employmentInstitutionDialog';
import entrepreneurshipStatusDialog from './dialog/entrepreneurshipStatusDialog';
import publicWelfareDialog from './dialog/publicWelfareDialog';
import freelanceWorkListDialog from './dialog/freelanceWorkListDialog';
import retirementStatusDialog from './dialog/retirementStatusDialog';
import unemploymentStatusDialog from './dialog/unemploymentStatusDialog';
import employmentIntentionDialog from './dialog/employmentIntentionDialog';

export default {
  props: {},
  components: {
    peopleTable,
    peopleTitle,
    employmentStatusDialog,
    employmentInstitutionDialog,
    entrepreneurshipStatusDialog,
    publicWelfareDialog,
    freelanceWorkListDialog,
    retirementStatusDialog,
    unemploymentStatusDialog,
    employmentIntentionDialog,
  },
  data() {
    return {
      employmentStatusDialogOpen: false,
      employmentInstitutionDialogOpen: false,
      entrepreneurshipStatusDialogOpen: false,
      publicWelfareDialogOpen: false,
      freelanceWorkListDialogOpen: false,
      retirementStatusDialogOpen: false,
      unemploymentStatusDialogOpen: false,
      employmentIntentionDialogOpen: false,
      employmentStatus: [
        {
          name: '就业状态',
          value: '',
          type: 'text',
        },
        {
          name: '个人年收入（元）',
          value: '',
          type: 'text',
        },
        {
          name: '家庭年收入（元）',
          value: '',
          type: 'text',
        },
      ],
      employmentInstitution: [
        {
          name: '单位类型',
          value: '',
          type: 'text',
        },
        {
          name: '岗位类型',
          value: '',
          type: 'text',
        },
        {
          name: '是否新业态就业',
          value: '',
          type: 'text',
        },
        {
          name: '新业态就业类型',
          value: '',
          type: 'text',
        },
        {
          name: '单位名称',
          value: '',
          type: 'text',
        },
        {
          name: '单位地址',
          value: '',
          type: 'text',
        },
        {
          name: '何时进入现单位工作',
          value: '',
          type: 'text',
        },
        {
          name: '所属行业',
          value: '',
          type: 'text',
        },
        {
          name: '劳务合同类型',
          value: '',
          type: 'text',
        },
      ],
      entrepreneurshipStatus: [
        {
          name: '企业（项目）名称',
          value: '',
          type: 'text',
        },
        {
          name: '创业类型',
          value: '',
          type: 'text',
        },
        {
          name: '职务',
          value: '',
          type: 'text',
        },
        {
          name: '法定代表人',
          value: '',
          type: 'text',
        },
        {
          name: '法定代表人联系方式',
          value: '',
          type: 'text',
        },
        {
          name: '控股情况',
          value: '',
          type: 'text',
        },
        {
          name: '统一社会信用代码',
          value: '',
          type: 'text',
        },
        {
          name: '所属行业',
          value: '',
          type: 'text',
        },
        {
          name: '注册地址',
          value: '',
          type: 'text',
        },
        {
          name: '成立时间（注册时间）',
          value: '',
          type: 'text',
        },
        {
          name: '吸纳就业人数',
          value: '',
          type: 'text',
        },
        {
          name: '吸纳退役军人人数',
          value: '',
          type: 'text',
        },
        {
          name: '资产总额（万元）',
          value: '',
          type: 'text',
        },
        {
          name: '年营业收入（万元）',
          value: '',
          type: 'text',
        },
        {
          name: '下（返）乡创业',
          value: '',
          type: 'text',
        },
        {
          name: '享受扶持政策情况',
          value: '',
          type: 'text',
        },
      ],
      publicWelfare: [
        {
          name: '岗位名称',
          value: '',
          type: 'text',
        },
        {
          name: '从事时间',
          value: '',
          type: 'text',
        },
        {
          name: '所属行业',
          value: '',
          type: 'text',
        },
      ],
      freelanceWorkList: [
        {
          name: '职业名称',
          value: '',
          type: 'text',
        },
        {
          name: '从事时间',
          value: '',
          type: 'text',
        },
        {
          name: '所属行业',
          value: '',
          type: 'text',
        },
      ],
      retirementStatus: [
        {
          name: '离退休前单位',
          value: '',
          type: 'text',
        },
        {
          name: '原单位地址',
          value: '',
          type: 'text',
        },
        {
          name: '所属行业',
          value: '',
          type: 'text',
        },
        {
          name: '退休时间',
          value: '',
          type: 'text',
        },
      ],
      unemploymentStatus: [
        {
          name: '未就业原因',
          value: '',
          type: 'text',
        },
        {
          name: '零就业家庭',
          value: '',
          type: 'text',
        },
      ],
      employmentIntention: [],
      employmentIntentionProps: [
        {
          label: '工作地区',
          prop: 'workArea',
        },
        {
          label: '行业',
          prop: 'industry',
        },
        {
          label: '职业',
          prop: 'occupation',
        },
        {
          label: '薪资（元/月）',
          prop: 'salary',
        },
        {
          label: '操作',
          prop: 'post',
        },
      ],
      itemId: {
        employmentStatusId: '',
        employmentInstitutionId: '',
        entrepreneurshipStatusId: '',
        publicWelfareId: '',
        freelanceWorkListId: '',
        retirementStatusId: '',
        unemploymentStatusId: '',
        employmentIntentionId: '',
        employmentIntentionPropsId: '',
      },
      title: '',
      personData: {},
    };
  },
  computed: {},
  watch: {},
  created() {
    this.getList();
    this.getBasicPerson();
  },
  mounted() {},
  methods: {
    getBasicPerson() {
      getBasicPerson(this.$route.params.id).then((response) => {
        this.personData = response.data;
      });
    },
    getList() {
      personExpandPersonExpandList({
        expandParentType: 'E',
        personId: this.$route.params.id,
      }).then((response) => {
        const data = response.rows.map((item) => {
          item.expandContent = JSON.parse(item.expandContent);
          return item;
        });
        console.log('personExpandPersonExpandList', data);
        // 就业情况
        const employmentStatusData = data.find((item) => item.expandChildType === 'E1');
        if (employmentStatusData) {
          this.itemId.employmentStatusId = employmentStatusData.id;
          this.employmentStatus = [
            {
              name: '就业状态',
              value: employmentStatusData.expandContent.employmentStatus,
              type: 'text',
            },
            {
              name: '个人年收入（元）',
              value: employmentStatusData.expandContent.personalAnnualIncome,
              type: 'text',
            },
            {
              name: '家庭年收入（元）',
              value: employmentStatusData.expandContent.annualHouseholdIncome,
              type: 'text',
            },
          ];
        }
        // 单位就业情况
        const employmentInstitutionData = data.find((item) => item.expandChildType === 'E2');
        if (employmentInstitutionData) {
          this.itemId.employmentInstitutionId = employmentInstitutionData.id;
          this.employmentInstitution = [
            {
              name: '单位类型',
              value: employmentInstitutionData.expandContent.unitNature,
              type: 'text',
            },
            {
              name: '岗位类型',
              value: employmentInstitutionData.expandContent.jobType,
              type: 'text',
            },
            {
              name: '是否新业态就业',
              value: employmentInstitutionData.expandContent.newTypeEmployment,
              type: 'text',
            },
            {
              name: '新业态就业类型',
              value: employmentInstitutionData.expandContent.typeEmploymentNewFormats,
              type: 'text',
            },
            {
              name: '单位名称',
              value: employmentInstitutionData.expandContent.orgName,
              type: 'text',
            },
            {
              name: '单位地址',
              value: employmentInstitutionData.expandContent.orgAddress,
              type: 'text',
            },
            {
              name: '何时进入现单位工作',
              value: employmentInstitutionData.expandContent.workTime,
              type: 'text',
            },
            {
              name: '所属行业',
              value: employmentInstitutionData.expandContent.industry,
              type: 'text',
            },
            {
              name: '劳务合同类型',
              value: employmentInstitutionData.expandContent.typeLaborContract,
              type: 'text',
            },
          ];
        }
        // 创业情况
        const entrepreneurshipStatusData = data.find((item) => item.expandChildType === 'E3');
        if (entrepreneurshipStatusData) {
          this.itemId.entrepreneurshipStatusId = entrepreneurshipStatusData.id;
          this.entrepreneurshipStatus = [
            {
              name: '企业（项目）名称',
              value: entrepreneurshipStatusData.expandContent.enterpriseName,
              type: 'text',
            },
            {
              name: '创业类型',
              value: entrepreneurshipStatusData.expandContent.entrepreneurshipType,
              type: 'text',
            },
            {
              name: '职务',
              value: entrepreneurshipStatusData.expandContent.post,
              type: 'text',
            },
            {
              name: '法定代表人',
              value: entrepreneurshipStatusData.expandContent.legalPerson,
              type: 'text',
            },
            {
              name: '法定代表人联系方式',
              value: entrepreneurshipStatusData.expandContent.legalPersonPhone,
              type: 'text',
            },
            {
              name: '控股情况',
              value: entrepreneurshipStatusData.expandContent.holdingSituation,
              type: 'text',
            },
            {
              name: '统一社会信用代码',
              value: entrepreneurshipStatusData.expandContent.socialCreditCode,
              type: 'text',
            },
            {
              name: '所属行业',
              value: entrepreneurshipStatusData.expandContent.industry,
              type: 'text',
            },
            {
              name: '注册地址',
              value: entrepreneurshipStatusData.expandContent.registeredAddress,
              type: 'text',
            },
            {
              name: '成立时间（注册时间）',
              value: entrepreneurshipStatusData.expandContent.establishmentTime,
              type: 'text',
            },
            {
              name: '吸纳就业人数',
              value: entrepreneurshipStatusData.expandContent.employmentAbsorption,
              type: 'text',
            },
            {
              name: '吸纳退役军人人数',
              value: entrepreneurshipStatusData.expandContent.employmentRetireAbsorption,
              type: 'text',
            },
            {
              name: '资产总额（万元）',
              value: entrepreneurshipStatusData.expandContent.totalAssets,
              type: 'text',
            },
            {
              name: '年营业收入（万元）',
              value: entrepreneurshipStatusData.expandContent.annualIncome,
              type: 'text',
            },
            {
              name: '下（返）乡创业',
              value: entrepreneurshipStatusData.expandContent.goCountryside,
              type: 'text',
            },
            {
              name: '享受扶持政策情况',
              value: entrepreneurshipStatusData.expandContent.policySituation,
              type: 'text',
            },
          ];
        }
        // 公益性岗位情况
        const publicWelfareData = data.find((item) => item.expandChildType === 'E4');
        if (publicWelfareData) {
          this.itemId.publicWelfareId = publicWelfareData.id;
          this.publicWelfare = [
            {
              name: '岗位名称',
              value: publicWelfareData.expandContent.jobTitle,
              type: 'text',
            },
            {
              name: '从事时间',
              value: publicWelfareData.expandContent.engagedInTime,
              type: 'text',
            },
            {
              name: '所属行业',
              value: publicWelfareData.expandContent.industry,
              type: 'text',
            },
          ];
        }
        //自由职业情况
        const freelanceWorkListData = data.find((item) => item.expandChildType === 'E5');
        if (freelanceWorkListData) {
          this.itemId.freelanceWorkListId = freelanceWorkListData.id;
          this.freelanceWorkList = [
            {
              name: '职业名称',
              value: freelanceWorkListData.expandContent.careerName,
              type: 'text',
            },
            {
              name: '从事时间',
              value: freelanceWorkListData.expandContent.engagedInTime,
              type: 'text',
            },
            {
              name: '所属行业',
              value: freelanceWorkListData.expandContent.industry,
              type: 'text',
            },
          ];
        }
        // 离退休情况
        const retirementStatusData = data.find((item) => item.expandChildType === 'E6');
        if (retirementStatusData) {
          this.itemId.retirementStatusId = retirementStatusData.id;
          this.retirementStatus = [
            {
              name: '离退休前单位',
              value: retirementStatusData.expandContent.preRetirementUnit,
              type: 'text',
            },
            {
              name: '原单位地址',
              value: retirementStatusData.expandContent.orgAddress,
              type: 'text',
            },
            {
              name: '所属行业',
              value: retirementStatusData.expandContent.industry,
              type: 'text',
            },
            {
              name: '退休时间',
              value: retirementStatusData.expandContent.retirementTime,
              type: 'text',
            },
          ];
        }
        // 未就业情况
        const unemploymentStatusData = data.find((item) => item.expandChildType === 'E7');
        if (unemploymentStatusData) {
          this.itemId.unemploymentStatusId = unemploymentStatusData.id;
          this.unemploymentStatus = [
            {
              name: '未就业原因',
              value: unemploymentStatusData.expandContent.reason,
              type: 'text',
            },
            {
              name: '零就业家庭',
              value: unemploymentStatusData.expandContent.zeroFamily,
              type: 'text',
            },
          ];
        }
        // 就业意向
        const employmentIntentionData = data.filter((item) => item.expandChildType === 'E8');
        if (employmentIntentionData) {
          this.employmentIntention = employmentIntentionData.map((item) => {
            return {
              ...item.expandContent,
              id: item.id,
              personId: item.personId,
            };
          });
        }
      });
    },
    openDialog(type, id = '', title = '') {
      console.log(id);
      this.itemId.employmentIntentionId = id;
      this.title = title;
      this[type] = true;
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
