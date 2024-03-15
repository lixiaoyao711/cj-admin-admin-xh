<template>
  <!-- 退役军人-帮扶援助信息 -->
  <div class="main">
    <div class="user-info">
      <div class="header">
        <peopleTitle>政策保障情况</peopleTitle>
        <el-button @click="openDialog('policyGuaranteeDialogOpen')" size="mini">编 辑</el-button>
      </div>
      <peopleTable :tableData="policyGuarantee" :count="3" />
    </div>
    <div class="user-info">
      <div class="header">
        <peopleTitle>困难情况</peopleTitle>
        <!-- <el-button @click="openDialog('difficultSituationDialogOpen')" size="mini">编 辑</el-button> -->
      </div>
      <peopleTable :tableData="difficultSituation" :count="3" />
    </div>
    <div class="user-info">
      <div class="header">
        <peopleTitle>帮扶情况</peopleTitle>
        <el-button @click="openDialog('honorPenaltyDialogOpen', '', '新增帮扶情况', 'honorPenaltyId')" size="mini"
          >新 增</el-button
        >
      </div>
      <peopleTable :tableData="honorPenalty" :tableProps="honorPenaltyProps" :count="2">
        <template slot-scope="{ row }" slot="post">
          <el-button @click="openDialog('honorPenaltyDialogOpen', row.id, '编辑帮扶情况', 'honorPenaltyId')" type="text"
            >编辑</el-button
          >
          <el-button type="text">
            <el-popconfirm @confirm="delFamily(row)" title="确定要删除吗?">
              <el-button slot="reference" type="text">删除</el-button>
            </el-popconfirm>
          </el-button>
        </template>
      </peopleTable>
      <div class="res">
        <span>帮扶结果: {{ assistanceResults }}</span>
        <el-button
          @click="openDialog('assistanceResultOpen', itemId.resDataId, '编辑帮扶结果', 'resDataId')"
          type="text"
          F
          >编辑</el-button
        >
      </div>
    </div>
    <div class="user-info">
      <div class="header">
        <peopleTitle>困难走访</peopleTitle>
      </div>
      <peopleTable :tableData="specialCase" :tableProps="specialCaseProps" :count="3">
        <template slot-scope="{ row }" slot="post">
          <el-button @click="openDialog('specialCaseDialogOpen', row.id, '编辑困难走访', 'specialCaseId')" type="text"
            >编辑</el-button
          >
          <el-button type="text">
            <el-popconfirm @confirm="delSpecialCase(row)" title="确定要删除吗?">
              <el-button slot="reference" type="text">删除</el-button>
            </el-popconfirm>
          </el-button>
        </template>
      </peopleTable>
    </div>
    <policyGuaranteeDialog
      v-if="policyGuaranteeDialogOpen"
      :propsId="itemId.policyGuaranteeId"
      :title="'政策保障情况'"
      @success="getList"
      @close="policyGuaranteeDialogOpen = false"
    />
    <difficultSituationDialog
      v-if="difficultSituationDialogOpen"
      :propsId="itemId.difficultSituationId"
      :title="'困难情况'"
      @success="getList"
      @close="difficultSituationDialogOpen = false"
    />
    <honorPenaltyDialog
      v-if="honorPenaltyDialogOpen"
      :propsId="itemId.honorPenaltyId"
      :title="title"
      @success="getList"
      @close="honorPenaltyDialogOpen = false"
    />
    <specialCaseDialog
      v-if="specialCaseDialogOpen"
      :propsId="itemId.specialCaseId"
      :title="title"
      @success="getVisitingList"
      @close="specialCaseDialogOpen = false"
    />

    <el-dialog title="编辑帮扶结果" :visible.sync="assistanceResultOpen" destroy-on-close width="600px">
      <el-form ref="I4_form" :model="I4_formData.expandContent" label-width="170px">
        <el-form-item label="帮扶结果：" prop="assistanceResults">
          <el-radio-group v-model="I4_formData.expandContent.assistanceResults">
            <el-radio v-for="(item, index) in resultOptions" :key="index" :label="item">{{ item }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="assistanceResultOpen = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import peopleTable from '@/views/worship/peopleInfo/common/peopleTable/index';
import peopleTitle from '@/views/worship/peopleInfo/common/title/index';
import { personExpandPersonExpandList, delPersonExpand } from '@/api/worship/retiredSoldier';
import policyGuaranteeDialog from './dialog/policyGuaranteeDialog.vue';
import difficultSituationDialog from './dialog/difficultSituationDialog.vue';
import honorPenaltyDialog from './dialog/honorPenaltyDialog.vue';
import specialCaseDialog from './dialog/specialCaseDialog.vue';
import { listVisiting, delVisiting } from '@/api/worship/visiting';
import { getPersonExpandById, addPersonExpand, updatePersonExpand } from '@/api/worship/retiredSoldier';

export default {
  props: {},
  components: {
    peopleTable,
    peopleTitle,
    policyGuaranteeDialog,
    difficultSituationDialog,
    honorPenaltyDialog,
    specialCaseDialog,
  },
  data() {
    return {
      policyGuaranteeDialogOpen: false,
      difficultSituationDialogOpen: false,
      honorPenaltyDialogOpen: false,
      specialCaseDialogOpen: false,
      assistanceResultOpen: false, //帮扶结果
      itemId: {
        policyGuaranteeId: '',
        difficultSituationId: '',
        honorPenaltyId: '',
        specialCaseId: '',
        resDataId: '',
      },
      policyGuarantee: [
        {
          name: '享受政策情况',
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
      ],
      difficultSituation: [
        {
          name: '疑似困难入库时间',
          value: '',
          type: 'text',
        },
        {
          name: '民政认定困难类型',
          value: '',
          type: 'text',
        },
        {
          name: '转入困难时间',
          value: '',
          type: 'text',
        },
        {
          name: '核实困难类型',
          value: '',
          type: 'text',
        },
        {
          name: '困难情况说明',
          value: '',
          type: 'text',
        },
      ],
      honorPenalty: [],
      honorPenaltyProps: [
        {
          label: '帮扶日期',
          prop: 'assistanceDate',
        },
        {
          label: '帮扶措施',
          prop: 'assistanceMeasures',
        },
        {
          label: '操作',
          prop: 'post',
        },
      ],
      specialCase: [],
      specialCaseProps: [
        {
          label: '困难原因',
          prop: 'difficultReason',
        },
        {
          label: '帮扶内容',
          prop: 'content',
        },
        {
          label: '帮扶人',
          prop: 'visitPersonName',
        },
        {
          label: '帮扶人电话',
          prop: 'visitPersonPhone',
        },
        {
          label: '帮扶时间',
          prop: 'visitTime',
        },
        // {
        //   label: '操作',
        //   prop: 'post',
        // },
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
      assistanceResults: '', // 帮扶结果
      I4_formData: {
        //帮扶结果
        expandChildType: 'I4',
        expandParentType: 'I',
        expandContent: {
          assistanceResults: '',
        },
      },
      title: '',
      resultOptions: ['已脱困', '未脱困'],
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.getList();
    this.getVisitingList();
  },
  methods: {
    submitForm() {
      this.$refs['I4_form'].validate((val) => {
        if (val) {
          let formData = JSON.parse(JSON.stringify(this.I4_formData));
          formData.expandContent = JSON.stringify(formData.expandContent);
          formData.personId = this.$route.params.id;
          if (formData.id) {
            updatePersonExpand(formData).then((res) => {
              this.$message.success('修改成功');
              this.assistanceResultOpen = false;
              this.getList();
            });
          } else {
            addPersonExpand(formData).then((res) => {
              this.$message.success('添加成功');
              this.assistanceResultOpen = false;
              this.getList();
            });
          }
        }
      });
    },
    openDialog(type, id = '', title = '', idType = '') {
      this.itemId[idType] = id;
      this.title = title;
      this[type] = true;
    },
    delFamily(row) {
      console.log(row);
      delPersonExpand(row.id).then((response) => {
        this.$modal.msgSuccess('删除成功');
        this.getList();
      });
    },
    delSpecialCase(row) {
      console.log(row);
      delVisiting(row.id).then((response) => {
        this.$modal.msgSuccess('删除成功');
        this.getVisitingList();
      });
    },
    getVisitingList() {
      listVisiting({
        pageNum: 1,
        pageSize: 99999,
        personId: this.$route.params.id,
        visitType: '5',
      }).then((response) => {
        console.log('listVisiting', response);
        this.specialCase = response.rows;
      });
    },
    getList() {
      personExpandPersonExpandList({
        expandParentType: 'I',
        personId: this.$route.params.id,
      }).then((response) => {
        const data = response.rows.map((item) => {
          item.expandContent = JSON.parse(item.expandContent);
          return item;
        });
        console.log('personExpandPersonExpandList', data);
        // 政策保障情况
        const policyGuaranteeData = data.find((item) => item.expandChildType === 'I1');
        if (policyGuaranteeData) {
          this.itemId.policyGuaranteeId = policyGuaranteeData.id;
          this.policyGuarantee = [
            {
              name: '享受政策情况',
              value: policyGuaranteeData.expandContent.policySituation,
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
          ];
        }
        console.log('🚀 ~ 政策保障情况 ~ policyGuaranteeData:', this.policyGuarantee);
        // 困难情况
        const difficultSituationData = data.find((item) => item.expandChildType === 'I2');
        console.log('🚀 ~ 困难情况 ~ difficultSituationData:', difficultSituationData);
        if (difficultSituationData) {
          this.itemId.difficultSituationId = difficultSituationData.id;
          console.log('difficultSituationData', difficultSituationData);
          this.difficultSituation = [
            {
              name: '疑似困难入库时间',
              value: difficultSituationData.expandContent?.warehousingTime || '',
              type: 'text',
            },
            {
              name: '民政认定困难类型',
              value: difficultSituationData.expandContent.difficultyType || [],
              type: 'tag',
            },
            {
              name: '核实困难类型',
              value: difficultSituationData.expandContent.verifyTypeDifficulty || [],
              type: 'text',
            },
            {
              name: '转入困难时间',
              value: difficultSituationData.expandContent.transferTime || '',
              type: 'text',
            },
            {
              name: '困难情况说明',
              value: difficultSituationData.expandContent.explanationDifficulties || '',
              type: 'text',
            },
          ];
        }
        // 帮扶情况
        const honorPenaltyData = data.filter((item) => item.expandChildType === 'I3');
        console.log('🚀 ~ 帮扶情况 ~ honorPenaltyData:', honorPenaltyData);
        if (honorPenaltyData) {
          this.honorPenalty = honorPenaltyData.map((item) => {
            return {
              ...item.expandContent,
              id: item.id,
            };
          });
        }
        // 帮扶结果
        const I4_data = data.find((item) => item.expandChildType === 'I4');
        console.log('🚀 ~ 帮扶结果 :', I4_data);
        if (I4_data) {
          this.itemId.resDataId = I4_data.id;
          this.I4_formData = JSON.parse(JSON.stringify(I4_data));
          this.assistanceResults = I4_data.expandContent.assistanceResults;
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
    .title {
      margin: 10px 0 0 0;
    }
  }
  .res {
    padding: 10px;
    box-sizing: border-box;
    .el-button {
      margin: 0 0 0 10px;
    }
  }
}
/* 去除滚动条 */
::-webkit-scrollbar {
  display: none;
}
</style>
