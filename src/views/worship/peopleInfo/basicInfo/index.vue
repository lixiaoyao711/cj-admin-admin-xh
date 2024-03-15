<template>
  <div class="main">
    <div class="user-info">
      <div class="header">
        <peopleTitle>基础身份信息</peopleTitle>
        <el-button @click="openDialog('basicInfoOpen')" size="mini">编 辑</el-button>
      </div>
      <peopleTable :tableData="basicInfo" :count="3" />
    </div>
    <div class="user-info">
      <div class="header">
        <peopleTitle>工作专班</peopleTitle>
        <el-button @click="openDialog('workInfoOpen', workInfoId)" size="mini">编 辑</el-button>
      </div>
      <peopleTable :tableData="workInfo" :count="2" />
    </div>
    <div class="user-info">
      <div class="header">
        <peopleTitle>家庭成员关系</peopleTitle>
        <el-button @click="openDialog('familyRelationshipOpen', '', '新增家庭成员')" size="mini">新 增</el-button>
      </div>
      <peopleTable :tableData="familyRelationship" :tableProps="familyRelationshipProps" :count="2">
        <template slot-scope="{ row }" slot="post">
          <el-button @click="openDialog('familyRelationshipOpen', row.id, '编辑家庭成员')" type="text">编辑</el-button>
          <el-button type="text">
            <el-popconfirm @confirm="delFamily(row)" title="确定要删除该关系吗?">
              <el-button slot="reference" type="text">删除</el-button>
            </el-popconfirm>
          </el-button>
        </template>
      </peopleTable>
    </div>
    <div class="user-info">
      <div class="header">
        <peopleTitle>最高学历、学位</peopleTitle>

        <el-button @click="openDialog('educationLevelOpen', '1686271693711147010')" size="mini">编 辑</el-button>
      </div>
      <peopleTable :tableData="educationLevel" :count="2" />
    </div>
    <div class="user-info">
      <div class="header">
        <peopleTitle>社会保障情况</peopleTitle>

        <el-button @click="openDialog('guaranteeOpen', '1684757427237474305')" size="mini">编 辑</el-button>
      </div>
      <peopleTable :tableData="guarantee" :count="3" />
    </div>
    <div class="user-info">
      <div class="header">
        <peopleTitle>住房情况</peopleTitle>
        <el-button @click="openDialog('homeListOpen', '1686556495732416513')" size="mini">编 辑</el-button>
      </div>
      <peopleTable :tableData="homeList" :count="2" />
    </div>
    <div class="user-info">
      <div class="header">
        <peopleTitle>奖惩情况</peopleTitle>
        <el-button @click="openDialog('rewardOpen', '1684757427237474305')" size="mini">编 辑</el-button>
      </div>
      <peopleTable :tableData="reward" :count="2" />
    </div>
    <div class="user-info">
      <div class="header">
        <peopleTitle>附件信息</peopleTitle>
        <el-button @click="openDialog('fileListOpen', '1684757427237474305')" size="mini">编 辑</el-button>
      </div>
      <peopleTable :tableData="fileList" :count="2" />
    </div>
    <!-- 修改弹窗 -->
    <BasicInfoEditDialog
      :open="basicInfoOpen"
      :title="'编辑基础身份信息'"
      :formData="formData"
      @cancel="basicInfoOpen = false"
      @success="success"
    />
    <workInfoEditDialog
      :propsId="itemId.workInfoId"
      v-if="workInfoOpen"
      @success="getList"
      @close="workInfoOpen = false"
    />
    <familyRelationshipDialog
      :propsId="getId"
      :title="title"
      v-if="familyRelationshipOpen"
      @success="getList"
      @close="familyRelationshipOpen = false"
    />
    <educationLevelDialog
      :propsId="itemId.educationLevelId"
      v-if="educationLevelOpen"
      @success="getList"
      @close="educationLevelOpen = false"
    />
    <guaranteeDialog
      :propsId="itemId.guaranteeId"
      v-if="guaranteeOpen"
      @success="getList"
      @close="guaranteeOpen = false"
    />
    <homeListDialog :propsId="itemId.homeListId" v-if="homeListOpen" @success="getList" @close="homeListOpen = false" />
    <rewardDialog :propsId="itemId.rewardId" v-if="rewardOpen" @success="getList" @close="rewardOpen = false" />
    <fileListDialog :propsId="itemId.fileListId" v-if="fileListOpen" @success="getList" @close="fileListOpen = false" />
  </div>
</template>

