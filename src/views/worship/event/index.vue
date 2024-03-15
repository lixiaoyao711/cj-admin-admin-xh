<!-- 崇军事件 -->
<!-- createTime : 2023-10-30 $-->
<template>
  <div class="app-table-page">
    <div class="header">崇军事件</div>
    <div class="table-panel">
      <CrudTable v-if="initDict" v-bind="tableConfig" :dicts="dictsMap"></CrudTable>
      <el-dialog title="事件详情" :visible.sync="infoDialogVisible" append-to-body width="800px">
        <div v-if="rowData" class="event-info">
          <el-row>
            <el-col :span="3"> <span>事件类型 : </span> </el-col>
            <el-col :span="20">
              {{ getDictLabelByDictValue(dictsMap, 'sys_worship_eventtype', rowData.eventType) }}</el-col
            >
          </el-row>
          <el-row>
            <el-col :span="3"> <span>事件日期 : </span> </el-col>
            <el-col :span="20"> {{ rowData.eventTime }}</el-col>
          </el-row>
          <el-row>
            <el-col :span="3"> <span>组织单位 : </span> </el-col>
            <el-col :span="20"> {{ rowData.divisionName }}</el-col>
          </el-row>
          <el-row>
            <el-col :span="3"> <span>事件内容 : </span> </el-col>
            <el-col :span="20">
              <div v-html="rowData.content"></div>
            </el-col>
          </el-row>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
export default {
  name: 'event',
};
</script>
<script setup>
import { ref, onMounted, getCurrentInstance } from 'vue';
import { list, get, add, update, del } from '@/api/worship/event.js';
import CrudTable from '@/components/CrudTable/CrudTable.vue';
import { listData } from '@/api/system/dict/data'; //根据字典类型值获取字典数据列表
const props = defineProps({
  data: Object,
});
//const emit = defineEmits(['update:data'])
//const { proxy } = getCurrentInstance()
const dicts = ref(['sys_worship_eventtype']);
const dictsMap = ref({}); //字典映射
const initDict = ref(false);
const rowData = ref(null);
const infoDialogVisible = ref(false);
const tableConfig = ref({
  title: '商家列表',
  dialogAttrs: {
    width: '1000px',
  },
  tableOptions: {
    attributes: {
      selection: true,
    },
    topOperations: {
      add: {
        text: '新增事件',
        attributes: {
          'v-hasPermi': ['worship:event:add'],
        },
      },
      multipleDel: {
        component: 'el-button',
        text: '删除',
        attributes: {
          'v-hasPermi': ['worship:event:remove'],
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
          label: '组织单位',
          slot: null,
        },
        {
          component: 'el-select',
          prop: 'eventType',
          dict: 'sys_worship_eventtype',
          label: '事件类型',
          slot: null,
        },
        // {
        //   component: 'el-input',
        //   prop: 'name',
        //   label: '关键字',
        //   slot: null,
        // },
      ],
    },
  },
  columns: [
    {
      type: 'selection', // 取值类型
      component: '',
      label: '',
      prop: '',
      attributes: {
        type: 'selection',
        width: '50px',
      },
    },
    {
      type: 'string', // 取值类型
      component: 'el-select',
      label: '事件类型',
      prop: 'eventType',
      dict: 'sys_worship_eventtype',
      required: false,
      attributes: {
        fileSize: 20, //文件大小限制
      },
      placeholder: '',
    },
    {
      component: 'TreeSelectDivision',
      label: '组织单位',
      prop: 'divisionCode',
      hideInTable: true,
      required: true,
      attributes: {
        placeholder: '请选择',
      },
    },
    {
      component: 'TreeSelectDivision',
      label: '组织单位',
      prop: 'divisionName',
      hideInForm: true,
      required: true,
      attributes: {},
    },
    {
      type: 'boolean',
      component: 'el-switch',
      label: '纳入加分项',
      prop: 'whetherBonusItem',
      required: true,
      valueFormatInTable(row) {
        let valueMap = {
          '1': '纳入',
          '0': '不纳入',
        };
        return valueMap[row.whetherBonusItem];
      },
      attributes: {
        'active-value': '1',
        'inactive-value': '0',
      },
    },

    {
      type: 'string',
      component: 'el-date-picker',
      label: '事件日期',
      prop: 'eventTime',
      required: true,
      attributes: {
        placeholder: '请选择日期',
        type: 'date',
        'value-format': 'yyyy-MM-dd HH:mm:ss',
      },
    },
    {
      type: 'string',
      component: 'Editor',
      label: '事件内容',
      hideInTable: true,
      prop: 'content',
      required: true,
      attributes: {},
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
        console.log('查看详情', args[2].$data);
        rowData.value = args[0].row;
        infoDialogVisible.value = true;
        // args[2]
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
    },
    del: {
      action: 'del',
      type: 'delete',
      fn: del,
    },
  },
});

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
getDictData(dicts.value, dictsMap.value).then(() => {
  initDict.value = true;
});
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

onMounted(() => {});
</script>

<style lang="scss" scoped>
.app-table-page {
  padding: 20px;
  height: calc(100vh - 50px);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  .header {
    height: 37.33px;
    font-weight: 600;
    font-size: 26.67px;
    color: #000000d9;
    letter-spacing: 0;
    line-height: 37.33px;
    margin-bottom: 16px;
  }
  .table-panel {
    flex: 1;
    box-sizing: border-box;
    .table-title-box {
      display: flex;
      justify-content: space-between;
      .title-name {
        font-family: PingFangSC-Medium;
        font-weight: 600;
        font-size: 18px;
        color: #333333;
      }
    }
  }
}
.search-form {
  background-color: #fff;
  padding: 20px 0 0 20px;
  box-sizing: border-box;
  .search-right {
    float: right;
  }
}
.event-info {
  line-height: 40px;
  .el-row {
    .el-col:nth-child(1) {
      font-weight: bold;
    }
  }
}
</style>
