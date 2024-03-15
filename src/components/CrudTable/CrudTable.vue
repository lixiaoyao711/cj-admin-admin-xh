<!-- CrudTable -->
<template>
  <div class="CrudTable">
    <section class="table-search" v-show="props.searchOption.show">
      <component
        :is="props.searchOption.component"
        class="search-form"
        :model="searchQuery"
        ref="searchForm"
        size="small"
        :inline="true"
        v-bind="props.searchOption.attributes"
      >
        <el-row class="search-left">
          <el-form-item
            v-for="(item, index) in props.searchOption.options.items"
            :key="item.prop"
            :label="item.label"
            :prop="item.prop"
          >
            <template v-if="item.component == 'TreeSelectDivision'">
              <TreeSelectDivision
                v-model="searchQuery[item.prop]"
                @treeselectChange="(e) => treeSelectChange(e, searchQuery, item.prop)"
              ></TreeSelectDivision>
            </template>
            <template v-else-if="item.component == 'el-select' && item.dict">
              <el-select v-model="searchQuery[item.prop]" clearable v-bind="item.attributes || {}">
                <el-option
                  v-for="(dict, index) in props.dicts[item.dict]"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                ></el-option>
              </el-select>
            </template>
            <template v-else-if="item.component == 'el-select' && item.options">
              <el-select v-model="searchQuery[item.prop]" clearable v-bind="item.attributes || {}">
                <el-option
                  v-for="(opt, index) in item.options"
                  :key="index"
                  :label="opt[item.optionLabel ? item.optionLabel : 'label']"
                  :value="opt[item.optionValue ? item.optionValue : 'value']"
                ></el-option>
              </el-select>
            </template>
            <template v-else>
              <component
                :is="item.component"
                v-model="searchQuery[item.prop]"
                v-bind="item.attributes || {}"
              ></component>
            </template>
          </el-form-item>
        </el-row>
        <el-form-item class="search-right">
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
      </component>
    </section>
    <section class="table-container">
      <section class="table-header">
        <div class="table-name">{{ title }}</div>
        <div class="table-actions">
          <!-- 新增按钮 -->
          <el-button
            v-if="props.tableOptions?.topOperations?.add"
            type="primary"
            plain
            icon="el-icon-plus"
            size="mini"
            @click="addRow"
            v-bind="props.tableOptions?.topOperations?.add?.attributes"
            >{{ props.tableOptions?.topOperations?.add?.text }}</el-button
          >
          <!-- 批量删除 -->
          <el-button
            v-if="props.tableOptions?.topOperations?.multipleDel"
            type="danger"
            plain
            icon="el-icon-delete"
            size="mini"
            v-bind="props.tableOptions?.topOperations?.multipleDel?.attributes"
            @click="handleMultipleDel"
            >{{ props.tableOptions?.topOperations?.multipleDel?.text }}</el-button
          >
          <!-- 导出 -->
          <el-button
            v-if="props.tableOptions?.topOperations?.export"
            type="warning"
            plain
            icon="el-icon-download"
            size="mini"
            v-bind="props.tableOptions?.topOperations?.export?.attributes"
            @click="handleExport"
            >{{ props.tableOptions?.topOperations?.export?.text }}</el-button
          >
          <!-- 刷新 -->
          <el-tooltip class="item" effect="dark" content="刷新" placement="top">
            <el-button size="mini" circle icon="el-icon-refresh" @click="getPageData()" />
          </el-tooltip>
          <div class="import" v-if="props.import">
            <el-dialog v-model="UploadDialogVisible" draggable center title="注意:">
              <span
                style="
                  color: rgb(255 52 52);
                  font-size: medium;
                  align-items: center;
                  display: flex;
                  justify-content: center;
                "
                ><el-icon>
                  <WarningFilled />
                </el-icon>
                <span>请先下载模板，再使用下载的模板进行导入,否则数据可能导入不成功</span></span
              >
              <template #footer>
                <span class="dialog-footer">
                  <FileUpload :value="fileList" />
                  <el-button style="margin: 10px" @click="UploadDialogVisible = false">取消</el-button>
                </span>
              </template>
            </el-dialog>
          </div>
          <template v-else>
            <el-button
              v-for="(customAction, index) in props?.tableOptions?.topOperations?.customActions"
              :key="index"
              type="primary"
              plain
              icon=""
              size="mini"
              v-bind="customAction.attributes"
              @click="customAction.handleClick"
              >{{ customAction.text }}</el-button
            >
          </template>
        </div>
      </section>
      <div class="table">
        <el-table
          ref="tableRef"
          :fit="true"
          :data="tableData"
          v-loading="loading"
          v-bind="props.tableOptions.attributes"
          @selection-change="handleSelectionChange"
        >
          <!-- 多选 -->
          <el-table-column
            v-for="(col, index) in columns.filter((i) => {
              return i.type == 'selection';
            })"
            :key="index"
            type="selection"
            v-bind="col.attributes"
          >
          </el-table-column>
          <!-- 序号 -->
          <el-table-column
            v-for="(col, index) in columns.filter((i) => {
              return i.type == 'index';
            })"
            :key="index"
            :label="col.label"
            type="index"
            v-bind="col.attributes"
          >
          </el-table-column>
          <!-- 过滤富文本和自定义不显示在表格的字段 -->
          <el-table-column
            v-for="(col, index) in columns.filter((i) => {
              return !i.hideInTable && !['Editor', 'index', 'selection'].includes(i.type);
            })"
            :key="index"
            v-bind="col"
          >
            <template #default="scope">
              <!-- 从字典数据中下拉选择 -->
              <template v-if="col['component'] === 'el-select'">
                <span>{{ getSelectLabelByValue(scope.row, col) }}</span>
              </template>
              <FileUpload
                v-else-if="col.component == 'FileUpload'"
                v-model="scope.row[col.prop]"
                v-bind="col.attributes"
                :isView="true"
              />
              <template v-else-if="col.component === 'ImageUpload'">
                <ImageUpload :disabled="true" v-model="scope.row[col.prop]" v-bind="col.attributes" />
              </template>
              <span v-else>{{ col.valueFormatInTable ? col.valueFormatInTable(scope.row) : scope.row[col.prop] }}</span>
            </template>
          </el-table-column>
          <!-- 操作区 -->
          <el-table-column v-if="operations && operations.length > 0" label="操作">
            <template #default="scope">
              <div class="row-action-buttons">
                <span v-for="(item, key) in operations" :key="key">
                  <template v-show="!item.show ? true : item.show(scope.row)">
                    <el-popconfirm
                      v-if="item.action === 'del'"
                      title="确定删除?"
                      @confirm="handleRowAction(item, scope)"
                    >
                      <template #reference>
                        <el-button
                          type="text"
                          size="mini"
                          :style="item.style || {}"
                          v-bind="item.attributes || {}"
                          :key="key"
                          >{{ item.text }}</el-button
                        >
                      </template>
                    </el-popconfirm>
                    <el-button
                      v-else
                      :type="item.action == 'del' ? 'danger' : 'text'"
                      :key="key"
                      :style="item.style || {}"
                      v-bind="item.attributes || {}"
                      @click="handleRowAction(item, scope)"
                      >{{ item.text }}</el-button
                    >
                  </template>
                </span>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pagination-panel">
        <el-pagination
          v-if="pagination"
          :current-page.sync="pagination.pageNum"
          :page-size.sync="pagination.pageSize"
          :page-sizes="[5, 10, 15, 20]"
          v-bind="props.paginationOptions"
          :total="pagination.total"
          @size-change="sizeChange"
          @current-change="pageChange"
        >
        </el-pagination>
      </div>
    </section>
    <TableEditDialog
      v-if="dialogVisible"
      :visible="dialogVisible"
      :data="rowData"
      :columns="props.columns"
      :apis="props.apis"
      :type="rowAction"
      :import="props.import"
      :multiple="props.multiple"
      :dialogAttrs="props.dialogAttrs"
      :dicts="props.dicts"
      @success="reFreshTableData"
      @close="
        () => {
          dialogVisible = false;
        }
      "
    >
    </TableEditDialog>
  </div>
