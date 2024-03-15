import Vue from 'vue';
import { listByIds } from '@/api/system/oss';
//删除数据时，将数据转换为字符串
export function filterDelData(ids, column, key = 'name', type = '、') {
  return ids.map((id) => column.find((item) => item.id === id)[key]).join(type);
}
//行政区划下拉框选择时，获取选择的值和文本
export function treeselectChange(node, row, key1 = 'divisionName', key2 = 'divisionCode') {
  console.log(node, row, key1, key2);
  key1 && Vue.set(row, key1, node.allLabel || node.label);
  Vue.set(row, key2, node.weight);
  console.log(row);
}
/**
 * 返回oss图片路径
 * @param {Array||object} importData 传入的数据
 * @param {string} fileType 传入的数据中图片路径的字段名
 * @param {string} returnType 返回的数据中图片路径的字段名
 * @returns
 */
export async function imgPathFilter(importData, fileType = 'fileUrl', returnType = 'fileList') {
  let returnData = JSON.parse(JSON.stringify(importData));
  if (Array.isArray(returnData)) {
    for await (const item of returnData) {
      if (item[fileType]) {
        const data = await listByIds(item[fileType]);
        item[returnType] = data.data;
      }
    }
  } else {
    if (returnData[fileType]) {
      const data = await listByIds(returnData[fileType]);
      returnData[returnType] = data.data;
    }
  }
  return returnData;
}
