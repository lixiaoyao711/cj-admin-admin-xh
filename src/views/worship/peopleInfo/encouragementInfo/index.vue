<template>
  <div class="main">
    <div class="user-info">
      <div class="header">
        <peopleTitle>光荣牌悬挂情况</peopleTitle>
        <el-button @click="openDialog('medalOfHonorDialogOpen')" size="mini">编 辑</el-button>
      </div>
      <peopleTable :tableData="medalOfHonor" :count="3" />
    </div>
    <div class="user-info">
      <div class="header">
        <peopleTitle>接受慰问情况</peopleTitle>
        <el-button @click="openDialog('condolenceReceivedDialogOpen', '', '新增接受慰问情况')" size="mini"
          >新 增</el-button
        >
      </div>
      <peopleTable :tableData="condolenceReceived" :tableProps="condolenceReceivedProps" :count="3">
        <template slot-scope="{ row }" slot="post">
          <el-button
            @click="openDialog('condolenceReceivedDialogOpen', row.id, '编辑接受慰问情况', 'condolenceReceivedId')"
            type="text"
            >编辑</el-button
          >
          <el-button type="text">
            <el-popconfirm @confirm="delFamily(row)" title="确定要删除吗?">
              <el-button slot="reference" type="text">删除</el-button>
            </el-popconfirm>
          </el-button>
        </template>
      </peopleTable>
    </div>
    <div class="user-info">
      <div class="header">
        <peopleTitle>荣誉激励情况</peopleTitle>
      </div>
      <div class="header">
        <div>受邀参加国家重要庆典和纪念活动情况</div>
        <el-button
          @click="
            openDialog('honorPenaltyDialogOpen', '', '新增受邀参加国家重要庆典和纪念活动情况', 'honorPenaltyId', 'H3')
          "
          size="mini"
          >新 增</el-button
        >
      </div>
      <peopleTable :tableData="honorPenalty1" :tableProps="honorPenaltyProps" :count="2">
        <template slot-scope="{ row }" slot="post">
          <el-button
            @click="
              openDialog(
                'honorPenaltyDialogOpen',
                row.id,
                '编辑受邀参加国家重要庆典和纪念活动情况',
                'honorPenaltyId',
                'H3'
              )
            "
            type="text"
            >编辑</el-button
          >
          <el-button type="text">
            <el-popconfirm @confirm="delFamily(row)" title="确定要删除吗?">
              <el-button slot="reference" type="text">删除</el-button>
            </el-popconfirm>
          </el-button>
        </template>
      </peopleTable>
      <div class="header">
        <div>受邀参加地方重要庆典和纪念活动情况</div>
        <el-button
          @click="
            openDialog('honorPenaltyDialogOpen', '', '新增受邀参加地方重要庆典和纪念活动情况', 'honorPenaltyId', 'H4')
          "
          size="mini"
          >新 增</el-button
        >
      </div>
      <peopleTable :tableData="honorPenalty2" :tableProps="honorPenaltyProps" :count="2">
        <template slot-scope="{ row }" slot="post">
          <el-button
            @click="
              openDialog(
                'honorPenaltyDialogOpen',
                row.id,
                '编辑受邀参加地方重要庆典和纪念活动情况',
                'honorPenaltyId',
                'H3'
              )
            "
            type="text"
            >编辑</el-button
          >
          <el-button type="text">
            <el-popconfirm @confirm="delFamily(row)" title="确定要删除吗?">
              <el-button slot="reference" type="text">删除</el-button>
            </el-popconfirm>
          </el-button>
        </template>
      </peopleTable>
      <div class="header">
        <div>受邀参加军队重大庆典和纪念活动情况</div>
        <el-button
          @click="
            openDialog('honorPenaltyDialogOpen', '', '新增受邀参加军队重大庆典和纪念活动情况', 'honorPenaltyId', 'H5')
          "
          size="mini"
          >新 增</el-button
        >
      </div>
      <peopleTable :tableData="honorPenalty3" :tableProps="honorPenaltyProps" :count="2">
        <template slot-scope="{ row }" slot="post">
          <el-button
            @click="
              openDialog(
                'honorPenaltyDialogOpen',
                row.id,
                '编辑受邀参加军队重大庆典和纪念活动情况',
                'honorPenaltyId',
                'H3'
              )
            "
            type="text"
            >编辑</el-button
          >
          <el-button type="text">
            <el-popconfirm @confirm="delFamily(row)" title="确定要删除吗?">
              <el-button slot="reference" type="text">删除</el-button>
            </el-popconfirm>
          </el-button>
        </template>
      </peopleTable>
      <div class="header">
        <div>其他荣誉</div>
        <el-button @click="openUpdatePersonExpandDialog('H6', null, '新增其他荣誉')" size="mini">新 增</el-button>
      </div>
      <peopleTable
        :tableData="expandChildTypes['H6'].tableData"
        :tableProps="expandChildTypes['H6'].tableProps"
        :count="2"
      >
        <template slot-scope="{ row }" slot="post">
          <el-button @click="openUpdatePersonExpandDialog('H6', row, '编辑其他荣誉')" type="text">编辑</el-button>
          <el-button type="text">
            <el-popconfirm @confirm="delPersonExpandRow(row)" title="确定要删除吗?">
              <el-button slot="reference" type="text">删除</el-button>
            </el-popconfirm>
          </el-button>
        </template>
      </peopleTable>
    </div>
    <div class="user-info">
      <div class="header">
        <peopleTitle>受邀参加爱国主义及国防教育活动情况</peopleTitle>
        <el-button
          @click="openDialog('specialCaseDialogOpen', '', '新增受邀参加爱国主义及国防教育活动情况', 'specialCaseId')"
          size="mini"
          >新 增</el-button
        >
      </div>
      <peopleTable :tableData="specialCase" :tableProps="specialCaseProps" :count="3">
        <template slot-scope="{ row }" slot="post">
          <el-button
            @click="
              openDialog('specialCaseDialogOpen', row.id, '编辑受邀参加爱国主义及国防教育活动情况', 'specialCaseId')
            "
            type="text"
            >编辑</el-button
          >
          <el-button type="text">
            <el-popconfirm @confirm="delFamily(row)" title="确定要删除吗?">
              <el-button slot="reference" type="text">删除</el-button>
            </el-popconfirm>
          </el-button>
        </template>
      </peopleTable>
    </div>
    <div class="user-info">
      <div class="header">
        <peopleTitle>褒扬宣传情况</peopleTitle>
        <el-button
          @click="openDialog('praisePropagandaDialogOpen', '', '新增褒扬宣传情况', 'praisePropagandaId')"
          size="mini"
          >新 增</el-button
        >
      </div>
      <peopleTable :tableData="praisePropaganda" :tableProps="praisePropagandaProps" :count="3">
        <template slot-scope="{ row }" slot="post">
          <el-button
            @click="openDialog('praisePropagandaDialogOpen', row.id, '编辑褒扬宣传情况', 'praisePropagandaId')"
            type="text"
            >编辑</el-button
          >
          <el-button type="text">
            <el-popconfirm @confirm="delFamily(row)" title="确定要删除吗?">
              <el-button slot="reference" type="text">删除</el-button>
            </el-popconfirm>
          </el-button>
        </template>
      </peopleTable>
    </div>
    <div class="user-info">
      <div class="header">
        <peopleTitle>公墓安葬意愿情况</peopleTitle>
        <el-button @click="openDialog('graveyardDialogOpen')" size="mini">编 辑</el-button>
      </div>
      <peopleTable :tableData="graveyard" :count="2" />
    </div>
    <medalOfHonorDialog
      v-if="medalOfHonorDialogOpen"
      :propsId="itemId.medalOfHonorId"
      :title="'光荣牌悬挂情况'"
      @success="getList"
      @close="medalOfHonorDialogOpen = false"
    />
    <condolenceReceivedDialog
      v-if="condolenceReceivedDialogOpen"
      :propsId="itemId.condolenceReceivedId"
      :title="title"
      @success="getList"
      @close="condolenceReceivedDialogOpen = false"
    />
    <honorPenaltyDialog
      v-if="honorPenaltyDialogOpen"
      :propsId="itemId.honorPenaltyId"
      :title="title"
      @success="getList"
      :expandChildType="getType"
      @close="honorPenaltyDialogOpen = false"
    />
    <specialCaseDialog
      v-if="specialCaseDialogOpen"
      :propsId="itemId.specialCaseId"
      :title="title"
      @success="getList"
      @close="specialCaseDialogOpen = false"
    />
    <praisePropagandaDialog
      v-if="praisePropagandaDialogOpen"
      :propsId="itemId.praisePropagandaId"
      :title="title"
      @success="getList"
      @close="praisePropagandaDialogOpen = false"
    />
    <graveyardDialog
      v-if="graveyardDialogOpen"
      :propsId="itemId.graveyardId"
      :title="'公墓安葬意愿情况'"
      @success="getList"
      @close="graveyardDialogOpen = false"
    />
    <UpdatePersonExpandDialog
      v-if="dialogOpen"
      :visible.sync="dialogOpen"
      ref="updateDialog"
      v-bind="dialogProps"
      @submit="onSubmit"
    >
    </UpdatePersonExpandDialog>
  </div>
