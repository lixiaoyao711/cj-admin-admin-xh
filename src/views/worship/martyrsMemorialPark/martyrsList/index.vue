<!-- 烈士名单 -->
<!-- createTime : 2024-01-16 -->
<template>
  <CrudTable v-bind="tableConfig"></CrudTable>
</template>

<script setup>
import { ref, watch, computed, onMounted, getCurrentInstance } from 'vue';
const props = defineProps({});
const emit = defineEmits([]);
import martyrsList from '@/api/worship/martyrsList';
const tableConfig = ref({
  title: '烈士名单',
  tableOptions: {
    attributes: {
      selection: false,
    },
    topOperations: {
      add: {
        text: '新增',
        attributes: {
          'v-hasPermi': ['worship:martyrsMemorialPark:add'],
        },
      },
    },
  },
  searchOption: {
    show: true,
    component: 'el-form',
    options: {
      model: {
        name: '',
      },
      attributes: {}, // element-ui attributes
      items: [
        {
          component: 'el-input',
          prop: 'name',
          label: '',
          slot: null,
          attributes: {
            placeholder: '输入烈士姓名查询',
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
      prop: 'photoUrl',
      required: true,
      width: '200px',
      rule: [{ required: true, message: '请上传图片', trigger: ['change'] }],
      attributes: {
        isShowTip: false,
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
      label: '生卒年',
      prop: 'birthAndDeath',
      required: true,
      width: '250px',
      attributes: {
        placeholder: '请输入',
      },
    },
    {
      type: 'string',
      component: 'el-input',
      label: '事迹',
      prop: 'deeds',
      required: true,
      width: '500px',
      attributes: {
        placeholder: '请输入',
        type: 'textarea',
        rows: '8',
      },
    },
    {
      type: 'number',
      component: 'el-input',
      prop: 'messagesNum',
      label: '留言数',
      hideInForm: true,
    },
    {
      type: 'number',
      component: 'el-input',
      prop: 'sacrificesNum',
      label: '祭祀数',
      hideInForm: true,
    },
  ],
  operations: [
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
      fn: martyrsList.add,
    },
    del: {
      action: 'del',
      type: 'delete',
      fn: martyrsList.del,
    },
    update: {
      action: 'update',
      type: 'put',
      fn: martyrsList.update,
    },
    list: {
      action: 'list',
      type: 'get',
      fn: martyrsList.list,
      query: {
        condition: '1',
      },
    },
  },
});
onMounted(() => {});
</script>

<style lang="scss" scoped></style>
