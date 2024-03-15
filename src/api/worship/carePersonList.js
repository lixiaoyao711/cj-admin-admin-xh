import request from '@/utils/request';

// 人员列表各列表数量
export function getTabNum(query) {
  return request({
    url: '/worship/careInfo/getTabNum',
    method: 'get',
    params: query,
  });
}

// 查询疑似困难人员信息列表
export function queryPageSuspect(query) {
  return request({
    url: '/worship/careInfo/queryPageSuspect',
    method: 'get',
    params: query,
  });
}

// 查询困难人员信息列表
export function careInfoList(query) {
  return request({
    url: '/worship/careInfo/list',
    method: 'get',
    params: query,
  });
}

// 获取困难人员信息详细信息
export function careInfoId(id) {
  return request({
    url: '/worship/careInfo/' + id,
    method: 'get',
  });
}

// 新增困难人员信息
export function addCareInfo(data) {
  return request({
    url: '/worship/careInfo',
    method: 'post',
    data: data,
  });
}

// 修改困难人员信息
export function updateCareInfo(data) {
  return request({
    url: '/worship/careInfo',
    method: 'put',
    data: data,
  });
}

// 删除困难人员信息
export function delCareInfo(id) {
  return request({
    url: '/worship/careInfo/' + id,
    method: 'delete',
  });
}

// 导出困难人员信息列表
export function exportCareInfo(data) {
  return request({
    url: '/worship/careInfo/export',
    method: 'post',
    data: data,
  });
}

// 新增脱困记录
export function addOutDifficult(data) {
  return request({
    url: '/worship/outDifficult',
    method: 'post',
    data: data,
  });
}

// 查询脱困记录列表
export function outDifficultList(query) {
  return request({
    url: '/worship/outDifficult/list',
    method: 'get',
    params: query,
  });
}

// 删除脱困记录列表
export function delOutDifficult(id) {
  return request({
    url: '/worship/outDifficult/' + id,
    method: 'delete',
  });
}