<script>
import peopleTable from '@/views/worship/peopleInfo/common/peopleTable/index';
import peopleTitle from '@/views/worship/peopleInfo/common/title/index';

import BasicInfoEditDialog from './dialog/basicInfoEditDialog.vue';
import workInfoEditDialog from './dialog/workInfoEditDialog.vue';
import familyRelationshipDialog from './dialog/familyRelationshipDialog.vue';
import educationLevelDialog from './dialog/educationLevelDialog.vue';
import guaranteeDialog from './dialog/guaranteeDialog.vue';
import homeListDialog from './dialog/homeListDialog.vue';
import rewardDialog from './dialog/rewardDialog.vue';
import fileListDialog from './dialog/fileListDialog.vue';
import {
  personExpandPersonExpandList,
  getBasicPerson,
  getPersonExpandById,
  updatePersonExpand,
  delPersonExpand,
} from '@/api/worship/retiredSoldier';
import { SelectValueToLabel } from '@/utils/toolFn.js';

export default {
  props: {},
  components: {
    peopleTable,
    peopleTitle,
    BasicInfoEditDialog,
    workInfoEditDialog,
    familyRelationshipDialog,
    educationLevelDialog,
    guaranteeDialog,
    homeListDialog,
    rewardDialog,
    fileListDialog,
  },
  data() {
    return {
      //按钮loading
      buttonLoading: false,
      basicInfo: [],
      workInfo: [
        {
          name: '专班区领导',
          value: '',
          type: 'text',
        },
        {
          name: '联系方式',
          value: '',
          type: 'text',
        },
        {
          name: '专班镇街领导',
          value: '',
          type: 'text',
        },
        {
          name: '联系方式',
          value: '',
          type: 'text',
        },
        {
          name: '专班人员1',
          value: '',
          type: 'text',
        },
        {
          name: '联系方式1',
          value: '',
          type: 'text',
        },
      ],
      familyRelationship: [],
      familyRelationshipProps: [
        {
          label: '关系',
          prop: 'relationship',
        },
        {
          label: '姓名',
          prop: 'name',
        },
        {
          label: '联系电话',
          prop: 'phone',
        },
        {
          label: '身份证号',
          prop: 'idCard',
        },
        {
          label: '健康状况',
          prop: 'healthCondition',
        },
        {
          label: '就业状况',
          prop: 'employmentStatus',
        },
        {
          label: '工作单位',
          prop: 'workUnit',
        },
        {
          label: '工作职务',
          prop: 'post',
        },
        {
          label: '操作',
          prop: 'post',
        },
      ],

      educationLevel: [
        {
          name: '学历情况',
          value: '',
          type: 'text',
        },
        {
          name: '取得时间',
          value: '',
          type: 'text',
        },
        {
          name: '学位情况',
          value: '',
          type: 'text',
        },
        {
          name: '取得时间',
          value: '',
          type: 'text',
        },
      ],
      guarantee: [
        {
          name: '养老保险参保情况',
          value: '',
          type: 'text',
        },
        {
          name: '养老保险参保地',
          value: '',
          type: 'text',
        },
        {
          name: '养老保险参保时常（月）',
          value: '',
          type: 'text',
        },
        {
          name: '养老保险是否中断',
          value: '',
          type: 'text',
        },
        {
          name: '养老保险中断时段',
          value: '',
          type: 'text',
        },
        {
          name: '',
          value: '',
          type: 'text',
        },
        {
          name: '医疗保险参保情况',
          value: '',
          type: 'text',
        },
        {
          name: '医疗保险参保地',
          value: '',
          type: 'text',
        },
        {
          name: '医疗保险参保时常（月）',
          value: '',
          type: 'text',
        },
        {
          name: '医疗保险是否中断',
          value: '',
          type: 'text',
        },
        {
          name: '医疗保险中断时段',
          value: '',
          type: 'text',
        },
        {
          name: '',
          value: '',
          type: 'text',
        },
      ],
      homeList: [
        {
          name: '住房情况',
          value: '',
          type: 'text',
        },
        {
          name: '住房公积金缴纳情况',
          value: '',
          type: 'text',
        },
      ],
      reward: [
        {
          name: '奖励奖项',
          value: '',
          type: 'text',
        },
        {
          name: '奖励奖项说明',
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
      fileList: [
        {
          name: '身份证',
          value: '',
          type: 'text',
        },
        {
          name: '户口登记薄',
          value: '',
          type: 'text',
        },
        {
          name: '奖惩情况（退出现役）',
          value: '',
          type: 'text',
        },
        {
          name: '信息签证表',
          value: '',
          type: 'text',
        },
      ],
      title: '修改家庭成员',
      open: false,
      basicInfoOpen: false,
      workInfoOpen: false,
      familyRelationshipOpen: false,
      educationLevelOpen: false,
      guaranteeOpen: false,
      homeListOpen: false,
      rewardOpen: false,
      fileListOpen: false,
      getId: '',
      workInfoId: '',
      itemId: {
        workInfoId: '',
        familyRelationshipId: '',
        educationLevelId: '',
        guaranteeId: '',
        homeListId: '',
        rewardId: '',
        fileListId: '',
      },
      rules: {
        name: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
        idCard: [
          { required: true, message: '身份证不能为空', trigger: 'blur' },
          { pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, message: '身份证格式不正确', trigger: 'blur' },
        ],
        idCardIssuing: [{ required: true, message: '身份证签发机关不能为空', trigger: 'blur' }],
      },
      form: {},
      formData: {},
    };
  },
  computed: {},
  watch: {},
  created() {
    this.getBasicPerson();
    this.getList();
  },
  mounted() {},
  methods: {
    getBasicPerson() {
      getBasicPerson(this.$route.params.id).then((response) => {
        const data = response.data;
        this.formData = data;
        let idCardValidity = '';
        if (!data.idCardStartTime && !data.idCardEndTime) {
          idCardValidity = '';
        } else {
          let idCardStartTime = this.parseTime(data.idCardStartTime, '{y}-{m}-{d}');
          let idCardEndTime = this.parseTime(data.idCardEndTime, '{y}-{m}-{d}');
          idCardValidity = data.longTerm === '1' ? idCardStartTime : idCardStartTime + '--' + idCardEndTime;
        }

        let personnelTags = SelectValueToLabel(this.$store.state.user.peoPleTagList, data.personnelTags);
        // console.log('🚀 ~ getBasicPerson ~ personnelTags:', personnelTags, this.formData);
        this.basicInfo = [
          {
            name: '姓名',
            value: data.name,
            type: 'text',
          },
          {
            name: '身份证号码',
            value: data.idCard,
            type: 'text',
          },
          {
            name: '身份证有效期',
            value: idCardValidity,
            type: 'text',
          },
          {
            name: '身份证签发机关',
            value: data.idCardIssuing,
            type: 'text',
          },
          {
            name: '性别',
            value: data.sex,
            // dict: 'sys_user_sex',
            type: 'text',
          },
          {
            name: '出生日期',
            value: data.birthday,
            type: 'text',
          },
          {
            name: '年龄',
            value: data.age,
            type: 'text',
          },
          {
            name: '联系方式',
            value: data.phone,
            type: 'text',
          },
          {
            name: '民族',
            value: data.nation,
            // dict: 'sys_worship_ethnicgroup',
            type: 'text',
          },
          {
            name: '行政区划',
            value: data.divisionName,
            type: 'text',
          },
          {
            name: '政治面貌',
            value: data.politicalLandscape,
            // dict: 'sys_worship_facetype',
            type: 'text',
          },
          {
            name: '婚姻状况',
            value: data.maritalStatus,
            // dict: 'sys_worship_maritalstatus',
            type: 'text',
          },
          {
            name: '健康状况',
            value: data.health,
            // dict: 'sys_worship_physicalcondition',
            type: 'text',
          },
          {
            type: 'text',
            name: '文化程度',
            value: data.culturalStatus,
          },
          {
            name: '户籍类别',
            value: data.registeredResidenceType,
            // dict: 'sys_worship_householdeegistration',
            type: 'text',
          },
          {
            name: '户籍管理单位',
            value: data.registeredResidenceUnit,
            type: 'text',
          },
          {
            name: '户籍地',
            value: data.registeredResidence,
            type: 'text',
          },
          {
            name: '户籍地详细地址',
            value: data.registeredResidenceAddress,
            type: 'text',
          },
          {
            name: '常住地',
            value: data.permanentResidence,
            type: 'text',
          },
          {
            name: '常住地详细地址',
            value: data.permanentResidenceAddress,
            type: 'text',
          },
          {
            name: '是否重点关注群体',
            value: data.whetherToFocusOnGroups == '1' ? '是' : '否',
            type: 'text',
          },
          {
            name: '重点类型',
            value: data.keyTypes,
            dict: 'sys_worship_focustype',
            type: 'dict',
          },
          {
            name: '人员标签',
            value: personnelTags,
            type: 'text',
          },
        ];
      });
    },
    success() {
      this.basicInfoOpen = false;
      this.getBasicPerson();
    },
    getList() {
      personExpandPersonExpandList({
        expandParentType: 'A',
        personId: this.$route.params.id,
      }).then((response) => {
        const data = response.rows.map((item) => {
          item.expandContent = JSON.parse(item.expandContent);
          return item;
        });
        console.log('personExpandPersonExpandList', data);
        //工作专班
        let workData = data.find((item) => item.expandChildType === 'A1');
        if (workData) {
          // this.workInfoId = workData.id;
          this.itemId.workInfoId = workData.id;
          workData.expandContent.specialPerson = workData.expandContent.specialPerson.split(',');
          workData.expandContent.specialPhone = workData.expandContent.specialPhone.split(',');
          // console.log('🚀 ~ 工作专班:', workData);
          this.workInfo = [
            {
              name: '专班区领导',
              value: workData.expandContent.areaLeader,
              type: 'text',
            },
            {
              name: '联系方式',
              value: workData.expandContent.areaPhone,
              type: 'text',
            },
            {
              name: '专班镇街领导',
              value: workData.expandContent.streetLeader,
              type: 'text',
            },
            {
              name: '联系方式',
              value: workData.expandContent.streetPhone,
              type: 'text',
            },
            // ...workData.expandContent.specialPerson.map((item, index) => {
            //   // console.log('item', item);
            //   return {
            //     name: '专班人员' + (index + 1),
            //     value: item,
            //     type: 'text',
            //   };
            // }),
            // ...workData.expandContent.specialPhone.split(',').map((item, index) => {
            //   return {
            //     name: '联系方式' + (index + 1),
            //     value: item,
            //     type: 'text',
            //   };
            // }),
          ];
          workData.expandContent.specialPerson.map((item, index) => {
            let phoneItem = {
              name: '联系方式' + (index + 1),
              value: workData.expandContent.specialPhone[index],
              type: 'text',
            };
            this.workInfo.push({
              name: '专班人员' + (index + 1),
              value: item,
              type: 'text',
            });
            this.workInfo.push(phoneItem);
          });
        }
        //家庭成员关系
        const familyRelationshipData = data.filter((item) => item.expandChildType === 'A2');
        if (familyRelationshipData) {
          console.log('familyRelationshipData', familyRelationshipData);
          this.familyRelationship = familyRelationshipData.map((item) => {
            return {
              ...item.expandContent,
              id: item.id,
              personId: item.personId,
            };
          });
          console.log('familyRelationship', this.familyRelationship);
        }
        //最高学历.学位
        const educationLevelData = data.find((item) => item.expandChildType === 'A3');
        if (educationLevelData) {
          this.itemId.educationLevelId = educationLevelData.id;
          this.educationLevel = [
            {
              name: '学历情况',
              value: educationLevelData.expandContent.educationBackground,
              // dict: 'sys_worship_educationlevel',
              type: 'text',
            },
            {
              name: '取得时间',
              value: educationLevelData.expandContent.educationBackgroundTime,
              type: 'text',
            },
            {
              name: '学位情况',
              value: educationLevelData.expandContent.degreeSituation,
              // dict: 'sys_worship_academicdegree',
              type: 'text',
            },
            {
              name: '取得时间',
              value: educationLevelData.expandContent.degreeSituationTime,
              type: 'text',
            },
          ];
        }
        //社会保障情况
        const guaranteeData = data.find((item) => item.expandChildType === 'A4');
        if (guaranteeData) {
          this.itemId.guaranteeId = guaranteeData.id;
          this.guarantee = [
            {
              name: '养老保险参保情况',
              value: guaranteeData.expandContent.pensionInsurancePartStatus,
              type: 'text',
            },
            {
              name: '养老保险参保地',
              value: guaranteeData.expandContent.placePartPensionInsurance,
              type: 'text',
            },
            {
              name: '养老保险参保时常（月）',
              value: guaranteeData.expandContent.regPartPensionInsurance,
              type: 'text',
            },
            {
              name: '养老保险是否中断',
              value: guaranteeData.expandContent.pensionInsurance,
              type: 'text',
            },
            {
              name: '养老保险中断时段',
              value:
                guaranteeData.expandContent.pensionInsurancePeriodBeginTime +
                '-' +
                guaranteeData.expandContent.pensionInsurancePeriodEndTime,
              type: 'text',
            },
            {
              name: '',
              value: '',
              type: 'text',
            },
            {
              name: '医疗保险参保情况',
              value: guaranteeData.expandContent.medInsurancePartStatus,
              type: 'text',
            },
            {
              name: '医疗保险参保地',
              value: guaranteeData.expandContent.placeMedParticipation,
              type: 'text',
            },
            {
              name: '医疗保险参保时常（月）',
              value: guaranteeData.expandContent.durationMedInsurancePart,
              type: 'text',
            },
            {
              name: '医疗保险是否中断',
              value: guaranteeData.expandContent.medInsuranceInterrupted,
              type: 'text',
            },
            {
              name: '医疗保险中断时段',
              value:
                guaranteeData.expandContent.medInterruptionPeriodBeginTime +
                '-' +
                guaranteeData.expandContent.medInterruptionPeriodEndTime,
              type: 'text',
            },
            {
              name: '',
              value: '',
              type: 'text',
            },
          ];
        }
        //住房情况
        const homeListData = data.find((item) => item.expandChildType === 'A5');
        if (homeListData) {
          this.itemId.homeListId = homeListData.id;
          this.homeList = [
            {
              name: '住房情况',
              value: homeListData.expandContent.houseSituation,
              type: 'text',
            },
            {
              name: '住房公积金缴纳情况',
              value: homeListData.expandContent.paymentStatusProvident,
              type: 'text',
            },
          ];
        }
        //奖惩情况
        const rewardData = data.find((item) => item.expandChildType === 'A6');
        // console.log("🚀 ~ 奖惩情况:", rewardData)
        if (rewardData) {
          this.itemId.rewardId = rewardData.id;
          this.reward = [
            {
              name: '奖励奖项',
              value: rewardData.expandContent.rewardsAndAwards,
              type: 'text',
            },
            {
              name: '奖励奖项说明',
              value: rewardData.expandContent.rewardAndAwardMsg,
              type: 'text',
            },
            {
              name: '处分',
              value: rewardData.expandContent.punishment,
              type: 'text',
            },
            {
              name: '惩罚处分说明',
              value: rewardData.expandContent.punishmentMsg,
              type: 'text',
            },
          ];
        }
        //附件信息
        const fileListData = data.find((item) => item.expandChildType === 'A7');
        if (fileListData) {
          this.itemId.fileListId = fileListData.id;
          this.fileList = [
            {
              name: '身份证',
              value: fileListData?.expandContent?.idCardUrl?.split(',').length ? '查看' : '暂无附件',
              file: fileListData?.expandContent?.idCardUrl?.split(','),
              type: 'file',
            },
            {
              name: '户口登记薄',
              value: fileListData?.expandContent?.householdRegBookUrl?.split(',').length ? '查看' : '暂无附件',
              file: fileListData?.expandContent?.householdRegBookUrl?.split(','),
              type: 'file',
            },
            {
              name: '奖惩情况（退出现役）',
              value: fileListData?.expandContent?.rewardsAndPunishmentsUrl?.split(',').length ? '查看' : '暂无附件',
              file: fileListData?.expandContent?.rewardsAndPunishmentsUrl?.split(','),
              type: 'file',
            },
            {
              name: '信息签证表',
              value: fileListData?.expandContent?.formationVisaFormUrl?.split(',').length ? '查看' : '暂无附件',
              file: fileListData?.expandContent?.formationVisaFormUrl?.split(','),
              type: 'file',
            },
          ];
          console.log('fileList', this.fileList);
        }
      });
    },
    openDialog(type, id = '', title = '') {
      this[type] = true;
      this.getId = id;
      this.title = title;
    },
    delFamily(row) {
      console.log(row);
      delPersonExpand(row.id).then((response) => {
        this.$modal.msgSuccess('删除成功');
        this.getList();
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {};
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.buttonLoading = true;
          if (this.form.id != null) {
            updatePersonExpand(this.form)
              .then((response) => {
                this.$modal.msgSuccess('修改成功');
                this.open = false;
                this.getList();
              })
              .finally(() => {
                this.buttonLoading = false;
              });
          } else {
            updatePersonExpand(this.form)
              .then((response) => {
                this.$modal.msgSuccess('新增成功');
                this.open = false;
                this.getList();
              })
              .finally(() => {
                this.buttonLoading = false;
              });
          }
        }
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
  }
}
/* 去除滚动条 */
::-webkit-scrollbar {
  display: none;
}
</style>
