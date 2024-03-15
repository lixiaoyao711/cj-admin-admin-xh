import request from '@/utils/request';

// 登录方法
export function login(username, password, code, uuid) {
  const data = {
    username,
    password,
    code,
    uuid,
  };
  return request({
    url: '/login',
    headers: {
      isToken: false,
    },
    method: 'post',
    data: data,
  });
}

// 扫码登录
export function accessTokenLogin(code) {
  return request({
    url: '/zzd/sso/accessTokenLogin',
    method: 'get',
    params: {
      code,
    },
  });
}

// 钉钉登录
export function zzdSsoLogin(code) {
  return request({
    url: '/zzd/sso/ssoLogin',
    method: 'get',
    params: {
      authCode: code,
      loginType: '1',
    },
  });
}

// 注册方法
export function register(data) {
  return request({
    url: '/register',
    headers: {
      isToken: false,
    },
    method: 'post',
    data: data,
  });
}

// 获取用户详细信息
export function getInfo() {
  return request({
    url: '/getInfo',
    method: 'get',
  });
}

// 退出方法
export function logout() {
  return request({
    url: '/logout',
    method: 'post',
  });
}

// 获取验证码
export function getCodeImg() {
  return request({
    url: '/captchaImage',
    headers: {
      isToken: false,
    },
    method: 'get',
    timeout: 20000,
  });
}

// 短信验证码
export function getCodeSms() {
  return request({
    url: '/captchaSms',
    headers: {
      isToken: false,
    },
    method: 'get',
    timeout: 20000,
  });
}