</template>

<script setup>
import { reactive, ref, toRefs, onMounted, watch, computed, getCurrentInstance } from 'vue';
import TableEditDialog from './TableEditDialog.vue';
import FileUpload from '@/components/FileUpload';
import { Message } from 'element-ui';
const tableRef = ref(null);
const UploadRef = ref(null);
const UploadDialogVisible = ref(false);
const { proxy } = getCurrentInstance();
const props = defineProps({
  dialogAttrs: {
    type: Object,
    default: () => {
      return {};
    },
  },
  dicts: Object,
  limit: {
    type: Number,
    default: 1,
  },
  import: {
    type: Boolean,
    default: false,
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: '',
  },
  searchOption: {
    type: Object,
    default: () => {
      return {
        show: true,
        component: 'el-form',
        options: {
          model: {
            divisionCode: '',
            keyWord: '',
          },
          attributes: {}, // element-ui attributes
          children: [],
        },
      };
    },
  },
  tableOptions: {
    type: Object,
    default: () => {
      return {
        attributes: {
          width: '100%',
          height: '500px',
        },
        topOperations: null,
      };
    },
  },
  totalKey: {
    type: String,
    default: 'total',
  },
  // 表格数据
  data: {
    type: Array,
    default: () => {
      return [];
    },
  },
  // 表格配置
  columns: {
    type: Array,
    default: () => {
      return [];
    },
  },
  // 操作
  operations: {
    type: Array,
    default: () => {
      return [
        {
          text: '编辑',
          action: 'edit',
        },
        {
          text: '删除',
          action: 'del',
        },
      ];
    },
  },
  paginationOptions: {
    type: Object,
    default: () => {
      return {
        background: true,
        pageSize: [10, 20, 30, 50],
        layout: 'total, sizes, prev, pager, next, jumper',
      };
    },
  },
  apis: [Array, Object],
});
const emit = defineEmits(['update:data', 'selectionChange']);
const actionUrl = ref('actionUrl');
const headers = {
  headers: { 'Content-Type': 'multipart/form-data' },
  Authorization: 'Bearer ' + window.localStorage.getItem('token'),
};
// 搜索
const searchForm = ref(null);
// 表格数据
const tableData = ref([]);
// 表格数据加载中
let loading = ref(false);
// 表头选择的行
const selectionRows = ref([]);
// 分页
let pagination = ref({
  pageNum: 1,
  pageSize: 10,
  total: 0,
});
// 弹框显示
let dialogVisible = ref(false);
// 选择的行
let rowData = ref(null);
// 行操作
let rowAction = ref(null);
let fileList = ref([]);
const searchQuery = computed({
  set(v) {
    return v;
  },
  get() {
    return props.searchOption.options.model || {};
  },
});
watch(
  () => props,
  (v) => {
    console.log('apis:watch', v);
  }
);

