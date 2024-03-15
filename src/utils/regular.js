import axios from 'axios';
// 验证常用的设备
export function regMobile(type, str = navigator.userAgent) {
  let rule = {
    mobile: /AppleWebKit.*(Mobile|MQQBrowser)+/, // 移动端
    ios: /\(i[^;]+;( U;)? CPU.+Mac OS X/, // ios
    iphone: /.*iPhone.*/, // iPhone
    android: /(.*Linux+.*Android+.*)|(.*Android+.*Linux+.*)/, // Android
    weibo: /.*Weibo.*/, // 微博
    wechat: /.*(MicroMessenger|micromessenger)+.*/, // 微信
    pcwechat: /.*WindowsWechat+.*/, // 微信
    dingtalk: /.*DingTalk.*/, // 钉钉
    Alipay: /.*Alipay.*/, // 支付宝
    AliApp: /.*AliApp.*/, // 阿里系APP webview
    chrome: /.*(Chrome)\/([\w.]+).*/, // chrome
    lark: /.*Lark.*/, // 飞书 Lark
    // pc端
    dingtalkWin: /.*dingtalk-win.*/, // 钉钉 windows
    ie: /.*Trident.*/, // IE内核
    opera: /.*Presto.*/, // opera内核
    webKit: /.*AppleWebKit.*/, // 苹果、谷歌内核
  };
  return rule[type].test(str.trim());
}

// 自定义校验规则
export var checkPhone = (value) => {
  //验证手机号是否合法
  const reg =
    /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[1589]))\d{8}$/;
  if (reg.test(value)) {
    return true;
  }
  return false;
};

export var checkIdNumber = async (value) => {
  //验证身份证是否合法
  const res = await axios({
    url: '/util/getIdInfo',
    method: 'get',
    params: {
      idNumber: value,
    },
  }).catch((err) => {
    cb(new Error('请输入合法身份证号'));
  });
  return cb();
};
export var checkPassword = async (rule, value, cb) => {
  //验证密码是否是强密码
  const regChinese = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}$/;
  if (regChinese.test(value)) {
    return cb();
  }
  cb(new Error('密码要求字母大小写+数字+字符,至少8位以上'));
};

export function testIdentity(id) {
  // 1 "验证通过!", 0 //校验不通过
  var format = /^(([1][1-5])|([2][1-3])|([3][1-7])|([4][1-6])|([5][0-4])|([6][1-5])|([7][1])|([8][1-2]))\d{4}(([1][9]\d{2})|([2]\d{3}))(([0][1-9])|([1][0-2]))(([0][1-9])|([1-2][0-9])|([3][0-1]))\d{3}[0-9xX]$/;
  //号码规则校验
  if (!format.test(id)) {
    //    return {'status':0,'msg':'身份证号码不合规'};
    return false;
  }
  //区位码校验
  //出生年月日校验   前正则限制起始年份为1900;
  var year = id.substr(6, 4), //身份证年
    month = id.substr(10, 2), //身份证月
    date = id.substr(12, 2), //身份证日
    time = Date.parse(month + '-' + date + '-' + year), //身份证日期时间戳date
    now_time = Date.parse(new Date()), //当前时间戳
    dates = new Date(year, month, 0).getDate(); //身份证当月天数
  if (time > now_time || date > dates) {
    return false;
    //    return {'status':0,'msg':'出生日期不合规'}
  }
  //校验码判断
  var c = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2); //系数
  var b = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'); //校验码对照表
  var id_array = id.split('');
  var sum = 0;
  for (var k = 0; k < 17; k++) {
    sum += parseInt(id_array[k]) * parseInt(c[k]);
  }
  if (id_array[17].toUpperCase() != b[sum % 11].toUpperCase()) {
    return false;
    //    return {'status':0,'msg':'身份证校验码不合规'}
  }
  return true;
  //    return {'status':1,'msg':'校验通过'}
}

export function testUrl(url) {
  return /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/.test(url);
}
