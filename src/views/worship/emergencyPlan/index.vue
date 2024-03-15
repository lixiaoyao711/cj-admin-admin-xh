<!-- emergencyPlan -->
<!-- createTime : 2023-11-04 -->
<template>
  <div class="app-container">
    <div class="header">应急预案</div>
    <el-tabs v-model="activeTabName" @tab-click="handleClick">
      <el-tab-pane v-for="(tabItem, index) in tabs" :label="tabItem.label" :name="index.toString()">
        <CrudTable v-bind="tableConfigList[tabItem.label]" :dicts="dictsMap" :key="tabItem.label"></CrudTable>
      </el-tab-pane>
    </el-tabs>
    <el-dialog
      title="预案详情"
      :visible.sync="infoDialogVisible"
      append-to-body
      width="800px"
      @close="handleDialogClose"
    >
      <div v-if="infoDialogVisible && rowData" class="info-container">
        <div class="data-item" v-show="rowData.personName">
          <span class="label">有关重点人员: </span>
          <div class="data-container">{{ rowData.personName }}</div>
        </div>
        <div class="data-item">
          <span class="label">上传文件: </span>
          <div class="data-container">
            <FileUpload :isView="true" v-model="rowData.fileUrl"></FileUpload>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'emergencyPlan',
};
</script>
<script setup>
import CrudTable from '@/components/CrudTable/CrudTable.vue';
import { ref, onMounted, computed, getCurrentInstance, h } from 'vue';
import { list, get, add, update, del, exportList } from '@/api/worship/emergencyPlan.js';
import { listData } from '@/api/system/dict/data'; //根据字典类型值获取字典数据列表
import { listBasicPerson } from '@/api/worship/basicPerson.js'; //获取重点人员列表({whetherToFocusOnGroups: '1'})
import store from '@/store';
import { Message } from 'element-ui';
const props = defineProps({
  data: Object,
});
//const emit = defineEmits(['update:data'])
const { proxy } = getCurrentInstance();
const selectPersonOptions = ref([]);
// 获取重点人员下拉选择数据
async function getSelectPersonList() {
  let dataList = [];
  let res = await listBasicPerson({ whetherToFocusOnGroups: '1' });
  if (res.code === 200 && res.rows) {
    dataList = res.rows;
  }
  console.log('getSelectPersonList', dataList);
  return dataList;
}
getSelectPersonList().then((data) => {
  selectPersonOptions.value = data;
});

const activeTabName = ref('0');
const infoDialogVisible = ref(false);
const rowData = ref(null);
const handleClick = (tab) => {
  console.log(tab, proxy.$router.currentRoute);
  activeTabName.value = tab.name;
};
const tabs = ref([
  {
    label: '重点人员劝返应急预案',
    name: 0,
  },
  {
    label: '预案审核',
    name: 1,
  },
  {
    label: '辖区信访稳定工作应急预案',
    name: 2,
  },
]);
const exportUrl = 'worship/emergencyPlan/export';
// 字典
const dicts = ref([]);
const dictsMap = ref({}); //字典映射
const initDict = ref(false);
/** 查询字典下拉列表 */
async function getDictData(dictTypes, dict = {}) {
  if (Array.isArray(dictTypes)) {
    for (let type of dictTypes) {
      let res = await listData({ dictType: type });
      let result = res.rows ? res.rows : [];
      if (result.length > 0) {
        dict[type] = result;
      }
      // console.log(type, result);
    }
  }
  // console.log(dict);
}
const getDictLabelByDictValue = (dictsMap, type, value) => {
  let label = '';
  if (dictsMap[type] && dictsMap[type].length > 0) {
    for (let i = 0; i < dictsMap[type].length; i++) {
      if (dictsMap[type][i].dictValue == value) {
        label = dictsMap[type][i].dictLabel;
        break;
      }
    }
  }
  return label;
};

