// 节流（高频事件触发，但在 n 秒内只会执行一次，所以节流会稀释函数的执行频率）
export function throttle(func, delay) {
  let prev = Date.now();
  return function (...args) {
    let now = Date.now();
    if (now - prev >= delay) {
      func.apply(this, args);
      prev = Date.now();
    }
  };
}
// 两个字符串日期相减
export function countDay(endTime) {
  let day1 = new Date(formatDateTime(new Date()));
  let day2 = new Date(endTime);
  let differDay = Math.abs(day2 - day1) / 1000 / 60 / 60 / 24;
  return parseInt(differDay);
}
//中国标准时间转换年月日
export function formatDateTime(date) {
  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  m = m < 10 ? '0' + m : m;
  var d = date.getDate();
  d = d < 10 ? '0' + d : d;
  var h = date.getHours();
  var minute = date.getMinutes();
  minute = minute < 10 ? '0' + minute : minute;
  return y + '-' + m + '-' + d;
  // return y + '-' + m + '-' + d + ' ' + h + ':' + minute;
}

// 获取当前月份的下个月
export function getNextMonth(date) {
  var arr = formatDateTime(date).split('-');
  // var arr = ('2022-01-31').split('-');
  var year = arr[0]; //获取当前日期的年份
  var month = arr[1]; //获取当前日期的月份
  var day = arr[2]; //获取当前日期的日
  var days = new Date(year, month, 0);
  days = days.getDate(); //获取当前日期中的月的天数
  var year2 = year;
  var month2 = parseInt(month) + 1;
  if (month2 == 13) {
    year2 = parseInt(year2) + 1;
    month2 = 1;
  }
  var day2 = day;
  var days2 = new Date(year2, month2, 0);
  days2 = days2.getDate();
  if (day2 > days2) {
    day2 = days2;
  }
  if (month2 < 10) {
    month2 = '0' + month2;
  }

  var t2 = year2 + '-' + month2 + '-' + day2;
  return t2;
}

// 获取url中的token并截取下来
export function getQueryVariable(variable) {
  let query = window.location.search.substring(1);
  let vars = query.split('&');
  for (let i = 0; i < vars.length; i++) {
    let pair = vars[i].split('=');
    if (pair[0] == variable) {
      return pair[1];
    }
  }
  return false;
}
// 时间戳转换成年月日，时分秒：
export function formatDate(value) {
  if (typeof value == 'undefined') {
    return '';
  } else {
    let date = new Date(parseInt(value));
    let y = date.getFullYear();
    let MM = date.getMonth() + 1;
    MM = MM < 10 ? '0' + MM : MM;
    let d = date.getDate();
    d = d < 10 ? '0' + d : d;
    let h = date.getHours();
    h = h < 10 ? '0' + h : h;
    let m = date.getMinutes();
    m = m < 10 ? '0' + m : m;
    let s = date.getSeconds();
    s = s < 10 ? '0' + s : s;
    return y + '-' + MM + '-' + d + ' ' + h + ':' + m + ':' + s;
  }
}

/**
 * @name: 自动转换 根据fmt返回时间类型 （yyyy:MM:dd hh:mm:ss 自动转换）
 * 例子：1982-3-27  yy年M月d日 82年3月27日
 * 例子：1982-3-7  yy年MM月dd日 82年03月07日
 * @param {*} timeDate
 * @param {*} fmt
 */
export function timeFormat(timeDate, fmt = 'yyyy-MM-dd hh:mm:ss') {
  if (!timeDate) {
    return '';
  }
  if (Number(timeDate)) {
    timeDate = Number(timeDate);
  }
  let time = new Date(timeDate);
  let o = {
    'M+': time.getMonth() + 1, //月份
    'd+': time.getDate(), //日
    'h+': time.getHours(), //小时
    'm+': time.getMinutes(), //分
    's+': time.getSeconds(), //秒
    'q+': Math.floor((time.getMonth() + 3) / 3), //季度
    S: time.getMilliseconds(), //毫秒
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (time.getFullYear() + '').substr(4 - RegExp.$1.length));
  for (let k in o)
    if (new RegExp('(' + k + ')').test(fmt))
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
  return fmt;
}

// 先给要复制的文本或者按钮加上点击事件后，并将要复制的值传过来
export async function copyValue(val) {
  if (navigator.clipboard && window.isSecureContext) {
    // navigator clipboard 向剪贴板写文本
    this.$message.success('复制成功');
    return navigator.clipboard.writeText(val);
  } else {
    // 创建text area
    const textArea = document.createElement('textarea');
    textArea.value = val;
    // 使text area不在viewport，同时设置不可见
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    this.$message.success('复制成功');
    return new Promise((res, rej) => {
      // 执行复制命令并移除文本框
      document.execCommand('copy') ? res() : rej();
      textArea.remove();
    });
  }
}