function handleSelectionChange(v) {
  console.log('handleSelectionChange', v);
  emit('selectionChange', v);
  selectionRows.value = v;
}
async function handleMultipleDel() {
  let idsStr = '';
  if (selectionRows.value.length <= 0) {
    Message.warning('请先勾选需要删除的行');
  } else {
    selectionRows.value.forEach((item, index) => {
      if (index === 0) {
        idsStr += item.id;
      } else {
        idsStr += `,${item.id}`;
      }
      console.log('handleMultipleDel', idsStr);
    });
    let res = await props.apis['del'].fn(idsStr);
    if (res.code === 200) {
      Message.success('删除成功');
      reFreshTableData(); // 刷新表格数据
    }
  }

  // console.log(res);
}
function treeSelectChange(selectValue, updateObj, updateKey = 'divisionCode', labelKey) {
  console.log('treeSelectChange', selectValue);
  if (updateObj && updateKey) {
    updateObj[updateKey] = selectValue.weight;
    if (labelKey) {
      updateObj[labelKey] = selectValue.label;
    }
  }
}
function getSelectLabelByValue(rowData, col) {
  let labelKey = 'label';
  let valueKey = 'value';
  let label = '';
  let value = rowData[col.prop]; // 该字段的值
  if (!value) {
    return '';
  }
  // console.log(rowData, col, value, props.dicts);
  if (col.dict && col.attributes && !col.attributes.multiple) {
    // 字典取值(唯一)
    props.dicts[col.dict].forEach((i) => {
      // console.log(i, i.dictValue, col.prop, rowData);
      if (i.dictValue == rowData[col.prop]) {
        label = i.dictLabel;
      }
    });
    // console.log(rowData, col, label);
    return label;
  } else if (col.options) {
    if (col?.optionLabel) {
      labelKey = col.optionLabel;
    }
    if (col?.optionValue) {
      valueKey = col.optionValue;
    }
    //下拉选择(多选)
    if (col.attributes && col.attributes.multiple) {
      let item = col.options.filter((i) => {
        if (value.indexOf(',') !== -1) {
          //多个值
          if (value.indexOf(i[valueKey]) !== -1) {
            return i;
          }
        } else if (i[valueKey] == value) {
          return i;
        }
      });
      let values = [];
      item.forEach((i) => {
        values.push(i[labelKey]);
      });
      label = values.toString();
    } else {
      //单选
      col.options.filter((i) => {
        if (i[valueKey] == value) {
          label = i[labelKey];
        }
      });
    }
  }
  // // // console.log('🚀 ~ getSelectLabelByValue :', rowData, col, value, label);
  return label;
}

