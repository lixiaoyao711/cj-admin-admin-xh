<!--  烈士陵园 martyrsMemorialPark -->
<!-- createTime : 2024-01-12 -->
<template>
  <div class="app-container">
    <div class="header">烈士陵园</div>
    <el-tabs v-model="activeTab">
      <el-tab-pane label="烈士纪念馆" name="martyrsMemorialPark">
        <CrudTable v-bind="tableConfig"></CrudTable>
      </el-tab-pane>
      <el-tab-pane label="烈士名单" name="martyrsList">
        <MartyrsList></MartyrsList>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted, getCurrentInstance } from 'vue';
import martyrsMemorialPark from '@/api/worship/martyrsMemorialPark';
import MartyrsList from './martyrsList';
const props = defineProps({});
const emit = defineEmits([]);
let activeTab = ref('martyrsMemorialPark');
const tableConfig = ref({
  title: '烈士陵园/纪念馆',
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
            placeholder: '输入名称查询',
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
      prop: 'name',
      required: true,
      attributes: {
        placeholder: '请输入',
      },
    },
    {
      type: 'string',
      component: 'el-input',
      label: '简介',
      prop: 'msg',
      required: true,
      attributes: {
        placeholder: '请输入',
        type: 'textarea',
        rows: '8',
      },
    },
    {
      type: 'string',
      component: 'el-input',
      prop: 'address',
      label: '地址',
    },
    {
      type: 'string',
      component: 'Map',
      prop: 'longitude',
      hideInTable: true,
      required: true,
      label: '地图选址',
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
      fn: martyrsMemorialPark.add,
    },
    del: {
      action: 'del',
      type: 'delete',
      fn: martyrsMemorialPark.del,
    },
    update: {
      action: 'update',
      type: 'put',
      fn: martyrsMemorialPark.update,
    },
    list: {
      action: 'list',
      type: 'get',
      fn: martyrsMemorialPark.list,
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
