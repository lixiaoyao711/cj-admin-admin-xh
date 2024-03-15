<!-- 崇军商家 -->
<!-- createTime : 2023-10-30 -->
<template>
  <div class="app-table-page">
    <div class="header">崇军商家</div>
    <div class="table-panel">
      <CrudTable v-bind="tableConfig"></CrudTable>
    </div>
  </div>
</template>
<script>
export default {
  name: 'businessCjsj',
};
</script>
<script setup>
import { ref, onMounted, getCurrentInstance } from 'vue';
import { list, get, add, update, del } from '@/api/worship/businessCjsj.js';
import CrudTable from '@/components/CrudTable/CrudTable.vue';
const props = defineProps({
  data: Object,
});
//const emit = defineEmits(['update:data'])
//const { proxy } = getCurrentInstance()
const tableConfig = ref({
  title: '商家列表',
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
      type: 'string', // 取值类型
      component: 'imageUpload',
      label: '照片',
      prop: 'picturePath',
      required: false,
      attributes: {
        fileSize: 20, //文件大小限制
      },
      placeholder: '',
    },
    {
      type: 'string',
      component: 'el-input',
      label: '商家名称',
      prop: 'name',
      required: true,
      attributes: {
        placeholder: '请输入',
      },
    },
    {
      type: 'string',
      component: 'el-input',
      label: '商家地址',
      prop: 'address',
      required: true,
      placeholder: '请输入',
      attributes: {
        type: 'textarea',
      },
    },
    {
      component: 'TreeSelectDivision',
      label: '行政区划',
      prop: 'divisionCode',
      required: true,
      attributes: {
        placeholder: '请选择',
      },
    },
    {
      type: 'string',
      component: 'el-input',
      label: '优惠政策',
      prop: 'promotionMethod',
      required: true,
    },
    {
      type: 'string',
      component: 'el-date-picker',
      label: '开门时间',
      prop: 'openTime',
      required: true,
      attributes: {
        placeholder: '请选择时间',
        type: 'datetime',
        'value-format': 'yyyy-MM-dd HH:mm:ss',
      },
    },
    {
      type: 'string',
      component: 'el-date-picker',
      label: '关门时间',
      prop: 'closeTime',
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
        console.log('查看详情', args, args[0].row);
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
    font-family: PingFangSC-Medium;
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
</style>