const sizeChange = (size) => {
  pagination.value.pageSize = size;
  pagination.value.pageNum = 1;
  getPageData();
};

const pageChange = (page) => {
  getPageData();
};

// 条件搜索
const handleQuery = () => {
  getPageData();
};

// 重置搜索条件
const resetQuery = () => {
  searchForm.value.resetFields();
  pagination.value.pageNum = 1; //从第一页
  handleQuery();
};
// 行处理事件
const handleRowAction = (item, scope) => {
  // console.log('handleRowAction', item, scope);
  switch (item.action) {
    case 'edit': {
      dialogVisible.value = true;
      editRow(scope.row, scope.$index);
      break;
    }
    case 'del': {
      delRow(scope.row, scope.$index);
      break;
    }
    default: {
      if (item.handle) {
        item.handle(scope, tableRef.value, proxy);
      }
      break;
    }
  }
};
// 新增行
const addRow = async () => {
  // console.log('addRow');
  rowAction.value = 'add';
  rowData.value = getRowDefaultData();
  dialogVisible.value = true;
};

// 生成默认表格行数据
function getRowDefaultData() {
  let _data = {};
  if (Array.isArray(props.columns) && props.columns.length > 0) {
    props.columns.forEach((item, index) => {
      if (item['prop']) {
        let defaultKeyValue = null;
        if (item.defaultValue) {
          defaultKeyValue = item.defaultValue;
        } else {
          switch (item['type']) {
            case 'string':
              defaultKeyValue = '';
              break;
            case 'number':
              defaultKeyValue = 0;
              break;
            case 'boolean':
              defaultKeyValue = true;
              break;
            case 'object':
              defaultKeyValue = {};
              break;
            case 'array':
              defaultKeyValue = [];
              break;
            default:
              defaultKeyValue = null;
              break;
          }
        }
        _data[item['prop']] = defaultKeyValue;
      }
    });
    console.log('getRowDefaultData', _data);
  }
  return _data;
}

// 编辑行
const editRow = async (row, index) => {
  // dialogVisible.value = !dialogVisible.value
  rowData.value = JSON.parse(JSON.stringify(row));
  rowAction.value = 'edit';
};
// 删除行
const delRow = async (row, index) => {
  rowAction.value = 'del';
  props.apis['del'].fn(row.id).then((res) => {
    // console.log('delRow', res);
    getPageData();
  });
};

// 获取表格数据
function handleResult(res) {
  // console.log('handleResult', res);
  if (res.code === 200 && res.rows) {
    tableData.value = res.rows;
    pagination.value.total = res[props.totalKey];
  }
}

