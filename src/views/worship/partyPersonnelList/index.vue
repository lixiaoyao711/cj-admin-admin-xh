<!-- 党建引领-人员列表 -->
<!-- createTime : 2023-11-03 -->
<template>
  <div class="app-container">
    <div class="header">人员列表</div>
    <el-tabs v-model="activeTabName" @tab-click="handleClick">
      <el-tab-pane label="党员列表" name="党员列表">
        <div class="tab-table-container">
          <CrudTable v-if="initDict" v-bind="tableConfigList['党员列表']" :dicts="dictsMap"></CrudTable>
        </div>
      </el-tab-pane>
      <el-tab-pane label="兵支书" name="兵支书">
        <div class="tab-table-container">
          <CrudTable v-if="initDict" v-bind="tableConfigList['兵支书']" :dicts="dictsMap"></CrudTable>
        </div>
      </el-tab-pane>
      <el-tab-pane label="志愿者" name="志愿者">
        <div class="tab-table-container">
          <CrudTable v-if="initDict" v-bind="tableConfigList['志愿者']" :dicts="dictsMap"></CrudTable>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
export default {
  name: 'PartyPersonnelList',
};
</script>
<script setup>
import CrudTable from '@/components/CrudTable/CrudTable.vue';
import { ref, onMounted, computed, getCurrentInstance } from 'vue';
import { partyMemberList, militarySupportLetterList, obtainListVolunteersList } from '@/api/worship/basicPerson.js';
import store from '@/store';
import { listData } from '@/api/system/dict/data'; //根据字典类型值获取字典数据列表
const props = defineProps({
  data: Object,
});
//const emit = defineEmits(['update:data'])
const { proxy } = getCurrentInstance();
// [退役军人安置类别,退役军人优抚类别]
const dicts = ref([
  'sys_worship_tuiyijunrenanzhileibie',
  'sys_worship_tuiyijunrenyoufuleibie',
  'sys_worship_personneltag',
]);
const dictsMap = ref({}); //字典映射
const initDict = ref(false);
/** 查询字典下拉列表 */
async function getDictData(dictTypes, dict = {}) {
  if (Array.isArray(dictTypes)) {
    for (let type of dictTypes) {
      let res = await listData({ dictType: type });
      let result = res.rows ? res.rows : [];
      store.dispatch('dict/setDict', { key: type, value: result });
      if (result.length > 0) {
        dict[type] = result;
      }
      // console.log(type, result);
    }
  }
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
const activeTabName = computed({
  get() {
    return proxy.$route.query.tab || '党员列表';
  },
  set(v) {
    return v;
  },
});
const handleClick = (tab) => {
  console.log(tab);
};
const personnelTagsCol = ref({
  component: 'el-select',
  prop: 'personnelTags',
  label: '人员标签',
  options: store.state.user.peoPleTagList,
  optionLabel: 'dictLabel',
  optionValue: 'dictValue',
});
const tableConfigList = ref({
  党员列表: {
    title: '党员列表',
    showAdd: false, //第三方数据无新增只查看
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
            prop: 'personCategory',
            label: '人员类别',
            dict: 'sys_worship_tuiyijunrenanzhileibie',
            slot: null,
          },
          {
            component: 'el-select',
            prop: 'retirePreferentialCategory',
            label: '抚恤类别',
            dict: 'sys_worship_tuiyijunrenyoufuleibie',
            slot: null,
          },
          personnelTagsCol.value,
          {
            component: 'el-input',
            prop: 'keyWord',
            label: '关键字',
            slot: null,
          },
        ],
      },
    },
    columns: [
      {
        type: 'index',
        component: null,
        label: '序号',
        prop: '',
        attributes: {
          index: (i) => {
            return i + 1;
          },
        },
      },
      {
        type: 'string',
        component: 'el-input',
        label: '姓名',
        prop: 'name',
        required: true,
        attributes: {
          placeholder: '请输入',
        },
      },
      {
        type: 'string',
        component: 'el-input',
        label: '性别',
        prop: 'sex',
        required: true,
        placeholder: '请输入',
        attributes: {
          type: 'textarea',
        },
      },
      {
        type: 'number',
        component: 'el-input',
        label: '年龄',
        prop: 'age',
        required: true,
      },
      {
        type: 'text',
        component: 'el-input',
        label: '联系方式',
        prop: 'phone',
        required: true,
      },
      {
        component: 'TreeSelectDivision',
        label: '行政区划',
        prop: 'divisionName',
        required: true,
      },
      personnelTagsCol.value,
      {
        type: 'string',
        component: 'el-input',
        label: '所在党支部',
        prop: 'partyBranch',
        attributes: {},
      },
      {
        type: 'string',
        component: 'el-date-picker',
        label: '入党时间',
        prop: 'partyJoiningTime',
        required: true,
        attributes: {
          placeholder: '请选择时间',
          type: 'datetime',
          'value-format': 'yyyy-MM-dd HH:mm:ss',
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
          let id = args[0].row.id;
          switch (args[0].row['attribute']) {
            //  1:退役军人 2:其他优抚对象 3:现役军人家属
            //退役军人详情 -> /worship/people-info/info/${id}?tab=basicInfo
            //其他优抚对象详情 -> /worship/compensatedIndividuals/info/${id}?tab=basicInfo
            case '1': {
              proxy.$router.push({
                path: `/worship/people-info/info/${id}?tab=basicInfo`,
              });
              break;
            }
            case '2': {
              proxy.$router.push({
                path: `/worship/compensatedIndividuals/info/${id}?tab=basicInfo`,
              });
              break;
            }
            case '3': {
              break;
            }
            default: {
              break;
            }
          }
        },
      },
    ],
    apis: {
      list: {
        action: 'list',
        type: 'get',
        fn: partyMemberList,
      },
    },
  },
  兵支书: {
    title: '兵支书列表',
    showAdd: false, //第三方数据无新增只查看
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
            prop: 'personCategory',
            label: '人员类别',
            dict: 'sys_worship_tuiyijunrenanzhileibie',
            slot: null,
          },
          personnelTagsCol.value,
          {
            component: 'el-input',
            prop: 'name',
            label: '关键字',
            slot: null,
          },
        ],
      },
    },
    columns: [
      {
        type: 'index',
        component: null,
        label: '序号',
        prop: '',
        attributes: {
          index: (i) => {
            return i + 1;
          },
        },
      },
      {
        type: 'string',
        component: 'el-input',
        label: '姓名',
        prop: 'name',
        required: true,
        attributes: {
          placeholder: '请输入',
        },
      },
      {
        type: 'string',
        component: 'el-input',
        label: '性别',
        prop: 'sex',
        required: true,
        placeholder: '请输入',
        attributes: {
          type: 'textarea',
        },
      },
      {
        type: 'number',
        component: 'el-input',
        label: '年龄',
        prop: 'age',
        required: true,
      },
      {
        type: 'text',
        component: 'el-input',
        label: '联系方式',
        prop: 'phone',
        required: true,
      },
      {
        component: 'TreeSelectDivision',
        label: '行政区划',
        prop: 'divisionName',
        required: true,
      },
      personnelTagsCol.value,
      {
        type: 'string',
        component: 'el-input',
        label: '职务',
        prop: 'post',
        attributes: {},
      },
      {
        type: 'string',
        component: 'el-input',
        label: '社会职务',
        prop: 'socialPosition',
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
          console.log('查看详情', proxy, args, args[0].row);
          let id = args[0].row.id;
          switch (args[0].row['attribute']) {
            //  1:退役军人 2:其他优抚对象 3:现役军人家属
            //退役军人详情 -> /worship/people-info/info/${id}?tab=basicInfo
            //其他优抚对象详情 -> /worship/compensatedIndividuals/info/${id}?tab=basicInfo
            case '1': {
              proxy.$router.push({
                path: `/worship/people-info/info/${id}?tab=basicInfo`,
              });
              break;
            }
            case '2': {
              proxy.$router.push({
                path: `/worship/compensatedIndividuals/info/${id}?tab=basicInfo`,
              });
              break;
            }
            case '3': {
              break;
            }
            default: {
              break;
            }
          }
        },
      },
    ],
    apis: {
      list: {
        action: 'list',
        type: 'get',
        fn: militarySupportLetterList,
      },
    },
  },
  志愿者: {
    title: '志愿者列表',
    showAdd: false, //第三方数据无新增只查看
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
            prop: 'personCategory',
            label: '人员类别',
            dict: 'sys_worship_tuiyijunrenanzhileibie',
            slot: null,
          },
          personnelTagsCol.value,
          {
            component: 'el-input',
            prop: 'name',
            label: '关键字',
            slot: null,
          },
        ],
      },
    },
    columns: [
      {
        type: 'index',
        component: null,
        label: '序号',
        prop: '',
        attributes: {
          index: (i) => {
            return i + 1;
          },
        },
      },
      {
        type: 'string',
        component: 'el-input',
        label: '姓名',
        prop: 'name',
        required: true,
        attributes: {
          placeholder: '请输入',
        },
      },
      {
        type: 'string',
        component: 'el-input',
        label: '性别',
        prop: 'sex',
        required: true,
        placeholder: '请输入',
        attributes: {
          type: 'textarea',
        },
      },
      {
        type: 'number',
        component: 'el-input',
        label: '年龄',
        prop: 'age',
        required: true,
      },
      {
        type: 'text',
        component: 'el-input',
        label: '联系方式',
        prop: 'phone',
        required: true,
      },
      {
        component: 'TreeSelectDivision',
        label: '行政区划',
        prop: 'divisionName',
        required: true,
      },
      {
        component: 'el-select',
        prop: 'personCategory',
        label: '人员类别',
        dict: 'sys_worship_tuiyijunrenanzhileibie',
        slot: null,
        attributes: {
          multiple: false,
        },
      },
      {
        type: 'string',
        component: 'el-input',
        label: '志愿活动次数',
        prop: 'numVolunteer',
        attributes: {},
      },
      {
        type: 'string',
        component: 'el-input',
        label: '服务时长',
        prop: 'serviceDuration',
        attributes: {},
      },
      personnelTagsCol.value,
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
          let id = args[0].row.id;
          switch (args[0].row['attribute']) {
            //  1:退役军人 2:其他优抚对象 3:现役军人家属
            //退役军人详情 -> /worship/people-info/info/${id}?tab=basicInfo
            //其他优抚对象详情 -> /worship/compensatedIndividuals/info/${id}?tab=basicInfo
            case '1': {
              proxy.$router.push({
                path: `/worship/people-info/info/${id}?tab=basicInfo`,
              });
              break;
            }
            case '2': {
              proxy.$router.push({
                path: `/worship/compensatedIndividuals/info/${id}?tab=basicInfo`,
              });
              break;
            }
            case '3': {
              break;
            }
            default: {
              break;
            }
          }
        },
      },
    ],
    apis: {
      list: {
        action: 'list',
        type: 'get',
        fn: obtainListVolunteersList,
      },
    },
  },
});
onMounted(() => {
  console.log('人员标签', store.state.user.peoPleTagList);
});
</script>

<style lang="scss" scoped>
.header {
  height: 37.33px;
  font-family: PingFangSC-Medium;
  font-weight: 600;
  font-size: 26.67px;
  color: #000000d9;
  letter-spacing: 0;
  line-height: 37.33px;
  margin-bottom: 16px;
}
.tab-table-container {
  width: 100%;
  height: 720px;
}
</style>
