<!-- 关键字管理 -->
<!-- createTime : 2024-01-16 -->
<template>
  <CrudTable v-bind="tableConfig"></CrudTable>
</template>

<script setup>
import { ref, watch, computed, onMounted } from 'vue';
import keyWordManagement from '@/api/worship/keyWordManagement'; //关键字
const props = defineProps({});
const emit = defineEmits([]);
const tableConfig = ref({
  title: '关键字列表',
  tableOptions: {
    attributes: {
      selection: false,
    },
    topOperations: {
      add: {
        text: '新增',
        attributes: {
          'v-hasPermi': ['worship:keyWordManagement:add'],
        },
      },
    },
  },
  searchOption: {
    show: true,
    component: 'el-form',
    options: {
      model: {
        applicationScenario: '',
      },
      attributes: {}, // element-ui attributes
      items: [
        {
          component: 'el-select',
          prop: 'applicationScenario',
          label: '应用场景:',
          slot: null,
          attributes: {
            placeholder: '筛选应用场景',
            clearable: true,
          },
          optionLabel: 'label',
          optionValue: 'value',
          options: [
            {
              label: '战友乐园',
              value: '战友乐园',
            },
            {
              label: '战友相伴',
              value: '战友相伴',
            },
            {
              label: '烈士褒扬',
              value: '烈士褒扬',
            },
          ],
        },
      ],
    },
  },
  columns: [
    {
      type: 'string',
      component: 'el-input',
      label: '名称',
      prop: 'name',
      required: true,
      attributes: {
        placeholder: '请输入',
      },
    },
    {
      component: 'el-select',
      prop: 'applicationScenario',
      label: '应用场景:',
      required: true,
      attributes: {
        placeholder: '请选择应用场景',
        clearable: true,
      },
      optionLabel: 'label',
      optionValue: 'value',
      options: [
        {
          label: '战友乐园',
          value: '战友乐园',
        },
        {
          label: '战友相伴',
          value: '战友相伴',
        },
        {
          label: '烈士褒扬',
          value: '烈士褒扬',
        },
      ],
    },
    {
      component: null,
      hideInForm: true,
      label: '添加时间',
      prop: 'createTime',
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
    add: {
      action: 'add',
      type: 'post',
      fn: keyWordManagement.add,
    },
    del: {
      action: 'del',
      type: 'delete',
      fn: keyWordManagement.del,
    },
    // update: {
    //   action: 'update',
    //   type: 'put',
    //   fn: postManagement.update,
    // },
    list: {
      action: 'list',
      type: 'get',
      fn: keyWordManagement.list,
    },
  },
});
onMounted(() => {});
</script>

<style lang="scss" scoped></style>
