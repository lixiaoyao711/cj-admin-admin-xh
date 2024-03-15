export function SelectValueToLabel(options, value, labelKey = 'dictLabel', valueKey = 'dictValue') {
  let result_label = '';
  if (options && Array.isArray(options) && value) {
    let selectOptions = options.filter((item) => {
      return value.indexOf(item[valueKey]) !== -1;
    });
    // console.log('🚀 ~ SelectValueToLabel ~ selectOptions:', selectOptions);
    selectOptions.forEach((item, index) => {
      if (value.indexOf(item[valueKey]) !== -1) {
        if (index == 0) {
          result_label += item[labelKey];
        } else {
          result_label += `,${item[labelKey]}`;
        }
      }
    });
  }
  // console.log('🚀 ~ SelectValueToLabel ~ result_label:', result_label);
  return result_label;
}

// 遍历对象,根据自定义的key值,和数据转换方法或值
export function ObjectKeyValueStr2Array(dataObj, keyMap, cloneObj = false) {
  // console.log('🚀 ~ ObjectKeyValueStr2Array ~ arguments:', arguments);
  if (dataObj && keyMap) {
    if (cloneObj) {
      //克隆数据
      let newDataObj = {};
      for (let key in dataObj) {
        if (keyMap.hasOwnProperty(key)) {
          // 需要转换的key字段
          if (typeof keyMap[key] == 'function') {
            newDataObj[key] = keyMap[key](dataObj[key]);
          } else {
            newDataObj[key] = keyMap[key];
          }
        } else {
          // 不需要转换值
          newDataObj[key] = JSON.parse(JSON.stringify(dataObj[key]));
        }
      }
    }
  }
  return dataObj;
}

// 拼接字符串转成数组(拼接符,)
export function String2Array(str, splitStr = ',') {
  let arr = [];
  if (str) {
    if (str[0] == ',') {
      // 之前错误导致以,开头的数据 去掉首个','符号
      str = str.substr(1, str.length);
    }
    arr = str.split(splitStr);
  }
  return arr;
}

// 数组转成拼接字符串(拼接符,)
export function Array2String(arr, splitStr = ',') {
  let str = '';
  if (arr) {
    str = arr.join(splitStr);
  }
  return str;
}
