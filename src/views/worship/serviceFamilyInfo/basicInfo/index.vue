<!-- 现役军人家属人员详情 -->
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
    <!-- 基本信息-修改弹窗 -->
    <BasicInfoEditDialog
      :propsId="$route.params.id"
      v-if="basicInfoOpen"
      @success="getList"
      @close="basicInfoOpen = false"
    />
    <!-- 工作专班-修改弹窗 -->
    <WorkInfoEditDialog
      :propsId="itemId.workInfoId"
      v-if="workInfoOpen"
      @success="getList"
      @close="workInfoOpen = false"
    />
    <!-- 家庭成员信息-修改弹窗 -->
    <FamilyRelationshipDialog
      :propsId="getId"
      :title="title"
      v-if="familyRelationshipOpen"
      @success="getList"
      @close="familyRelationshipOpen = false"
    />
  </div>
</template>

<script>
import peopleTable from '@/views/worship/peopleInfo/common/peopleTable/index';
import peopleTitle from '@/views/worship/peopleInfo/common/title/index';
import BasicInfoEditDialog from './dialog/basicInfoEditDialog.vue';
import WorkInfoEditDialog from '@/views/worship/peopleInfo/basicInfo/dialog/workInfoEditDialog.vue';
import FamilyRelationshipDialog from './dialog/familyRelationshipDialog.vue';

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
    WorkInfoEditDialog,
    FamilyRelationshipDialog,
  },
  dicts: [
    'sys_worship_educationlevel',
    'sys_worship_personneltype',
    'sys_worship_militaryrank',
    'sys_worship_personneltag',
    'sys_worship_ethnicgroup',
    'sys_0_1',
  ],
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
          label: '与现役军人关系',
          prop: 'relationship',
        },
        {
          label: '姓名',
          prop: 'name',
        },
        {
          label: '身份证号',
          prop: 'idCard',
        },
        {
          label: '应征地',
          prop: 'landAcquisition',
        },
        {
          label: '军队驻地',
          prop: 'armyBase',
        },
        {
          label: '军人类别',
          prop: 'militaryCategory',
        },
        {
          label: '军衔等级',
          prop: 'rankLevel',
        },
        {
          label: '操作',
          prop: 'post',
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
    };
  },
  computed: {},
  watch: {},
  created() {
    this.getList();
  },
  mounted() {},
  methods: {
    getBasicPerson() {
      // 获取基本信息
      getBasicPerson(this.$route.params.id).then((response) => {
        const data = response.data;
        console.log('🚀 ~ getBasicPerson ~ data:', data);
        let idCardValidity = ''; //身份证有效期
        if (!data.idCardStartTime && !data.idCardEndTime) {
          idCardValidity = '';
        } else {
          let idCardStartTime = this.parseTime(data.idCardStartTime, '{y}-{m}-{d}');
          let idCardEndTime = this.parseTime(data.idCardEndTime, '{y}-{m}-{d}');
          idCardValidity = data.longTerm === '1' ? idCardStartTime : idCardStartTime + '--' + idCardEndTime;
        }
        data.personnelTags = SelectValueToLabel(this.$store.state.user.peoPleTagList, data.personnelTags);
        console.log('🚀 ~ getBasicPerson ~ data.personnelTags:', data.personnelTags);
        this.basicInfo = [
          {
            name: '姓名',
            value: data.name || '',
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
            dict: 'sys_worship_facetype',
            type: 'dict',
          },
          {
            name: '婚姻状况',
            value: data.maritalStatus,
            type: 'text',
          },
          {
            name: '健康状况',
            value: data.health,
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
            value: data.personnelTags,
            type: 'text',
          },
          {
            name: '是否随军',
            value: data.accompanyingStatus == '1' ? '是' : '否',
            type: 'text',
          },
          {
            name: '是否安置',
            value: data.placementStatus == '1' ? '是' : '否',
            type: 'text',
          },
        ];
        // console.log('获取基本信息', data, this.basicInfo);
      });
    },
    getList() {
      let self = this;
      this.getBasicPerson();
      personExpandPersonExpandList({
        expandParentType: 'A', //基本信息拓展
        personId: this.$route.params.id,
      }).then((response) => {
        const data = response.rows.map((item) => {
          item.expandContent = JSON.parse(item.expandContent);
          return item;
        });
        console.log('personExpandPersonExpandList:基本信息', data);
        //工作专班
        const workData = data.find((item) => item.expandChildType === 'A1');
        if (workData) {
          // this.workInfoId = workData.id;
          this.itemId.workInfoId = workData.id;
          workData.expandContent.specialPerson = workData.expandContent.specialPerson.split(',');
          workData.expandContent.specialPhone = workData.expandContent.specialPhone.split(',');
          console.log('🚀 ~ 工作专班:', workData);
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
          this.familyRelationship = familyRelationshipData.map((item) => {
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
          console.log('submitForm', form);
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
