<!-- 话题管理 -->
<!-- createTime : 2024-01-16 -->
<template>
  <CrudTable v-bind="tableConfig"></CrudTable>
</template>

<script setup>
import { ref, watch, computed, onMounted } from 'vue';
const props = defineProps({});
const emit = defineEmits([]);
import topicManagement from '@/api/worship/topicManagement'; //话题

const tableConfig = ref({
  title: '话题列表',
  tableOptions: {
    attributes: {
      selection: false,
    },
    topOperations: {
      add: {
        text: '新增',
        attributes: {
          'v-hasPermi': ['worship:topicManagement:add'],
        },
      },
    },
  },
  dialogAttrs: {
    width: '540px',
  },
  searchOption: {
    show: true,
    component: 'el-form',
    options: {
      model: {
        topicName: '',
      },
      attributes: {}, // element-ui attributes
      items: [
        {
          component: 'el-input',
          prop: 'topicName',
          label: '话题名称:',
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
      prop: 'topicName',
      required: true,
      attributes: {
        placeholder: '请输入',
        clearable: true,
      },
    },
    {
      component: null,
      hideInForm: true,
      label: '添加时间',
      width: '200px',
      prop: 'createTime',
      required: false,
    },
    {
      type: 'number',
      component: null,
      hideInForm: true,
      label: '参与讨论数',
      prop: 'numParticipants',
      required: true,
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
      fn: topicManagement.add,
    },
    del: {
      action: 'del',
      type: 'delete',
      fn: topicManagement.del,
    },
    update: {
      action: 'update',
      type: 'put',
      fn: topicManagement.update,
    },
    list: {
      action: 'list',
      type: 'get',
      fn: topicManagement.list,
    },
  },
});

onMounted(() => {});
</script>

<style lang="scss" scoped></style>
