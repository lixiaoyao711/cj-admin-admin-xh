<!--  小程序管理 - 战友论坛 -->
<!-- createTime : 2024-01-12 -->
<template>
  <div class="app-container">
    <div class="header">战友论坛</div>
    <el-tabs v-model="activeTab">
      <el-tab-pane label="发帖列表" name="postManagement">
        <CrudTable v-if="loadTopicEnd" v-bind="tableConfig"></CrudTable>
      </el-tab-pane>
      <el-tab-pane label="话题管理" name="topicManagement">
        <TopicManagementTable></TopicManagementTable>
      </el-tab-pane>
      <el-tab-pane label="关键字管理" name="keyWordManagement">
        <KeyWordManagementTable></KeyWordManagementTable>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted } from 'vue';
import postManagement from '@/api/worship/postManagement'; //帖子
import TopicManagementTable from './topicManagement'; //话题
import KeyWordManagementTable from './keyWordManagement';
import topicManagement from '@/api/worship/topicManagement';
const props = defineProps({});
const emit = defineEmits([]);
let activeTab = ref('postManagement');
let allTopicList = ref([]);
let loadTopicEnd = ref(false);
async function getAllTopic() {
  let res = await topicManagement.list({});
  return res;
}
const tableConfig = ref({
  title: '发帖列表',
  tableOptions: {
    attributes: {
      selection: false,
    },
  },
  searchOption: {
    show: true,
    component: 'el-form',
    options: {
      model: {
        topicId: '',
      },
      attributes: {}, // element-ui attributes
      items: [
        {
          component: 'el-select',
          prop: 'topicId',
          label: '话题:',
          slot: null,
          attributes: {
            placeholder: '选择话题',
            clearable: true,
          },
          optionLabel: 'topicName',
          optionValue: 'id',
          options: allTopicList,
        },
      ],
    },
  },
  columns: [
    {
      type: 'string',
      component: 'el-input',
      label: '标题',
      prop: 'title',
      required: true,
      attributes: {
        placeholder: '请输入',
      },
    },
    {
      type: 'string',
      component: 'ImageUpload',
      label: '图片',
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
      label: '内容',
      prop: 'content',
      required: true,
      attributes: {
        placeholder: '请输入',
        type: 'textarea',
        rows: '8',
      },
    },
    {
      component: null,
      hideInForm: true,
      label: '发帖时间',
      width: '200px',
      prop: 'createTime',
      required: false,
    },
    {
      component: null,
      hideInForm: true,
      label: '回复贴',
      prop: 'replyNum',
      required: false,
    },
  ],
  operations: [
    // {
    //   text: '详情',
    //   action: 'check',
    //   attributes: {
    //     type: 'text',
    //   },
    //   handle: (...args) => {
    //     console.log('查看详情',  args, args[0].row);
    //   },
    // },
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
    del: {
      action: 'del',
      type: 'delete',
      fn: postManagement.del,
    },
    // update: {
    //   action: 'update',
    //   type: 'put',
    //   fn: postManagement.update,
    // },
    list: {
      action: 'list',
      type: 'get',
      fn: postManagement.list,
      query: {
        condition: '1',
      },
    },
  },
});
getAllTopic().then((res) => {
  console.log('🚀 ~ getAllTopic ~ res:', res);
  if (res.code == 200 && res.rows) {
    allTopicList.value = res.rows;
    loadTopicEnd.value = true;
  }
});

onMounted(() => {});
</script>

<style lang="scss" scoped>
@import '@/assets/styles/common.scss';
</style>
