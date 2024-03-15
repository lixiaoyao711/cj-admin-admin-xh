<!-- EditTableEditDialog -->
<template>
  <el-dialog
    class="dialog"
    :title="type == 'add' ? '新增' : '编辑'"
    :visible.sync="visible"
    :before-close="beforeClose"
    append-to-body
    v-bind="props.dialogAttrs"
  >
    <div v-if="formData">
      <el-form ref="formRef" :model="formData" :rules="rules" label-width="120px">
        <el-form-item
          v-for="item in columns.filter((i) => {
            return !i.hideInForm && !!i.component;
          })"
          :label="item.label"
          :prop="item.prop"
          :key="item.prop"
        >
          <!-- 选人组件 -->
          <template v-if="item.component === 'KeyPersonSelect'">
            <KeyPersonSelect
              :value="formData[item.prop]"
              v-bind="item"
              :attributes="item.attributes"
              @change="
                handleKeyPersonSelectChange($event, {
                  id: 'personId',
                  name: 'personName',
                  phone: 'phone',
                  divisionCode: 'divisionCode',
                  divisionName: 'divisionName',
                })
              "
            >
            </KeyPersonSelect>
          </template>
          <template v-else-if="item.component === 'FileUpload'">
            <FileUpload
              v-model="formData[item.prop]"
              v-bind="item.attributes"
              @change="handleFileChange($event, 'fileName', 'name')"
            />
          </template>
          <template v-else-if="item.component === 'ImageUpload'">
            <ImageUpload v-model="formData[item.prop]" />
          </template>
          <template v-else-if="item.component == 'TreeSelectDivision'">
            <TreeSelectDivision
              v-model="formData[item.prop]"
              @treeselectChange="(e) => treeselectChange(e, formData, item.prop)"
            ></TreeSelectDivision>
          </template>
          <template v-else-if="item.component == 'Editor'">
            <Editor v-model="formData[item.prop]"></Editor>
          </template>
          <template v-else-if="item.component == 'Map'">
            <el-button icon="el-icon-add-location" @click="mapDialogVisible = true">地图选址</el-button>
            <MapDialog
              @saveMap="saveMap"
              v-if="mapDialogVisible"
              @close="mapDialogVisible = false"
              :propCenter="initMapCenter(item)"
              :propAddress="formData['address']"
            />
          </template>
          <template v-else-if="item.component">
            <component :is="item.component" v-model="formData[item.prop]" v-bind="item.attributes || {}">
              <template v-if="item.component === 'el-select' && item.dict">
                <el-option
                  v-for="(dict, index) in props.dicts[item.dict]"
                  :key="index"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                ></el-option>
              </template>
              <template v-if="item.component === 'el-select' && item.options">
                <el-option
                  v-for="(opt, index) in item.options"
                  :key="index"
                  :label="opt[item.optionLabel ? item.optionLabel : 'label']"
                  :value="opt[item.optionValue ? item.optionValue : 'value']"
                ></el-option>
              </template>
            </component>
          </template>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <el-button @click="close()">取 消</el-button>
      <el-button type="primary" @click="handleSubmit(formRef)" :loading="apiLoading">确 定</el-button>
    </template>
  </el-dialog>