</template>

<script>
import peopleTable from '@/views/worship/peopleInfo/common/peopleTable/index';
import peopleTitle from '@/views/worship/peopleInfo/common/title/index';
import { personExpandPersonExpandList, delPersonExpand } from '@/api/worship/retiredSoldier';
import medalOfHonorDialog from './dialog/medalOfHonorDialog.vue';
import condolenceReceivedDialog from './dialog/condolenceReceivedDialog.vue';
import honorPenaltyDialog from './dialog/honorPenaltyDialog.vue';
import specialCaseDialog from './dialog/specialCaseDialog.vue';
import praisePropagandaDialog from './dialog/praisePropagandaDialog.vue';
import graveyardDialog from './dialog/graveyardDialog.vue';
// 拓展信息通用弹框
import UpdatePersonExpandDialog from '@/views/worship/serviceFamilyInfo/common/UpdatePersonExpandDialog.vue';
export default {
  props: {},
  components: {
    peopleTable,
    peopleTitle,
    medalOfHonorDialog,
    condolenceReceivedDialog,
    honorPenaltyDialog,
    specialCaseDialog,
    praisePropagandaDialog,
    graveyardDialog,
    UpdatePersonExpandDialog,
  },
  data() {
    return {
      medalOfHonorDialogOpen: false,
      condolenceReceivedDialogOpen: false,
      honorPenaltyDialogOpen: false,
      specialCaseDialogOpen: false,
      praisePropagandaDialogOpen: false,
      graveyardDialogOpen: false,
      itemId: {
        medalOfHonorId: '',
        condolenceReceivedId: '',
        honorPenaltyId: '',
        specialCaseId: '',
        praisePropagandaId: '',
        graveyardId: '',
      },
      medalOfHonor: [
        {
          name: '光荣牌悬挂情况',
          value: '',
          type: 'text',
        },
        {
          name: '申请悬挂时间',
          value: '',
          type: 'text',
        },
        {
          name: '悬挂地址',
          value: '',
          type: 'text',
        },
        {
          name: '悬挂时间',
          value: '',
          type: 'text',
        },
        {
          name: '是否取消',
          value: '',
          type: 'text',
        },
        {
          name: '是否更换',
          value: '',
          type: 'text',
        },
        {
          name: '更换时间',
          value: '',
          type: 'text',
        },
      ],
      condolenceReceived: [],
      condolenceReceivedProps: [
        {
          label: '慰问时间',
          prop: 'condolenceTime',
        },
        {
          label: '慰问方式',
          prop: 'condolenceMethods',
        },
        {
          label: '慰问单位',
          prop: 'condolenceUnit',
        },
        {
          label: '操作',
          prop: 'post',
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
      getType: '',
      honorPenalty1: [],
      honorPenalty2: [],
      honorPenalty3: [],
      honorPenalty4: [],
      honorPenaltyProps: [
        {
          label: '时间',
          prop: 'time',
        },
        {
          label: '活动名称',
          prop: 'activityName',
        },
        {
          label: '备注',
          prop: 'msg',
        },
        {
          label: '操作',
          prop: 'post',
        },
      ],
      honorPenaltyProps1: [
        {
          label: '其他荣誉激励情形',
          prop: 'otherSituation',
        },
        {
          label: '纳入地方志情况',
          prop: 'includedChorography',
        },
      ],
      specialCase: [],
      specialCaseProps: [
        {
          label: '活动类型',
          prop: 'activityType',
        },
        {
          label: '活动名称',
          prop: 'activityName',
        },
        {
          label: '邀请单位',
          prop: 'invitationUnit',
        },
        {
          label: '时间',
          prop: 'time',
        },
        {
          label: '备注',
          prop: 'msg',
        },
        {
          label: '操作',
          prop: 'post',
        },
      ],
      praisePropaganda: [],
      praisePropagandaProps: [
        {
          label: '宣传方式',
          prop: 'promotionMethods',
        },
        {
          label: '宣传内容',
          prop: 'promotionContent',
        },
        {
          label: '宣传媒体',
          prop: 'propagandaMedia',
        },
        {
          label: '时间',
          prop: 'time',
        },
        {
          label: '备注',
          prop: 'msg',
        },
        {
          label: '操作',
          prop: 'post',
        },
      ],
      graveyard: [
        {
          name: '是否符合条件',
          value: '',
          type: 'text',
        },
        {
          name: '是否愿意申请军人公墓',
          value: '',
          type: 'text',
        },
      ],
      // NEW UPDATE
      expandParentType: 'H',
      expandChildTypes: {
        //拓展信息子类型
        H6: {
          type: 'H6',
          name: '其他荣誉',
          tableProps: [
            {
              label: '其他荣誉激励情形',
              prop: 'otherSituation',
            },
            {
              label: '纳入地方志情况',
              prop: 'includedChorography',
            },
            {
              label: '操作',
              prop: 'post',
            },
          ],
          tableData: [],
          tableLen: 2,
          data: {
            // 默认拓展信息
            expandParentType: 'H',
            expandChildType: 'H6',
            expandContent: {
              otherSituation: '',
              includedChorography: '',
            },
            personId: this.$route.params.id,
          },
          formOptions: [
            {
              label: '其他荣誉激励情形',
              prop: 'otherSituation',
              type: 'text',
              $attrs: {},
            },
            {
              label: '纳入地方志情况',
              prop: 'includedChorography',
              type: 'text',
              $attrs: {
                type: 'textarea',
                showWordLimit: true,
                maxlength: 500,
              },
            },
          ],
        },
      },
      dialogOpen: false, //弹框打开
      resData: '', //帮扶结果
      dialogProps: {
        expandChildType: '', //拓展信息子类型
        title: '编辑', //弹框标题
        colCount: 2,
        expandChildData: {}, //拓展信息表单内容
        formOptions: [], //拓展信息表单配置
        formRules: {},
      },
    };
  },
  computed: {},
  watch: {},
  created() {
    this.getList();
    this.getAllExpandChildData();
  },
  mounted() {},
  methods: {
    openDialog(type, id = '', title = '', idType = '', getType = '') {
      this.itemId[idType] = id;
      this.getType = getType;
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
    getList() {
      personExpandPersonExpandList({
        expandParentType: 'H',
        personId: this.$route.params.id,
      }).then((response) => {
        const data = response.rows.map((item) => {
          item.expandContent = JSON.parse(item.expandContent);
          return item;
        });
        console.log('personExpandPersonExpandList', data);
        // 光荣牌悬挂情况
        const medalOfHonorData = data.find((item) => item.expandChildType === 'H1');
        if (medalOfHonorData) {
          this.itemId.medalOfHonorId = medalOfHonorData.id;
          this.medalOfHonor = [
            {
              name: '光荣牌悬挂情况',
              value: medalOfHonorData.expandContent.suspensionSituation,
              type: 'text',
            },
            {
              name: '申请悬挂时间',
              value: medalOfHonorData.expandContent.applicationTime,
              type: 'text',
            },
            {
              name: '悬挂地址',
              value: medalOfHonorData.expandContent.hangingAddress,
              type: 'text',
            },
            {
              name: '悬挂时间',
              value: medalOfHonorData.expandContent.suspensionTime,
              type: 'text',
            },
            {
              name: '是否取消',
              value: medalOfHonorData.expandContent.cancelOrNot,
              type: 'text',
            },
            {
              name: '是否更换',
              value: medalOfHonorData.expandContent.replaceOrNot,
              type: 'text',
            },
            {
              name: '更换时间',
              value: medalOfHonorData.expandContent.replacementTime,
              type: 'text',
            },
          ];
        }
        // 接受慰问情况
        const condolenceReceivedData = data.filter((item) => item.expandChildType === 'H2');
        if (condolenceReceivedData) {
          this.condolenceReceived = condolenceReceivedData.map((item) => {
            return {
              ...item.expandContent,
              id: item.id,
            };
          });
        }
        // 荣誉激励情况
        const honorPenaltyData1 = data.filter((item) => item.expandChildType === 'H3');
        const honorPenaltyData2 = data.filter((item) => item.expandChildType === 'H4');
        const honorPenaltyData3 = data.filter((item) => item.expandChildType === 'H5');
        const honorPenaltyData4 = data.filter((item) => item.expandChildType === 'H6');
        if (honorPenaltyData1) {
          this.itemId.honorPenaltyId1 = honorPenaltyData1.id;
          this.honorPenalty1 = honorPenaltyData1.map((item) => {
            return {
              ...item.expandContent,
              id: item.id,
            };
          });
        }
        if (honorPenaltyData2) {
          this.itemId.honorPenaltyId2 = honorPenaltyData2.id;
          this.honorPenalty2 = honorPenaltyData2.map((item) => {
            return {
              ...item.expandContent,
              id: item.id,
            };
          });
        }
        if (honorPenaltyData3) {
          this.itemId.honorPenaltyId3 = honorPenaltyData3.id;
          this.honorPenalty3 = honorPenaltyData3.map((item) => {
            return {
              ...item.expandContent,
              id: item.id,
            };
          });
        }
        if (honorPenaltyData4) {
          this.itemId.honorPenaltyId4 = honorPenaltyData4.id;
          this.honorPenalty4 = honorPenaltyData4.map((item) => {
            return {
              ...item.expandContent,
              id: item.id,
            };
          });
        }
        // 受邀参加爱国主义及国防教育活动情况
        const specialCaseData = data.filter((item) => item.expandChildType === 'H7');
        if (specialCaseData) {
          this.specialCase = specialCaseData.map((item) => {
            return {
              ...item.expandContent,
              id: item.id,
            };
          });
        }
        // 褒扬宣传情况
        const praisePropagandaData = data.filter((item) => item.expandChildType === 'H8');
        if (praisePropagandaData) {
          this.itemId.praisePropagandaId = praisePropagandaData.id;
          this.praisePropaganda = praisePropagandaData.map((item) => {
            return {
              ...item.expandContent,
              id: item.id,
            };
          });
        }
        // 公墓安葬意愿情况
        const graveyardData = data.find((item) => item.expandChildType === 'H9');
        if (graveyardData) {
          this.graveyard = [
            {
              name: '是否符合条件',
              value: graveyardData.expandContent.whetherItMeetsConditions,
              type: 'text',
            },
            {
              name: '是否愿意申请军人公墓',
              value: graveyardData.expandContent.militaryCemetery,
              type: 'text',
            },
          ];
        }
      });
    },
    expendChildDataByType(expendChildType, list, length = 1) {
      // console.log(expendChildType, length);
      //length = 1 表单扩展 ; length > 1 表示多行表格扩展
      //根据expendChildType获取拓展子类数据
      if (!length || length == 1) {
        return list.find((item) => {
          if (item.expandChildType === expendChildType) {
            return item;
          }
        });
      } else {
        let typeArr = list.filter((item) => item.expandChildType === expendChildType);
        typeArr.map((i) => {
          Object.assign(i, i.expandContent);
        });
        return typeArr;
      }
    },
    async getAllExpandChildData() {
      let response = await personExpandPersonExpandList({
        expandParentType: 'H',
        personId: this.$route.params.id,
      });
      console.log('getAllExpandChildData', response);
      const expandDataList = response.rows.map((item) => {
        item.expandContent = JSON.parse(item.expandContent);
        return item;
      });
      for (let key in this.expandChildTypes) {
        let itemData = this.expendChildDataByType(key, expandDataList, this.expandChildTypes[key].tableLen);
        console.log(key, itemData);
        if (itemData) {
          //该子类拓展信息有数据
          if (this.expandChildTypes[key].tableLen == 1) {
            let expandContent = itemData.expandContent;
            this.expandChildTypes[key].tableData.forEach((column) => {
              if (['tag'].includes(column.type) && typeof expandContent[column.prop] == 'string') {
                let arr = expandContent[column.prop].split(',').filter((item) => item);
                column.value = arr;
              } else {
                if (Array.isArray(expandContent[column.prop])) {
                  column.value = expandContent[column.prop].filter((item) => item);
                } else {
                  column.value = expandContent[column.prop];
                }
              }
              console.log(column);
            });
            this.expandChildTypes[key]['data'] = itemData;
            console.log('tableLen==1', this.expandChildTypes[key]['data']);
          } else {
            this.expandChildTypes[key].tableData = [];
            this.expandChildTypes[key].tableData = itemData;
          }
        }
        console.log(key, this.expandChildTypes[key], this.expandChildTypes[key].tableData);
        console.log('所有子类拓展信息配置: expandChildTypes', this.expandChildTypes);
      }
    },
    initDialogContent(expandChildType, rowData) {
      this.dialogProps.expandChildType = expandChildType; //拓展子信息
      this.dialogProps.formOptions = this.expandChildTypes[expandChildType].formOptions;
      this.dialogProps.expandChildData = rowData
        ? rowData
        : JSON.parse(JSON.stringify(this.expandChildTypes[expandChildType]['data']));
    },
    openUpdatePersonExpandDialog(expandChildType, rowData, dialogTitle) {
      //编辑弹框
      this.initDialogContent(expandChildType, rowData);
      console.log('openDialog', this.expandChildTypes[expandChildType]);
      //编辑弹框标题
      this.dialogProps.title = dialogTitle || '编辑' + this.expandChildTypes[expandChildType].name;
      console.log(this.dialogProps, this.expandChildTypes);
      this.dialogOpen = true;
    },
    onSubmit(dialog, result) {
      console.log(dialog, result);
      if (result.code == 200) {
        this.$modal.msgSuccess('成功');
      } else {
        this.$modal.msgError(result.msg || '失败');
      }
      this.getAllExpandChildData();
      this.dialogOpen = false;
    },
    delPersonExpandRow(row) {
      delPersonExpand(row.id).then((res) => {
        if (res.code === 200) {
          this.$modal.msgSuccess('删除成功');
          this.getAllExpandChildData();
        } else {
          this.$modal.msgError(res.msg);
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
      margin: 10px 0 0 0;
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
