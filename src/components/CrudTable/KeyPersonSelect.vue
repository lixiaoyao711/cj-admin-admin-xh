<!-- 重点人员选择 KeyPersonSelect -->
<!-- createTime : 2023-11-06 -->
<template>
  <el-select v-model="selectValue" valueKey="id" v-bind="props.attributes" @change="handleSelectChange">
    <el-option
      v-for="(item, index) in props.optionsSource"
      :key="item.id"
      :label="item[props.labelKey]"
      :value="item[props.valueKey]"
    ></el-option>
  </el-select>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { listBasicPerson } from '@/api/worship/basicPerson.js'; //获取重点人员列表({whetherToFocusOnGroups: '1'})
//const { proxy } = getCurrentInstance()
const emit = defineEmits(['change', 'update:modelValue']);
const props = defineProps({
  value: {
    type: [Object, Array, String],
  },
  labelKey: {
    type: String,
    default: 'name',
  },
  valueKey: {
    type: String,
    default: 'id',
  },
  formValueKey: {
    type: String,
    default: 'personId',
  },
  attributes: {
    type: Object,
    default: () => {
      return {
        multiple: false,
        limit: 1,
      };
    },
  },
  optionsSource: {
    type: Array,
  },
});

watch(
  () => props.value,
  (nv, ov) => {
    console.log(nv, ov);
  }
);

const selectValue = ref(props.value);

function handleSelectChange(value) {
  console.log('handleSelectChange', value);
  emit('update:value', value);
  let selectObj = null;
  props.optionsSource.forEach((element) => {
    if (element[props.valueKey] === value) {
      selectObj = element;
    }
  });
  emit('change', selectObj);
}

onMounted(() => {
  console.log(props.value);
});
</script>

<style lang="scss" scoped></style>
