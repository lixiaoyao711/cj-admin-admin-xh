import request from '@/utils/request';

// 查询关爱基金-项目管理列表
export function projectManagementList(query) {
  return request({
    url: '/worship/projectManagement/list',
    method: 'get',
    params: query,
  });
}
// 查询基金使用情况
export function fundUsageList(query) {
  return request({
    url: '/worship/projectManagement/fundUsage',
    method: 'get',
    params: query,
  });
}
// 查询基金使用情况详情
export function getAssistanceApplication(id) {
  return request({
    url: '/worship/assistanceApplication/' + id,
    method: 'get',
  });
}
// 查询关爱基金-我要捐助列表
export function donationFormList(query) {
  return request({
    url: '/worship/donationForm/list',
    method: 'get',
    params: query,
  });
}
// 获取我的待办
export function assistancePendingList(query) {
  return request({
    url: '/worship/assistancePending/getMyToDoList',
    method: 'get',
    params: query,
  });
}
// 获取关爱基金详情
export function getProjectManagement(id) {
  return request({
    url: `/worship/projectManagement/${id}`,
    method: 'get',
  });
}
// 获取关爱基金-我要捐助详细信息
export function getDonationForm(id) {
  return request({
    url: `/worship/donationForm/${id}`,
    method: 'get',
  });
}
// 新增关爱基金-项目管理列表
export function addProjectManagement(data) {
  return request({
    url: '/worship/projectManagement',
    method: 'post',
    data,
  });
}
// 新增关爱基金-救助申请
export function addAssistanceApplication(data) {
  return request({
    url: '/worship/assistanceApplication',
    method: 'post',
    data,
  });
}
// 修改关爱基金-救助申请
export function updateAssistanceApplication(data) {
  return request({
    url: '/worship/assistanceApplication',
    method: 'put',
    data,
  });
}
// 新增关爱基金-我要捐助
export function addDonationForm(data) {
  return request({
    url: '/worship/donationForm',
    method: 'post',
    data,
  });
}
// 修改关爱基金-项目管理列表
export function updateProjectManagement(data) {
  return request({
    url: '/worship/projectManagement',
    method: 'put',
    data,
  });
}

// 删除关爱基金-救助申请
export function deleteAssistanceApplication(ids) {
  return request({
    url: `/worship/assistanceApplication/${ids}`,
    method: 'delete',
  });
}
// 修改关爱基金-我要捐助
export function updateDonationForm(data) {
  return request({
    url: '/worship/donationForm',
    method: 'put',
    data,
  });
}
// 流程操作接口 operationType 操作类型 0:未通过 1:通过 applicationProcess 流程id
export function changeAssistanceApplication(data) {
  return request({
    url: '/worship/assistanceApplication/processOperation',
    method: 'post',
    data,
  });
}
// 删除项目管理列表
export function delBasicPerson(ids) {
  return request({
    url: `/worship/projectManagement/${ids}`,
    method: 'delete',
  });
}
// 删除关爱基金-我要捐助
export function delDonationForm(ids) {
  return request({
    url: `/worship/donationForm/${ids}`,
    method: 'delete',
  });
}

//新增浙里办-相关政策
export function addInsertCurrency(data) {
  return request({
    url: `/worship/systemConfig/insertCurrency`,
    method: 'post',
    data,
  });
}
//更新浙里办-相关政策
export function updateInsertCurrency(data) {
  return request({
    url: `/worship/systemConfig/updateCurrency`,
    method: 'post',
    data,
  });
}
//查询浙里办-相关政策
export function systemConfigList(params) {
  return request({
    url: `/worship/systemConfig/list`,
    method: 'get',
    params,
  });
}
