<!--  小程序管理-红色园地 -->
<!-- createTime : 2024-01-12 -->
<template>
  <div class="app-container">
    <div class="header">红色园地</div>
    <el-tabs v-model="activeTabName" @tab-click="handleClick">
      <el-tab-pane v-for="(tabItem, index) in tabs" :label="tabItem.label" :name="index.toString()">
        <CrudTable v-bind="tableConfigList[tabItem.label]"></CrudTable>
      </el-tab-pane>
    </el-tabs>
    <el-dialog title="详情" :visible.sync="infoDialogVisible" append-to-body width="800px" @close="handleDialogClose">
      <div v-if="infoDialogVisible && rowData" class="info-container">
        <el-form label-width="100px" v-model="rowData">
          <el-form-item label="照片:" v-if="['0', '4'].includes(rowData.type)">
            <ImageUpload :disabled="true" :isShowTip="false" v-model="rowData.fileUrl" />
          </el-form-item>
          <el-form-item label="文件:" v-if="['1', '2', '3'].includes(rowData.type)">
            <FileUpload :disabled="true" v-model="rowData.fileUrl" />
          </el-form-item>
          <el-form-item label="姓名:">
            <span>{{ rowData.title }}</span>
          </el-form-item>
          <el-form-item label="内容:">
            <div v-html="rowData.content"></div>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'redGarden',
  };