// 分页获取表格数据
const getPageData = async () => {
  let { pageNum, pageSize } = pagination.value;
  let param = { pageNum: pageNum, pageSize: pageSize, ...searchQuery.value };
  if (props.apis['list'].query) {
    param = { ...param, ...props.apis['list'].query };
    // console.log('getPageData:param', param);
  }
  loading.value = true;
  let result = null;
  if (props.apis['list'].path) {
    result = await props.apis['list'].fn(props.apis['list'].path, param);
  } else {
    result = await props.apis['list'].fn(param);
  }
  handleResult(result);
  loading.value = false;
  // console.log('CrudTable:getPageData', param, result);
  return result;
};

function reFreshTableData() {
  // console.log(Math.ceil((pagination.value.total + 1) / pagination.value.pageSize));
  if (rowAction.value == 'add' && tableData.value.length >= pagination.value.pageSize) {
    pagination.value.pageNum = Math.ceil((pagination.value.total + 1) / pagination.value.pageSize);
  } else if (rowAction.value == 'del' && tableData.value.length == 1) {
    if (pagination.value.pageNum > 1) {
      pagination.value.pageNum -= 1;
    } else {
      pagination.value.pageNum = 1;
    }
  }
  getPageData();
}
const handleSuccess = (file) => {
  UploadDialogVisible.value = false;
  UploadRef.value.clearFiles();
  getPageData();
};
const handleExport = () => {
  let param = {
    pageNum: pagination.value.pageNum,
    pageSize: pagination.value.pageSize,
    ...searchQuery.value,
    ...props.api?.export?.query,
  };
  if (props.apis?.export?.url) {
    console.log('export:param', param);
    proxy.download(props.apis?.export?.url, param, `${new Date().getTime()}.xlsx`);
  }
  // if (props.apis?.export?.fn) {
  //   props.apis?.export?.fn({
  //     pageSize: pagination.value.pageSize,
  //     pageNum: pagination.value.pageNum,
  //   });
  // }
};
defineExpose({ getPageData, reFreshTableData, pagination });
onMounted(() => {
  getPageData();
});
</script>
<style lang="scss" scoped>
.CrudTable {
  width: 100%;
  height: 100%;
  // border: 1px dashed rgba(0, 0, 0, 0.05);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;

  :deep(.el-empty) {
    padding: 0;

    .el-empty__description {
      margin-top: 5px;
    }
  }

  > section {
    background-color: #fff;
  }

  .table-search {
    padding: 18px 18px 0 18px;

    .search-form {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
  }

  .table-container {
    flex: 1;
    margin-top: 10px;
    padding: 16px;
    flex-direction: column;
    display: flex;
    justify-content: space-between;

    :deep(th) {
      background-color: #f5f5f5;

      .cell {
        color: #000000;
        font-weight: 500;
      }
    }

    :deep(.el-table__body) {
      .cell {
        color: rgba(0, 0, 0, 0.65);
      }
    }

    .table-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 14px;

      .table-name {
        flex: 1;
        font-weight: 600;
        font-size: 18px;
        color: #333333;
        margin: 0 5px;
        flex: 1;
      }

      .table-actions {
        flex: 1;
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        align-items: center;

        :deep(.el-button + .el-button) {
          margin-left: 10px;
        }
      }
    }

    .table {
      width: 100%;
      flex: 1;
      display: block;
      color: #515a6e;

      &:deep(.el-table) {
        .el-table__header-wrapper {
          .el-table__header {
            .el-table__cell {
              .cell {
                font-weight: 700;
              }
            }
          }
        }

        .row-action-buttons {
          span {
            margin-right: 5px;
          }
        }
      }

      &:deep(.el-button.is-link:focus) {
        color: #f56c6c;
      }

      &:deep(.el-button.is-link:hover) {
        color: #fca5a5;
      }

      &:deep(.el-pagination__rightwrapper) {
        display: flex;
      }

      &:deep(.el-pagination--small) {
        justify-content: end;
      }
    }

    .pagination-panel {
      display: flex;
      justify-content: flex-end;
      padding: 16px;
    }
  }

  .import {
    &:deep(.el-dialog__title) {
      font-size: 26px;
    }
  }
}
</style>
