import request from '@/utils/request';

// 查询操作日志列表
export function list(query) {
  return request({
    url: '/monitor/operlog/list',
    method: 'get',
    params: query,
  });
}

// 查询外部接口日志记录列表
export function listExternalInterfaceLog(query) {
  return request({
    url: '/worship/externalInterfaceLog/list',
    method: 'get',
    params: query,
  });
}

// 获取系统访问记录列表
export function listLogininfor(query) {
  return request({
    url: '/monitor/logininfor/list',
    method: 'get',
    params: query,
  });
}
// 查询登录明细
export function listGetLoginTail(query) {
  return request({
    url: '/worship/loginLog/getLoginTail',
    method: 'get',
    params: query,
  });
}
// 查询登录日志列表
export function listLoginLog(query) {
  return request({
    url: '/worship/loginLog/list',
    method: 'get',
    params: query,
  });
}
// 获取浙里办登录平均次数
export function getAverageOfLoginTime(query) {
  return request({
    url: '/worship/loginLog/getAverageOfLoginTime',
    method: 'get',
    params: query,
  });
}

// 删除操作日志
export function delOperlog(operId) {
  return request({
    url: '/monitor/operlog/' + operId,
    method: 'delete',
  });
}

// 清空操作日志
export function cleanOperlog() {
  return request({
    url: '/monitor/operlog/clean',
    method: 'delete',
  });
}