// 显示详情
function showInfo(data) {
  rowData.value = data;
  infoDialogVisible.value = true;
}
function handleDialogClose() {
  rowData.value = null;
}
// 表格配置
const tableConfigList = ref({
  重点人员劝返应急预案: {
    title: '预案列表',
    tableOptions: {
      attributes: {
        selection: false,
      },
      topOperations: {
        add: {
          text: '上传',
          attributes: {
            'v-hasPermi': ['worship:emergencyPlan:add'],
          },
        },
        export: {
          component: 'el-button',
          text: '导出',
          attributes: {
            'v-hasPermi': ['worship:emergencyPlan:export'],
          },
        },
      },
    },
    searchOption: {
      show: true,
      component: 'el-form',
      options: {
        model: {
          divisionCode: null,
          keyWord: '',
        },
        attributes: {}, // element-ui attributes
        items: [
          {
            component: 'TreeSelectDivision',
            prop: 'divisionCode',
            label: '行政区划',
            slot: null,
          },
          {
            component: 'el-select',
            prop: 'state',
            label: '状态',
            options: [
              {
                label: '待审核',
                value: 0,
              },
              {
                label: '已通过',
                value: 1,
              },
              {
                label: '已驳回',
                value: 2,
              },
            ],
            slot: null,
          },
          {
            component: 'el-input',
            prop: 'keyWord',
            label: '关键字',
            slot: null,
            attributes: {
              clearable: true,
            },
          },
        ],
      },
    },
    columns: [
      {
        type: 'string',
        component: 'FileUpload',
        hideInForm: true,
        label: '预案文件',
        prop: 'fileUrl',
        required: false,
        attributes: {
          limit: 2,
        },
      },
      {
        type: 'string',
        component: 'FileUpload',
        hideInTable: true,
        label: '预案文件',
        prop: 'fileUrl',
        required: true,
        rule: [{ required: true, message: '请上传文件', trigger: ['change'] }],
        attributes: {
          limit: 2,
          fileType: ['doc', 'docx', , 'pdf', 'xls', 'xlsx', 'png', 'jpg', 'jpeg'],
        },
      },
      {
        type: 'string',
        component: 'KeyPersonSelect',
        label: '涉及重点人员',
        hideInTable: true,
        prop: 'personId',
        optionLabel: 'name',
        required: true,
        optionsSource: selectPersonOptions,
        attributes: {},
      },
      {
        type: 'string',
        component: '',
        hideInForm: true,
        label: '涉及重点人员',
        prop: 'personName',
        required: true,
        attributes: {},
      },
      {
        type: 'string',
        component: '',
        label: '联系方式',
        prop: 'phone',
        required: true,
        attributes: {
          placeholder: '请输入',
        },
      },
      {
        component: 'TreeSelectDivision',
        hideInForm: true,
        hideInTable: true,
        label: '行政区划Code',
        prop: 'divisionCode',
        required: true,
        defaultValue: store.state.user.divisionCode,
      },
      {
        component: null,
        hideInForm: true,
        label: '行政区划',
        prop: 'divisionName',
        required: true,
        defaultValue: store.state.user.divisionName,
      },
      {
        component: null,
        hideInForm: true,
        label: '上传人',
        prop: 'createName',
        required: false,
      },
      {
        component: '',
        hideInForm: true,
        label: '状态',
        prop: 'state',
        required: false,
        defaultValue: '0',
        valueFormatInTable(data) {
          let map = {
            0: '待审核',
            1: '已通过',
            2: '已驳回',
          };
          // return { tag: 'el-tag', props: {}, children: map[data['state']] };
          return map[data['state']];
        },
      },
    ],
    operations: [
      {
        text: '详情',
        action: 'check',
        attributes: {
          type: 'text',
        },
        handle: (...args) => {
          console.log('查看详情', proxy, args, args[0].row);
          // 预案详情
          showInfo(args[0].row);
        },
      },
      {
        text: '编辑',
        action: 'edit',
        attributes: {
          type: 'text',
        },
      },
      {
        text: '删除',
        action: 'del',
        style: {
          color: 'red',
        },
        attributes: {
          type: 'text',
        },
      },
    ],
    apis: {
      add: {
        action: 'add',
        type: 'post',
        fn: add,
        data: {
          type: '1',
        },
      },
      del: {
        action: 'del',
        type: 'delete',
        fn: del,
      },
      update: {
        action: 'update',
        type: 'put',
        fn: update,
      },
      list: {
        action: 'list',
        type: 'get',
        fn: list,
        query: {
          type: '1',
        },
      },
      export: {
        action: 'export',
        type: 'post',
        url: exportUrl,
        query: {
          type: '1',
        },
        fn: exportList,
      },
    },
  },
  预案审核: {
    title: '预案列表',
    tableOptions: {
      attributes: {
        selection: true,
      },
      topOperations: {
        export: {
          component: 'el-button',
          text: '导出',
          attributes: {
            'v-hasPermi': ['worship:emergencyPlan:export'],
          },
        },
      },
    },
    searchOption: {
      show: true,
      component: 'el-form',
      options: {
        model: {
          divisionCode: null,
          keyWord: '',
        },
        attributes: {}, // element-ui attributes
        items: [
          {
            component: 'TreeSelectDivision',
            prop: 'divisionCode',
            label: '行政区划',
            slot: null,
          },
          // {
          //   component: 'el-select',
          //   prop: 'state',
          //   label: '状态',
          //   options: [
          //     {
          //       label: '待审核',
          //       value: 0,
          //     },
          //     {
          //       label: '已通过',
          //       value: 1,
          //     },
          //     {
          //       label: '已驳回',
          //       value: 2,
          //     },
          //   ],
          //   slot: null,
          // },
          {
            component: 'el-input',
            prop: 'keyWord',
            label: '关键字',
            slot: null,
            attributes: {
              clearable: true,
            },
          },
        ],
      },
    },
    columns: [
      {
        type: 'string',
        component: 'FileUpload',
        hideInForm: true,
        label: '预案文件',
        prop: 'fileUrl',
        required: false,
        attributes: {
          limit: 1,
        },
      },
      {
        type: 'string',
        component: 'FileUpload',
        hideInTable: true,
        label: '预案文件',
        prop: 'fileUrl',
        required: true,
        attributes: {
          limit: 2,
        },
      },
      {
        type: 'string',
        component: 'KeyPersonSelect',
        label: '涉及重点人员',
        hideInTable: true,
        prop: 'personId',
        optionLabel: 'name',
        required: true,
        optionsSource: selectPersonOptions,
        attributes: {},
      },
      {
        type: 'string',
        component: '',
        hideInForm: true,
        label: '涉及重点人员',
        prop: 'personName',
        required: true,
        attributes: {},
      },
      {
        type: 'string',
        component: '',
        label: '联系方式',
        prop: 'phone',
        required: true,
        attributes: {
          placeholder: '请输入',
        },
      },
      {
        component: 'TreeSelectDivision',
        hideInForm: true,
        hideInTable: true,
        label: '行政区划Code',
        prop: 'divisionCode',
        required: true,
        defaultValue: store.state.user.divisionCode,
      },
      {
        component: null,
        hideInForm: true,
        label: '行政区划',
        prop: 'divisionName',
        required: true,
        defaultValue: store.state.user.divisionName,
      },
      {
        component: null,
        hideInForm: true,
        label: '上传人',
        prop: 'createName',
        required: false,
      },
      {
        component: '',
        hideInForm: true,
        label: '状态',
        prop: 'state',
        required: false,
        defaultValue: '0',
        valueFormatInTable(data) {
          let map = {
            0: '待审核',
            1: '已通过',
            2: '已驳回',
          };
          return map[data['state']];
        },
      },
    ],
    operations: [
      {
        text: '详情',
        action: 'check',
        attributes: {
          type: 'text',
        },
        handle: (...args) => {
          console.log('查看详情', proxy, args, args[0].row);
          // 预案详情
          showInfo(args[0].row);
        },
      },
      {
        show: (row) => {
          console.log(row);
          return false;
        },
        text: '通过',
        action: 'pass',
        attributes: {
          type: 'text',
        },
        handle: (...args) => {
          console.log('通过审核', args, args[2]);
          let updateData = JSON.parse(JSON.stringify(args[0].row));
          updateData.state = '1';
          update(updateData).then((res) => {
            if (res.code == 200) {
              Message.success(res.msg);
              args[2].reFreshTableData();
            }
          });
        },
      },
      {
        show: (row) => {
          console.log(row);
          return false;
        },
        text: '驳回',
        style: {
          color: 'red',
        },
        action: 'pass',
        attributes: {
          type: 'text',
        },
        handle: (...args) => {
          console.log('驳回审核', proxy, args, args[0].row);
          let updateData = JSON.parse(JSON.stringify(args[0].row));
          updateData.state = '2';
          update(updateData).then((res) => {
            if (res.code == 200) {
              Message.success(res.msg);
              args[2].reFreshTableData();
            }
          });
        },
      },
    ],
    apis: {
      update: {
        action: 'update',
        type: 'post',
        fn: add,
      },
      list: {
        action: 'list',
        type: 'get',
        fn: list,
        query: {
          state: '0', //审核状态(0:待审核 1:已通过 2:已驳回)
          type: '1', //类型(1:重点人员劝返应急预案 2:辖区信访稳定工作应急预案)
        },
      },
      export: {
        action: 'list',
        type: 'get',
        url: exportUrl,
        query: {
          state: '0', //审核状态(0:待审核 1:已通过 2:已驳回)
          type: '1', //类型(1:重点人员劝返应急预案 2:辖区信访稳定工作应急预案)
        },
        fn: exportList,
      },
    },
  },
  辖区信访稳定工作应急预案: {
    title: '预案列表',
    tableOptions: {
      attributes: {
        selection: true,
      },
      topOperations: {
        add: {
          text: '上传',
          attributes: {
            'v-hasPermi': ['worship:emergencyPlan:add'],
          },
        },
        export: {
          component: 'el-button',
          text: '导出',
          attributes: {
            'v-hasPermi': ['worship:emergencyPlan:export'],
          },
        },
      },
    },
    searchOption: {
      show: true,
      component: 'el-form',
      options: {
        model: {
          divisionCode: null,
          keyWord: '',
        },
        attributes: {}, // element-ui attributes
        items: [
          {
            component: 'TreeSelectDivision',
            prop: 'divisionCode',
            label: '行政区划',
            slot: null,
          },
          // {
          //   component: 'el-select',
          //   prop: 'state',
          //   label: '状态',
          //   options: [
          //     {
          //       label: '待审核',
          //       value: 0,
          //     },
          //     {
          //       label: '已通过',
          //       value: 1,
          //     },
          //     {
          //       label: '已驳回',
          //       value: 2,
          //     },
          //   ],
          //   slot: null,
          // },
          {
            component: 'el-input',
            prop: 'keyWord',
            label: '关键字',
            slot: null,
            attributes: {
              clearable: true,
            },
          },
        ],
      },
    },
    columns: [
      {
        type: 'string',
        component: 'FileUpload',
        hideInForm: true,
        label: '预案文件',
        prop: 'fileUrl',
        required: false,
        attributes: {
          limit: 1,
        },
      },
      {
        type: 'string',
        component: 'FileUpload',
        hideInTable: true,
        label: '预案文件',
        prop: 'fileUrl',
        required: true,
        rule: [{ required: true, message: '请上传文件', trigger: ['change'] }],
        attributes: {
          limit: 2,
        },
      },
      {
        type: 'string',
        component: '',
        label: '联系方式',
        prop: 'phone',
        required: true,
        attributes: {
          placeholder: '请输入',
        },
        defaultValue: store.state.user.phone,
      },
      {
        component: 'TreeSelectDivision',
        hideInForm: true,
        hideInTable: true,
        label: '行政区划Code',
        prop: 'divisionCode',
        required: true,
        defaultValue: store.state.user.divisionCode,
      },
      {
        component: 'TreeSelectDivision',
        hideInForm: true,
        label: '行政区划',
        prop: 'divisionName',
        required: true,
        defaultValue: store.state.user.divisionName,
      },
      {
        component: null,
        hideInForm: true,
        label: '上传人',
        prop: 'createName',
        required: false,
      },
      // {
      //   component: '',
      //   hideInForm: true,
      //   label: '状态',
      //   prop: 'state',
      //   required: false,
      //   defaultValue: '0',
      //   valueFormatInTable(data) {
      //     let map = {
      //       0: '待审核',
      //       1: '已通过',
      //       2: '已驳回',
      //     };
      //     return map[data['state']];
      //   },
      // },
    ],
    operations: [
      {
        text: '详情',
        action: 'check',
        attributes: {
          type: 'text',
        },
        handle: (...args) => {
          console.log('查看详情', proxy, args, args[0].row);
          // 预案详情
          showInfo(args[0].row);
        },
      },
      {
        text: '编辑',
        action: 'edit',
        attributes: {
          type: 'text',
        },
      },
      {
        text: '删除',
        action: 'del',
        style: {
          color: 'red',
        },
        attributes: {
          type: 'text',
        },
      },
    ],
    apis: {
      add: {
        action: 'add',
        type: 'post',
        fn: add,
        data: {
          type: '2', //2:辖区信访稳定工作应急预案)
        },
      },
      del: {
        action: 'del',
        type: 'delete',
        fn: del,
      },
      update: {
        action: 'update',
        type: 'put',
        fn: update,
      },
      list: {
        action: 'list',
        type: 'get',
        fn: list,
        query: {
          type: '2',
        },
      },
      export: {
        action: 'list',
        type: 'get',
        url: exportUrl,
        query: {
          type: '2',
        },
        fn: exportList,
      },
    },
  },
});

onMounted(() => {
  console.log('store', store);
  // getDictData(dicts.value, dictsMap.value).then(() => {
  //   initDict.value = true;
  // });
});
</script>

<style lang="scss" scoped>
.header {
  height: 37.33px;
  font-weight: 600;
  font-size: 26.67px;
  color: #000000d9;
  letter-spacing: 0;
  line-height: 37.33px;
  margin-bottom: 16px;
}
.info-container {
  .data-item {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    > .label {
      width: 140px;
    }
    > .data-container {
      flex: 1;
    }
  }
}
</style>
