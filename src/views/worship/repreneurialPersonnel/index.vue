<!-- 就业创业-人员列表 -->
<!-- createTime : 2023-11-03 -->
<template>
  <div class="app-container">
    <div class="header">人员列表</div>
    <el-tabs v-model="activeTabName" @tab-click="handleClick">
      <el-tab-pane label="就业人员" name="就业人员">
        <CrudTable v-if="initDict" key="就业人员" v-bind="tableConfigList['就业人员']" :dicts="dictsMap"></CrudTable>
      </el-tab-pane>
      <el-tab-pane label="无业人员" name="无业人员">
        <CrudTable
          key="无业人员"
          v-if="initDict"
          v-bind="tableConfigList['无业人员']"
          :dicts="dictsMap"
          @selectionChange="handlePersonSelectChange"
        ></CrudTable>
      </el-tab-pane>
      <el-tab-pane label="创业人员" name="创业人员">
        <CrudTable v-if="initDict" v-bind="tableConfigList['创业人员']" :dicts="dictsMap" key="创业人员"></CrudTable>
      </el-tab-pane>
    </el-tabs>
    <el-dialog
      title="推荐岗位"
      width="1000px"
      top="10vh"
      :visible.sync="dialogVisible"
      @close="$emit('close')"
      :close-on-click-modal="false"
      append-to-body
    >
      <!-- 岗位列表  -->
      <CrudTable
        v-if="initDict"
        v-bind="workTableConfig"
        @selectionChange="handleJobSelectChange"
        :dicts="dictsMap"
      ></CrudTable>
      <div class="select-tags-panel">
        <div class="title">将以下岗位</div>
        <div class="tags-container">
          <el-tag v-for="(job, index) in selectJobList" :key="index" @close="handleDelJob(tag)">{{
            job.jobName
          }}</el-tag>
        </div>
      </div>
      <div class="select-tags-panel">
        <div class="title">推荐给</div>
        <div class="tags-container">
          <el-tag v-for="(person, index) in selectNoJobPersonList" :key="index">{{ person.name }}</el-tag>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="$emit('close')">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">短信推荐</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'RepreneurialPersonnel',
};
</script>
<script setup>
import CrudTable from '@/components/CrudTable/CrudTable.vue';
import { ref, onMounted, computed, getCurrentInstance } from 'vue';
import { list, get, add, update, del, exportList } from '@/api/worship/personEmployment.js';
import { queryPersonPageList } from '@/api/worship/militaryEntrepreneurship.js';
import { listData } from '@/api/system/dict/data'; //根据字典类型值获取字典数据列表
import { listJobLibrary } from '@/api/worship/jobLibrary'; //获取岗位列表
import { Message } from 'element-ui';
import store from '@/store';

