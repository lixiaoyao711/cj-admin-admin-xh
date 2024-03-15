import request from '@/utils/request';

// 查询每月不稳定风险排查列表
export function listRiskScreen(query) {
  return request({
    url: '/worship/riskScreen/list',
    method: 'get',
    params: query,
  });
}
// 每月不稳定风险排查统计
export function listRiskScreenStat(query) {
  return request({
    url: '/worship/riskScreenStat/stat',
    method: 'get',
    params: query,
  });
}
// 每月综合查看
export function riskScreenGetPageMuti(query) {
  return request({
    url: '/worship/riskScreen/getPageMuti',
    method: 'get',
    params: query,
  });
}
// 每月查看镇街提交数据
export function riskScreenStatGetRiskScreen(query) {
  return request({
    url: '/worship/riskScreenStat/getRiskScreen',
    method: 'get',
    params: query,
  });
}
// 新增每月不稳定风险排查
export function addRiskScreen(data) {
  return request({
    url: '/worship/riskScreen',
    method: 'post',
    data,
  });
}
// 修改每月不稳定风险排查
export function updateRiskScreen(data) {
  return request({
    url: '/worship/riskScreen',
    method: 'put',
    data,
  });
}
// 修改每月不稳定风险排查Stat
export function updateRiskScreenStat(data) {
  return request({
    url: '/worship/riskScreenStat',
    method: 'put',
    data,
  });
}
// 获取每月不稳定风险排查详细信息
export function getRiskScreenStat(id) {
  return request({
    url: `/worship/riskScreenStat/${id}`,
    method: 'get',
  });
}
// 删除每月不稳定风险排查
export function deleteRiskScreen(ids) {
  return request({
    url: `/worship/riskScreen/${ids}`,
    method: 'delete',
  });
}
// 查询每月风险排查表权限
export function riskSignConfigCheckSignPerm(query) {
  return request({
    url: `/worship/riskSignConfig/checkSignPerm`,
    method: 'get',
    params: query,
  });
}
// 每月提交上级
export function riskScreenSubmitSuperior(query) {
  return request({
    url: `/worship/riskScreen/submitSuperior`,
    method: 'get',
    params: query,
  });
}
// 每月撤回提交
export function riskScreenRollback(query) {
  return request({
    url: `/worship/riskScreen/rollback`,
    method: 'get',
    params: query,
  });
}

// 查询每日风险零报告统计列表
export function listRiskZeroStat(query) {
  return request({
    url: '/worship/riskZeroStat/list',
    method: 'get',
    params: query,
  });
}
// 查询风险零报详情列表列表
export function listRiskZero(query) {
  return request({
    url: '/worship/riskZero/list',
    method: 'get',
    params: query,
  });
}
// 每日查看镇街提交数据
export function riskZeroStatGetRiskZero(query) {
  return request({
    url: '/worship/riskZeroStat/getRiskZero',
    method: 'get',
    params: query,
  });
}
// 每日不稳定风险排查统计
export function listRiskZeroStatStat(query) {
  return request({
    url: '/worship/riskZeroStat/stat',
    method: 'get',
    params: query,
  });
}
// 每日综合查看
export function riskZeroGetPageMuti(query) {
  return request({
    url: '/worship/riskZero/getPageMuti',
    method: 'get',
    params: query,
  });
}
// 新增每日风险零报告统计
export function addRiskZeroStat(data) {
  return request({
    url: '/worship/riskZeroStat',
    method: 'post',
    data,
  });
}

// 修改每日风险零报告统计Stat
export function updateRiskZeroStat(data) {
  return request({
    url: '/worship/riskZeroStat',
    method: 'put',
    data,
  });
}
// 新增风险零报详情
export function addRiskZero(data) {
  return request({
    url: '/worship/riskZero',
    method: 'post',
    data,
  });
}
// 修改风险零报详情
export function updateRiskZero(data) {
  return request({
    url: '/worship/riskZero',
    method: 'put',
    data,
  });
}
// 获取每日风险零报告统计详细信息
export function getRiskZeroStat(id) {
  return request({
    url: `/worship/riskZeroStat/${id}`,
    method: 'get',
  });
}
// 删除每日风险零报告详情
export function deleteRiskZero(ids) {
  return request({
    url: `/worship/riskZero/${ids}`,
    method: 'delete',
  });
}
// 删除每日风险零报告统计
export function deleteRiskZeroStat(ids) {
  return request({
    url: `/worship/riskZeroStat/${ids}`,
    method: 'delete',
  });
}
// 每日提交上级
export function riskZeroSubmitSuperior(query) {
  return request({
    url: `/worship/riskZero/submitSuperior`,
    method: 'get',
    params: query,
  });
}
// 每日撤回提交
export function riskZeroRollback(query) {
  return request({
    url: `/worship/riskZero/rollback`,
    method: 'get',
    params: query,
  });
}

// 查询风险排查不定期风险报告列表
export function listRiskFile(query) {
  return request({
    url: `/worship/riskFile/list`,
    method: 'get',
    params: query,
  });
}
// 新增风险排查不定期风险报告
export function addRiskFile(data) {
  return request({
    url: `/worship/riskFile`,
    method: 'post',
    data,
  });
}
// 删除风险排查不定期风险报告
export function delRiskFile(ids) {
  return request({
    url: `/worship/riskFile/${ids}`,
    method: 'delete',
  });
}
// 风险排查不定期风险报告 -发送通知
export function sendNotice(params) {
  return request({
    url: `/worship/riskFile/sendNotice`,
    method: 'get',
    params,
  });
}
