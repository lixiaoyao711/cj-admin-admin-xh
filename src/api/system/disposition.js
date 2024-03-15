import request from '@/utils/request';

// 新增或更新系统配置
export function insertOrUpdate(data) {
  return request({
    url: '/worship/systemConfig/insertOrUpdate',
    method: 'post',
    data: data,
  });
}

// 通过配置类型查询系统配置
export function queryByConfigType(configType) {
  return request({
    url: `/worship/systemConfig/queryByConfigType?configType=${configType}`,
    method: 'get',
  });
}

// 导出标签信息列表
export function listTag(query) {
  return request({
    url: `/worship/tagInfo/list`,
    method: 'get',
    params: query,
  });
}

// 查询公告详细
export function getTag(id) {
  return request({
    url: '/worship/tagInfo/' + id,
    method: 'get',
  });
}

// 新增标签信息
export function addTag(data) {
  return request({
    url: '/worship/tagInfo',
    method: 'post',
    data: data,
  });
}

// 修改标签信息
export function updateTag(data) {
  return request({
    url: '/worship/tagInfo',
    method: 'put',
    data: data,
  });
}

// 删除标签信息
export function delTag(id) {
  return request({
    url: '/worship/tagInfo/' + id,
    method: 'delete',
  });
}

// 根据行政区划code查询签字配置
export function getByDivisionCode(divisionCode) {
  return request({
    url: `/worship/riskSignConfig/getByDivisionCode`,
    method: 'get',
    params: { divisionCode },
  });
}
// 新增或修改风险排查签字配置
export function riskSignConfigInsertOrUpdate(data) {
  return request({
    url: `/worship/riskSignConfig/insertOrUpdate`,
    method: 'post',
    data,
  });
}
// 新增风险排查提醒配置
export function addRiskNoticeConfig(data) {
  return request({
    url: `/worship/riskNoticeConfig`,
    method: 'post',
    data,
  });
}
// 修改风险排查提醒配置
export function updateRiskNoticeConfig(data) {
  return request({
    url: `/worship/riskNoticeConfig`,
    method: 'put',
    data,
  });
}
// 查询风险排查提醒配置列表
export function riskNoticeConfigList(params) {
  return request({
    url: `/worship/riskNoticeConfig/list`,
    method: 'get',
    params,
  });
}
// 删除风险排查提醒配置
export function deleteRiskNoticeConfig(ids) {
  return request({
    url: `/worship/riskNoticeConfig/${ids}`,
    method: 'delete',
  });
}

// 获取待办标记
export function getTodoSign() {
  return request({
    url: `/worship/indexData/getTodoSign`,
    method: 'get',
  });
}