const props = defineProps({
  data: Object,
});
//const emit = defineEmits(['update:data'])
const { proxy } = getCurrentInstance();
// 字典s
const dicts = ref([
  'sys_worship_tuiyijunrenanzhileibie', //退役巨人安置类别
  'sys_worship_tuiyijunrenyoufuleibie', // 退役军人优抚类别
  'sys_worship_personneltype',
  'sys_worship_personneltag',
  'sys_worship_industry', //岗位所属行业
]);
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
getDictData(dicts.value, dictsMap.value).then(() => {
  console.log(dictsMap.value);
  initDict.value = true;
});
const personnelTagsSearchCol = ref({
  component: 'el-select',
  prop: 'personnelTags',
  label: '人员标签',
  options: store.state.user.peoPleTagList,
  optionLabel: 'dictLabel',
  optionValue: 'dictValue',
  slot: null,
});
const personnelTagsCol = ref({
  component: 'el-select',
  prop: 'personnelTags',
  label: '人员标签',
  options: store.state.user.peoPleTagList,
  optionLabel: 'dictLabel',
  optionValue: 'dictValue',
  attributes: {
    multiple: true,
  },
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
    return '就业人员';
  },
  set(v) {
    return v;
  },
});
const handleClick = (tab) => {
  // console.log(tab);
};
const handleRowCheck = (row) => {
  let id = row.id;
  switch (row['attribute']) {
    //  1:退役军人 2:其他优抚对象 3:现役军人家属
    //退役军人详情 -> /worship/people-info/info/${id}?tab=basicInfo
    //其他优抚对象详情 -> /worship/compensatedIndividuals/info/${id}?tab=basicInfo
    //现役军人家属 -> /worship/serviceFamily/info/1702206789786947586
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
      proxy.$router.push({
        path: `/worship/serviceFamily/info/${id}?tab=basicInfo`,
      });
      break;
    }
    default: {
      proxy.$router.push({
        path: `/worship/people-info/info/${id}?tab=basicInfo`,
      });
      break;
    }
  }
};
const tableConfigList = ref({
  就业人员: {
    title: '单位就业人员',
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
          personnelTagsSearchCol.value,
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
          handleRowCheck(args[0].row);
        },
      },
    ],
    apis: {
      list: {
        action: 'list',
        type: 'get',
        fn: list,
        query: {
          // 类型 0:就业 1:失业
          employmentType: '0',
        },
      },
    },
  },
  无业人员: {
    title: '无业人员',
    showAdd: false, //第三方数据无新增只查看
    tableOptions: {
      attributes: {
        selection: false,
      },
      topOperations: {
        customActions: [
          {
            text: '批量推荐岗位',
            attributes: {
              // 'v-hasPermi': ['worship:repreneurialPersonnel:recommendJob'],
            },
            handleClick() {
              if (selectNoJobPersonList.value > 0) {
                openRecommendDialog();
              } else {
                Message.warning('请选择推荐人员');
              }
            },
          },
        ],
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
            prop: 'personCategory',
            label: '人员类别',
            dict: 'sys_worship_tuiyijunrenanzhileibie',
            slot: null,
          },
          {
            component: 'el-select',
            prop: 'workIntention',
            label: '就业意向',

            slot: null,
          },
          personnelTagsSearchCol.value,
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
        type: 'selection',
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
        component: 'el-input',
        prop: 'unemploymentMsg',
        label: '失业原因',
        slot: null,
      },
      {
        component: 'el-input',
        prop: 'lastSalary',
        label: '上份薪资',
        slot: null,
      },
      {
        component: 'el-input',
        prop: 'zeroFamilies',
        label: '零就业家庭',
        slot: null,
      },
      {
        component: 'el-select',
        prop: 'obtainIntention',
        label: '就业意向',
        slot: null,
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
          handleRowCheck(args[0].row);
        },
      },
      {
        text: '推荐岗位',
        action: 'recommendWork',
        attributes: {
          type: 'text',
        },
        handle: (...args) => {
          console.log('推荐岗位', proxy, args, args[0].row);
          openRecommendDialog(args[0].row);
        },
      },
    ],
    apis: {
      list: {
        action: 'list',
        type: 'get',
        fn: list,
        query: {
          // 类型 0:就业 1:失业
          employmentType: '1',
        },
      },
    },
  },
  创业人员: {
    title: '创业人员',
    showAdd: false, //第三方数据无新增只查看
    tableOptions: {
      attributes: {
        selection: false,
      },
      topOperations: {
        // customActions: [
        //   {
        //     text: '导出',
        //     attributes: {},
        //     handleClick() {
        //       Message.warning('导出功能暂未开放');
        //     },
        //   },
        // ],
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
            prop: 'personCategory',
            label: '人员类别',
            dict: 'sys_worship_tuiyijunrenanzhileibie',
            slot: null,
          },
          personnelTagsSearchCol.value,
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
        type: 'selection',
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
        component: 'el-input',
        prop: 'companyName',
        label: '企业名称',
        slot: null,
        attributes: {
          multiple: false,
        },
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
          handleRowCheck(args[0].row);
        },
      },
    ],
    apis: {
      list: {
        action: 'list',
        type: 'get',
        fn: queryPersonPageList,
        query: {},
      },
    },
  },
});
const handleRowData = ref(null);
const dialogVisible = ref(false); // 推荐岗位
const selectNoJobPersonList = ref([]); // 选择无业人员推荐岗位
const selectJobList = ref([]); // 选择的就就业岗位
// 推荐岗位列表
const workTableConfig = ref({
  title: '岗位列表',
  showAdd: false, //无新增只查看
  searchOption: {
    show: true,
    component: 'el-form',
    options: {
      model: {
        jobName: '',
      },
      attributes: {}, // element-ui attributes
      items: [
        {
          component: 'el-input',
          prop: 'jobName',
          label: '岗位名称',
          slot: null,
        },
      ],
    },
  },
  columns: [
    {
      type: 'selection',
    },
    {
      type: 'string',
      label: '岗位名称',
      prop: 'jobName',
    },
    {
      type: 'string',
      label: '公司名称',
      prop: 'companyName',
    },
    {
      type: 'string',
      label: '工作地址',
      prop: 'workAddress',
    },
    {
      type: 'string',
      label: '所属行业',
      prop: 'industry',
      dict: 'sys_worship_industry',
      attributes: {
        multiple: false,
      },
    },
    {
      type: 'string',
      label: '岗位薪资',
      prop: 'jobSalary',
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
      },
    },
  ],
  apis: {
    list: {
      action: 'list',
      type: 'get',
      fn: listJobLibrary,
      query: {
        //在招聘
        recruitStatus: '0',
      },
    },
  },
});
// 表格选择人
function handlePersonSelectChange(personList) {
  selectNoJobPersonList.value = personList;
}
// 表格触发的选择岗位
function handleJobSelectChange(jobList) {
  selectJobList.value = jobList;
}
// 显示推荐岗位弹框
function openRecommendDialog(rowData) {
  handleRowData.value = rowData;
  dialogVisible.value = true;
}

// 确定短信推荐
function handleSubmit() {
  console.log(selectJobList.value, selectNoJobPersonList.value);
  electJobList.value = [];
  selectNoJobPersonList.value = [];
  dialogVisible.value = false;
}
onMounted(() => {});
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

.select-tags-panel {
  margin-bottom: 16px;
  box-sizing: border-box;
  padding: 12px;
  border: 1px solid #e8f4ff;
  border-radius: 8px;

  .title {
    font-weight: bold;
    line-height: 20px;
  }

  .tags-container {
    .el-tag {
      margin-right: 8px;
    }
  }
}
</style>
