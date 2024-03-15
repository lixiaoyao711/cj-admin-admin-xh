<template>
  <!-- 人员拓展信息-教育培训信息 -->
  <div class="main">
    <div class="user-info">
      <div class="header">
        <peopleTitle>服役前学历教育情况</peopleTitle>
        <el-button @click="openDialog('preServiceStatusDialogOpen')" size="mini">编 辑</el-button>
      </div>
      <peopleTable :tableData="preServiceStatus" :count="2" />
    </div>
    <div class="user-info">
      <div class="header">
        <peopleTitle>退役后学历教育情况</peopleTitle>
        <el-button @click="openDialog('postServiceStatusDialogOpen')" size="mini">编 辑</el-button>
      </div>
      <peopleTable :tableData="postServiceStatus" :count="2" />
    </div>

    <div class="user-info">
      <div class="header">
        <peopleTitle>职业技能培训情况</peopleTitle>
        <el-button @click="openDialog('professionalSkillsDialogOpen')" size="mini">编 辑</el-button>
      </div>
      <peopleTable :tableData="professionalSkills" :count="2" />
    </div>
    <div class="user-info">
      <div class="header">
        <peopleTitle>参加培训情况</peopleTitle>
        <el-button @click="openDialog('specialCaseDialogOpen', '', '新增参加培训情况')" size="mini">新 增</el-button>
      </div>
      <peopleTable :tableData="specialCase" :tableProps="specialCaseProps" :count="3">
        <template slot="post" slot-scope="{ row }">
          <el-button @click="openDialog('specialCaseDialogOpen', row.id, '编辑参加培训情况')" type="text"
            >编辑</el-button
          >
          <el-button type="text">
            <el-popconfirm @confirm="delVolunteer(row)" title="确定要删除吗?">
              <el-button slot="reference" type="text">删除</el-button>
            </el-popconfirm>
          </el-button>
        </template>
      </peopleTable>
    </div>
    <preServiceStatusDialog
      v-if="preServiceStatusDialogOpen"
      :propsId="itemId.preServiceStatusId"
      title="服役前学历教育情况"
      @close="preServiceStatusDialogOpen = false"
      @success="getList"
    />
    <postServiceStatusDialog
      v-if="postServiceStatusDialogOpen"
      :propsId="itemId.postServiceStatusId"
      title="退役后学历教育情况"
      @close="postServiceStatusDialogOpen = false"
      @success="getList"
    />
    <professionalSkillsDialog
      v-if="professionalSkillsDialogOpen"
      :propsId="itemId.professionalSkillsId"
      title="职业技能培训情况"
      @close="professionalSkillsDialogOpen = false"
      @success="getList"
    />
    <specialCaseDialog
      v-if="specialCaseDialogOpen"
      :propsId="itemId.specialCaseId"
      :title="title"
      @close="specialCaseDialogOpen = false"
      @success="getList"
    />
  </div>
</template>

<script>
import peopleTable from '@/views/worship/peopleInfo/common/peopleTable/index';
import peopleTitle from '@/views/worship/peopleInfo/common/title/index';
import { personExpandPersonExpandList, delPersonExpand } from '@/api/worship/retiredSoldier';
import preServiceStatusDialog from './dialog/preServiceStatusDialog.vue';
import postServiceStatusDialog from './dialog/postServiceStatusDialog.vue';
import professionalSkillsDialog from './dialog/professionalSkillsDialog.vue';
import specialCaseDialog from './dialog/specialCaseDialog.vue';
import { String2Array, Array2String } from '@/utils/toolFn.js';

