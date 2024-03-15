import request from '@/utils/request';

// 查询走访信息标（走访慰问、困难走访、三色走访）列表
export function listVisiting(query) {
  return request({
    url: '/worship/visiting/list',
    method: 'get',
    params: query,
  });
}

// 查询走访信息标（走访慰问、困难走访、三色走访）详细
export function getVisiting(id) {
  return request({
    url: '/worship/visiting/' + id,
    method: 'get',
  });
}

// 新增走访信息标（走访慰问、困难走访、三色走访）
export function addVisiting(data) {
  return request({
    url: '/worship/visiting',
    method: 'post',
    data: data,
  });
}

// 修改走访信息标（走访慰问、困难走访、三色走访）
export function updateVisiting(data) {
  return request({
    url: '/worship/visiting',
    method: 'put',
    data: data,
  });
}

// 删除走访信息标（走访慰问、困难走访、三色走访）
export function delVisiting(id) {
  return request({
    url: '/worship/visiting/' + id,
    method: 'delete',
  });
}

// 查询走访提醒列表
export function queryVisitRemindList(query) {
  return request({
    url: '/worship/careInfo/queryVisitRemindList',
    method: 'get',
    params: query,
  });
}

// 查询走访超时记录列表
export function listVisitingOvertimeLog(query) {
  return request({
    url: '/worship/visitingOvertimeLog/list',
    method: 'get',
    divisionCodeType: 'divisionCode',
    params: query,
  });
}