</script>
<script setup>
  import CrudTable from '@/components/CrudTable/CrudTable.vue';
  import { ref, onMounted, computed, getCurrentInstance, h } from 'vue';
  import { list, get, add, update, del, exportList } from '@/api/worship/redGarden.js';
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

  // type 0:入党故事 1:微党课 2:红色影音 3:老兵故事 4:党史
  // childType 二级类型 0:回忆录 1:家书 2:我的战友 3:其他
  const activeTabName = ref('0');
  const activeTab = ref(null);
  const infoDialogVisible = ref(false);
  const rowData = ref(null);
  const handleClick = (tab) => {
    activeTabName.value = tab.name;
    activeTab.value = tab;
  };
  const tabs = ref([
    {
      label: '入党故事',
      name: '0',
    },
    {
      label: '微党课',
      name: '1',
    },
    {
      label: '红色影音',
      name: '2',
    },
    {
      label: '老兵故事',
      name: '3',
    },
    {
      label: '党史',
      name: '4',
    },
  ]);
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
  // 表格内容最多显示100字
  function contentOverflowFormat(content, maxLen = 100) {
    if (content.length > maxLen) {
      return content.substring(0, maxLen) + '...'
    } else {
      return content;
    }
  }
  const tableConfigList = ref({
    入党故事: {
      title: '入党故事列表',
      tableOptions: {
        attributes: {
          selection: false,
        },
        topOperations: {
          add: {
            text: '新增',
            attributes: {
              'v-hasPermi': ['worship:redGarden:add'],
            },
          },
        },
      },
      searchOption: {
        show: true,
        component: 'el-form',
        options: {
          model: {
            title: '',
          },
          attributes: {}, // element-ui attributes
          items: [
            {
              component: 'el-input',
              prop: 'title',
              label: '姓名:',
              slot: null,
              attributes: {
                placeholder: '输入姓名查询',
                clearable: true,
              },
            },
          ],
        },
      },
      columns: [
        {
          type: 'string',
          component: 'ImageUpload',
          label: '照片',
          prop: 'fileUrl',
          required: true,
          rule: [{ required: true, message: '请上传图片', trigger: ['change'] }],
          attributes: {
            isShowTip: false,
          },
        },
        {
          type: 'string',
          component: 'el-input',
          label: '姓名',
          prop: 'title',
          required: true,
          width: '120px',
          attributes: {
            placeholder: '请输入入党人姓名',
          },
        },
        {
          type: 'string',
          component: 'el-input',
          label: '故事内容',
          prop: 'content',
          width: '700px',
          required: true,
          attributes: {
            placeholder: '请输入',
            type: 'textarea',
            rows: "8"
          },
        },
        {
          component: null,
          hideInForm: true,
          label: '创建时间',
          width: '200px',
          prop: 'createTime',
          required: false,
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
            //详情
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
            type: '0',
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
            type: '0',
          },
        },
        export: {
          action: 'export',
          type: 'post',
          query: {
            type: '0',
          },
          fn: exportList,
        },
      },
    },
    微党课: {
      title: '微党课列表',
      tableOptions: {
        attributes: {
          selection: false,
        },
        topOperations: {
          add: {
            text: '新增',
            attributes: {
              'v-hasPermi': ['worship:redGarden:add'],
            },
          },
        },
      },
      searchOption: {
        show: true,
        component: 'el-form',
        options: {
          model: {
            title: '',
          },
          attributes: {}, // element-ui attributes
          items: [
            {
              component: 'el-input',
              prop: 'title',
              label: '',
              slot: null,
              attributes: {
                placeholder: '输入名称搜索',
                clearable: true,
              },
            },
          ],
        },
      },
      columns: [
        {
          type: 'string',
          component: 'el-input',
          label: '名称',
          prop: 'title',
          required: true,
          attributes: {
            placeholder: '请输入名称',
          },
        },
        {
          type: 'string',
          component: 'FileUpload',
          label: '视频文件',
          prop: 'fileUrl',
          required: true,
          rule: [{ required: true, message: '请上传文件', trigger: ['change'] }],
          attributes: {
            fileSize: 10,
            fileType: ['mov', 'mp4'],
          },
        },
        {
          type: 'string',
          component: 'el-input',
          label: '介绍内容',
          prop: 'content',
          hideInTable: true,
          hideInForm: true,
          required: true,
          defaultValue: '...',
          attributes: {
            placeholder: '请输入',
          },
        },
        {
          component: null,
          hideInForm: true,
          label: '创建时间',
          width: '200px',
          prop: 'createTime',
          required: false,
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
            //详情
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
          query: {
            type: '1',
          },
          fn: exportList,
        },
      },
    },
    红色影音: {
      title: '影音列表',
      tableOptions: {
        attributes: {
          selection: false,
        },
        topOperations: {
          add: {
            text: '新增',
            attributes: {
              'v-hasPermi': ['worship:redGarden:add'],
            },
          },
        },
      },
      searchOption: {
        show: true,
        component: 'el-form',
        options: {
          model: {
            title: '',
          },
          attributes: {}, // element-ui attributes
          items: [
            {
              component: 'el-input',
              prop: 'title',
              label: '',
              slot: null,
              attributes: {
                placeholder: '输入名称搜索',
                clearable: true,
              },
            },
          ],
        },
      },
      columns: [
        {
          type: 'string',
          component: 'el-input',
          label: '名称',
          prop: 'title',
          required: true,
          width: '200px',
          attributes: {
            placeholder: '请输入名称',
          },
        },
        {
          type: 'string',
          component: 'FileUpload',
          label: '音频内容',
          prop: 'fileUrl',
          required: true,
          rule: [{ required: true, message: '请上传音频文件', trigger: ['change'] }],
          attributes: {
            fileSize: 10,
            fileType: ['wav', 'mp3'],
          },
        },
        {
          type: 'string',
          component: 'el-input',
          label: '介绍内容',
          prop: 'content',
          hideInTable: true,
          hideInForm: true,
          required: true,
          defaultValue: '...',
          attributes: {
            placeholder: '请输入',
          },
        },
        {
          component: null,
          hideInForm: true,
          label: '创建时间',
          width: '200px',
          prop: 'createTime',
          required: false,
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
            //详情
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
            type: '2',
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
          action: 'export',
          type: 'post',
          query: {
            type: '2',
          },
          fn: exportList,
        },
      },
    },
    老兵故事: {
      title: '老兵故事列表',
      tableOptions: {
        attributes: {
          selection: false,
        },
        topOperations: {
          add: {
            text: '新增',
            attributes: {
              'v-hasPermi': ['worship:redGarden:add'],
            },
          },
        },
      },
      searchOption: {
        show: true,
        component: 'el-form',
        options: {
          model: {
            title: '',
          },
          attributes: {}, // element-ui attributes
          items: [
            {
              component: 'el-input',
              prop: 'title',
              label: '',
              slot: null,
              attributes: {
                placeholder: '输入名称搜索',
                clearable: true,
              },
            },
          ],
        },
      },
      columns: [
        {
          type: 'string',
          component: 'el-input',
          label: '名称',
          prop: 'title',
          required: true,
          attributes: {
            placeholder: '请输入名称',
          },
        },
        {
          type: 'string',
          component: 'ImageUpload',
          label: '照片',
          prop: 'fileUrl',
          required: false,
          rule: [{ required: true, message: '请上传图片', trigger: ['change'] }],
          attributes: {
            isShowTip: false,
          },
        },
        {
          type: 'string',
          component: 'el-input',
          label: '故事内容',
          prop: 'content',
          width: '600px',
          required: true,
          attributes: {
            placeholder: '请输入内容',
            type: 'textarea',
            rows: 8
          },
          valueFormatInTable(row) {
            return contentOverflowFormat(row.content)
          }
        },
        {
          type: 'string',
          component: 'el-select',
          label: '故事类型',
          prop: 'childType',
          required: true,
          attributes: {
            placeholder: '请输入',
          },
          optionLabel: 'label',
          optionValue: 'value',
          options: [
            {
              label: '回忆录',
              value: '0',
            },
            {
              label: '家书',
              value: '1',
            },
            {
              label: '我的战友',
              value: '2',
            },
            {
              label: '其他',
              value: '3',
            },
          ],
          valueFormatInTable(row) {
            let valueMap = {
              '0': '回忆录',
              '1': '家书',
              '2': '我的战友',
              '3': '其他'
            };
            return valueMap[row.childType];
          },
        },
        {
          component: null,
          hideInForm: true,
          label: '创建时间',
          width: '200px',
          prop: 'createTime',
          required: false,
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
            //详情
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
            type: '3',
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
            type: '3',
          },
        },
        export: {
          action: 'export',
          type: 'post',
          query: {
            type: '3',
          },
          fn: exportList,
        },
      },
    },
    党史: {
      title: '党史列表',
      tableOptions: {
        attributes: {
          selection: false,
        },
        topOperations: {
          add: {
            text: '新增',
            attributes: {
              'v-hasPermi': ['worship:redGarden:add'],
            },
          },
        },
      },
      searchOption: {
        show: true,
        component: 'el-form',
        options: {
          model: {
            title: '',
          },
          attributes: {}, // element-ui attributes
          items: [
            {
              component: 'el-input',
              prop: 'title',
              label: '姓名:',
              slot: null,
              attributes: {
                placeholder: '输入姓名查询',
                clearable: true,
              },
            },
          ],
        },
      },
      columns: [
        {
          type: 'string',
          component: 'ImageUpload',
          label: '封面',
          prop: 'fileUrl',
          required: true,
          rule: [{ required: true, message: '请上传图片', trigger: ['change'] }],
          attributes: {
            isShowTip: false,
          },
        },
        {
          type: 'string',
          component: 'el-input',
          label: '标题',
          prop: 'title',
          required: true,
          attributes: {
            placeholder: '请输入标题',
          },
        },
        {
          type: 'string',
          component: 'el-input',
          label: '内容',
          prop: 'content',
          required: true,
          width: '500px',
          attributes: {
            placeholder: '请输入内容',
            type: 'textarea',
            rows: 8
          },
          valueFormatInTable(row) {
            return contentOverflowFormat(row.content)
          }
        },
        {
          component: null,
          hideInForm: true,
          label: '创建时间',
          width: '200px',
          prop: 'createTime',
          required: false,
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
            //详情
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
            type: '4',
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
            type: '4',
          },
        },
        export: {
          action: 'export',
          type: 'post',
          query: {
            type: '4',
          },
          fn: exportList,
        },
      },
    },
  });
  onMounted(() => {
    console.log('store', store);
    getDictData(dicts.value, dictsMap.value).then(() => {
      initDict.value = true;
    });
  });
</script>
<style lang="scss" scoped>
@import '@/assets/styles/common.scss';
</style>
