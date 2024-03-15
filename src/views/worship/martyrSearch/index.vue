<!-- 烈士寻亲 -->
<!-- createTime : 2024-01-16 -->
<template>
  <div class="app-container">
    <div class="header">烈士寻亲</div>
    <CrudTable v-bind="tableConfig"></CrudTable>
    <DetailDialog v-if="show" :data="rowData" :show="show" @close="show = false"></DetailDialog>
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted, getCurrentInstance } from 'vue';
import martyrSearch from '@/api/worship/martyrSearch';
import DetailDialog from './detailDialog.vue';

const props = defineProps({});
const emit = defineEmits([]);
const rowData = ref(null)
const show = ref(false);
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
        type: '',
        status: '',
      },
      attributes: {}, // element-ui attributes
      items: [
        {
          component: 'el-select',
          prop: 'type',
          label: '话题:',
          slot: null,
          attributes: {
            placeholder: '选择类型',
            clearable: true,
          },
          optionLabel: 'label',
          optionValue: 'value',
          options: [
            {
              label: '寻找烈士安葬地',
              value: '0',
            },
            {
              label: '寻找烈士亲属',
              value: '1',
            },
          ],
        },
        {
          component: 'el-select',
          prop: 'status',
          label: '状态:',
          slot: null,
          attributes: {
            placeholder: '选择状态',
            clearable: true,
          },
          optionLabel: 'label',
          optionValue: 'value',
          options: [
            {
              label: '已完成',
              value: '0',
            },
            {
              label: '未完成',
              value: '1',
            },
          ],
        },
      ],
    },
  },
  columns: [
    {
      type: 'string',
      component: 'ImageUpload',
      label: '照片',
      prop: 'photoUrl',
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
        placeholder: '请输入',
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
      component: 'el-select',
      prop: 'type',
      label: '话题',
      slot: null,
      attributes: {
        placeholder: '选择类型',
        clearable: true,
      },
      optionLabel: 'label',
      optionValue: 'value',
      options: [
        {
          label: '寻找烈士安葬地',
          value: '0',
        },
        {
          label: '寻找烈士亲属',
          value: '1',
        },
      ],
    },
    {
      component: 'el-select',
      prop: 'status',
      label: '状态',
      slot: null,
      attributes: {
        placeholder: '选择状态',
        clearable: true,
      },
      optionLabel: 'label',
      optionValue: 'value',
      options: [
        {
          label: '已完成',
          value: '0',
        },
        {
          label: '未完成',
          value: '1',
        },
      ],
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
    {
      text: '详情',
      action: 'check',
      attributes: {
        type: 'text',
      },
      handle: (...args) => {
        console.log('查看详情', args, args[0].row);
        rowData.value = args[0].row;
        show.value = true;
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
    del: {
      action: 'del',
      type: 'delete',
      fn: martyrSearch.del,
    },
    // update: {
    //   action: 'update',
    //   type: 'put',
    //   fn: martyrSearch.update,
    // },
    list: {
      action: 'list',
      type: 'get',
      fn: martyrSearch.list,
      query: {
        condition: '1',
      },
    },
  },
});
onMounted(() => {});
</script>

<style lang="scss" scoped>
@import '@/assets/styles/common.scss';
</style>