</template>
<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { Message } from 'element-ui';
import KeyPersonSelect from './KeyPersonSelect';
import MapDialog from '@/components/Map/mapDialog';
// 富文本组件
import Editor from '@/components/Editor';
const props = defineProps({
  dialogAttrs: {
    type: Object,
    default: () => {
      return {
        width: '540px',
      };
    },
  },
  data: Object,
  visible: Boolean,
  type: String,
  columns: Array,
  dicts: Object,
  apis: Object,
  import: Boolean,
  multiple: Boolean,
});
const emit = defineEmits(['close', 'fail', 'success']);
const formData = ref(null);
const formRef = ref(null);
const rules = ref(null);
const apiLoading = ref(false);
const mapDialogVisible = ref(false); //地图选点组件显示
// 保存地图选点
function saveMap(pointStr, address) {
  console.log('🚀 ~ saveMap ~ :', pointStr, address);
  if (pointStr) {
    let point = pointStr.split(',');
    formData.value['longitude'] = point[0];
    formData.value['latitude'] = point[1];
    formData.value['address'] = address;
    mapDialogVisible.value = false;
    console.log('🚀 ~ saveMap ~ formData.value:', formData.value);
  } else {
    Message.error('请在地图上选择点位');
  }
}
function initMapCenter(item) {
  console.log(item, formData.value);
  let initCenter = [120.130203, 30.259324]; //默认坐标点
  if (formData.value.latitude && formData.value.longitude) {
    initCenter = [formData.value.longitude, formData.value.latitude];
  }
  return initCenter;
}
watch(
  () => props.data,
  (v) => {
    console.log('props.data', v, formData.value);
    formData.value = v;
  }
);
const close = () => {
  emit('close', false);
};
function handleKeyPersonSelectChange(v, updateFormProps) {
  if (typeof updateFormProps == 'object') {
    for (let key in updateFormProps) {
      //key对应v的字段,key在updateFormProps的值对应formData中的字段
      // console.log(key, updateFormProps[key]);
      formData.value[updateFormProps[key]] = v[key];
    }
  }
  console.log('🚀 ~ handleKeyPersonSelectChange ~ v, formData.value:', v, formData.value);
}

// 改变fileName
function handleFileChange(fileList, formPropKey, fileKey) {
  console.log('handleFileChange', fileList, formPropKey);
  let fileNames = '';
  if (fileList && fileList.length > 0) {
    fileList.forEach((file, index) => {
      if (index == 0) {
        fileNames += file[fileKey];
      } else {
        fileNames += `,${file[fileKey]}`;
      }
    });
  }
  formData.value[formPropKey] = fileNames;
  console.log(formData.value);
}

function treeselectChange(selectValue, updateObj, updateKey = 'divisionCode', labelKey = 'divisionName') {
  console.log('treeselectChange', selectValue);
  if (updateObj && updateKey) {
    updateObj[updateKey] = selectValue.weight;
    if (labelKey) {
      updateObj[labelKey] = selectValue.label;
    }
  }
}
const handleSubmit = (formRef) => {
  console.log(props.type, formData.value);
  formRef.validate((valid) => {
    if (valid) {
      console.log('validate', valid);
      let apiKey = props.type == 'add' ? 'add' : 'update';
      apiLoading.value = true;
      let data = { ...formData.value };
      console.log(apiKey, data);

      if (props.apis[apiKey]['data']) {
        //post接口合并data
        data = { ...formData.value, ...props.apis[apiKey]['data'] };
        console.log('post接口数据合并', data);
      }
      // props.columns.forEach((i) => {
      //   if (i.type == 'el-select' && i.attributes.multiple) {
      //     // console.log(i.prop);
      //     data[i.prop] = data[i.prop].toString(); //多选存为字符串
      //     // console.log(data);
      //   }
      // });

      if (props.apis[apiKey]['path']) {
        props.apis[apiKey]['fn'](props.apis[apiKey]['path'], data)
          .then((res) => {
            if (res.code === 200) {
              emit('success', res);
              Message.success(res.msg);
              close();
            } else {
              emit('fail', res);
            }
          })
          .finally(() => {
            apiLoading.value = false;
          });
      } else {
        props.apis[apiKey]['fn'](data)
          .then((res) => {
            if (res.code === 200) {
              emit('success', res);
              Message.success(res.msg);
              close();
            } else {
              emit('fail', res);
            }
          })
          .finally(() => {
            apiLoading.value = false;
          });
      }
    }
  });
};

const beforeClose = () => {
  formRef.value.resetFields();
  emit('close');
};

function initRules() {
  let obj = {};
  props.columns.forEach((item) => {
    if (item.required) {
      if (item.rule) {
        obj[item.prop] = item.rule;
      } else {
        obj[item.prop] = [{ required: true, message: '该值不能为空', trigger: ['change'] }];
      }
    }
  });
  // console.log('initRules', obj);
  return obj;
}
onMounted(() => {
  console.log('EditTableEditDialog', props);
  formData.value = props.data;
  rules.value = initRules();
});
</script>
<style lang="scss" scoped>
.dialog.el-dialog {
  > .el-dialog__header {
    :deep(.el-dialog__headerbtn) {
      display: none;
    }
  }
}
</style>