export default {
  props: {},
  components: {
    peopleTable,
    peopleTitle,
    preServiceStatusDialog,
    postServiceStatusDialog,
    professionalSkillsDialog,
    specialCaseDialog,
  },
  data() {
    return {
      preServiceStatusDialogOpen: false,
      postServiceStatusDialogOpen: false,
      professionalSkillsDialogOpen: false,
      specialCaseDialogOpen: false,

      preServiceStatus: [
        {
          name: '是否在校大学生入伍',
          value: '',
          type: 'text',
        },
        {
          name: '服役前在读学历',
          value: '',
          type: 'text',
        },
        {
          name: '已取得学历情况',
          value: '',
          type: 'text',
        },
        {
          name: '取得时间',
          value: '',
          type: 'text',
        },
        {
          name: '已取得学位情况',
          value: '',
          type: 'text',
        },
        {
          name: '取得时间',
          value: '',
          type: 'text',
        },
      ],
      postServiceStatus: [
        {
          name: '是否复学',
          value: '',
          type: 'text',
        },
        {
          name: '是否转入其他专业',
          value: '',
          type: 'text',
        },
        {
          name: '是否得到学费资助',
          value: '',
          type: 'text',
        },
        {
          name: '学费资助金额（元）',
          value: '',
          type: 'text',
        },
        {
          name: '是否继续深造',
          value: '',
          type: 'text',
        },
        {
          name: '深造学历情况',
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
      professionalSkills: [
        {
          name: '培训类型',
          value: '',
          type: 'text',
        },
        {
          name: '参加培训情况',
          value: '',
          type: 'text',
        },
        {
          name: '获取证书情况',
          value: '',
          type: 'text',
        },
        {
          name: '证书类别',
          value: '',
          type: 'text',
        },
        {
          name: '证书名称',
          value: '',
          type: 'text',
        },
        {
          name: '职业技能培训后是否直接就业',
          value: '',
          type: 'text',
        },
        {
          name: '培训专业与就业岗位是否培训',
          value: '',
          type: 'text',
        },
      ],
      specialCase: [],
      specialCaseProps: [
        {
          label: '承训机构',
          prop: 'trainingInstitutions',
        },
        {
          label: '专业',
          prop: 'major',
        },
        {
          label: '培训时常（小时）',
          prop: 'trainingOften',
        },
        {
          label: '补助资金（元）',
          prop: 'subsidyFunds',
        },
        {
          label: '个人支付金额（元）',
          prop: 'individualPaymentAmount',
        },
        {
          label: '总金额（元）',
          prop: 'totalAmount',
        },
        {
          label: '操作',
          prop: 'post',
        },
      ],
      itemId: {
        preServiceStatusId: '',
        postServiceStatusId: '',
        professionalSkillsId: '',
        specialCaseId: '',
      },
      title: '',
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
        expandParentType: 'F',
        personId: this.$route.params.id,
      }).then((response) => {
        const data = response.rows.map((item) => {
          item.expandContent = JSON.parse(item.expandContent);
          return item;
        });
        console.log('personExpandPersonExpandList', data);
        // 服役前学历教育情况
        const preServiceStatusData = data.find((item) => item.expandChildType === 'F1');
        if (preServiceStatusData) {
          this.itemId.preServiceStatusId = preServiceStatusData.id;
          this.preServiceStatus = [
            {
              name: '是否在校大学生入伍',
              value: preServiceStatusData.expandContent.collegeStudents,
              type: 'text',
            },
            {
              name: '服役前在读学历',
              value: preServiceStatusData.expandContent.educationInProgress,
              type: 'text',
            },
            {
              name: '已取得学历情况',
              value: preServiceStatusData.expandContent.educationObtained,
              type: 'text',
            },
            {
              name: '取得时间',
              value: preServiceStatusData.expandContent.obtainingTime,
              type: 'text',
            },
            {
              name: '已取得学位情况',
              value: preServiceStatusData.expandContent.degreeObtained,
              type: 'text',
            },
            {
              name: '取得时间',
              value: preServiceStatusData.expandContent.obtainedTime,
              type: 'text',
            },
          ];
        }
        // 退役后学历教育情况
        const postServiceStatusData = data.find((item) => item.expandChildType === 'F2');
        if (postServiceStatusData) {
          this.itemId.postServiceStatusId = postServiceStatusData.id;
          this.postServiceStatus = [
            {
              name: '是否复学',
              value: postServiceStatusData.expandContent.resumptionOfStudies,
              type: 'text',
            },
            {
              name: '是否转入其他专业',
              value: postServiceStatusData.expandContent.transferOtherMajors,
              type: 'text',
            },
            {
              name: '是否得到学费资助',
              value: postServiceStatusData.expandContent.tuitionSubsidy,
              type: 'text',
            },
            {
              name: '学费资助金额（元）',
              value: postServiceStatusData.expandContent.tuitionSubsidyAmount,
              type: 'text',
            },
            {
              name: '是否继续深造',
              value: postServiceStatusData.expandContent.continuingEducation,
              type: 'text',
            },
            {
              name: '深造学历情况',
              value: postServiceStatusData.expandContent.furtherEducationBackground,
              type: 'text',
            },
          ];
        }
        // 职业技能培训情况
        const professionalSkillsData = data.find((item) => item.expandChildType === 'F3');
        if (professionalSkillsData) {
          this.itemId.professionalSkillsId = professionalSkillsData.id;
          this.professionalSkills = [
            {
              name: '培训类型',
              value: Array2String(professionalSkillsData.expandContent.trainingType),
              type: 'text',
            },
            {
              name: '参加培训情况',
              value: Array2String(professionalSkillsData.expandContent.trainingAttendance),
              type: 'text',
            },
            {
              name: '获取证书情况',
              value: professionalSkillsData.expandContent.obtainingCertificates,
              type: 'text',
            },
            {
              name: '证书类别',
              value: Array2String(professionalSkillsData.expandContent.certificateCategory),
              type: 'text',
            },
            {
              name: '证书名称',
              value: professionalSkillsData.expandContent.certificateName,
              type: 'text',
            },
            {
              name: '职业技能培训后是否直接就业',
              value: professionalSkillsData.expandContent.directEmployment,
              type: 'text',
            },
            {
              name: '培训专业与就业岗位是否培训',
              value: professionalSkillsData.expandContent.isTrainingProvided,
              type: 'text',
            },
          ];
        }
        // 参加培训情况
        const specialCaseData = data.filter((item) => item.expandChildType === 'F4');
        console.log('specialCaseData', specialCaseData, this.specialCase);
        if (specialCaseData) {
          this.specialCase = specialCaseData.map((item) => {
            return {
              id: item.id,
              ...item.expandContent,
            };
          });
        }
      });
    },
    openDialog(type, id = '', title = '') {
      this.itemId.specialCaseId = id;
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
