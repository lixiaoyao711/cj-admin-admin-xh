import request from '@/utils/request';

// 查询双拥服务列表
export function listSupportTask(query) {
  return request({
    url: '/worship/supportTask/list',
    method: 'get',
    params: query,
  });
}

// 获取双拥服务详细信息
export function getSupportTask(id) {
  return request({
    url: `/worship/supportTask/${id}`,
    method: 'get',
  });
}

// 新增双拥服务
export function addSupportTask(data) {
  return request({
    url: `/worship/supportTask`,
    method: 'post',
    data,
  });
}
// 修改双拥服务
export function updateSupportTask(data) {
  return request({
    url: `/worship/supportTask`,
    method: 'put',
    data,
  });
}
// 删除双拥服务
export function deleteSupportTask(ids) {
  return request({
    url: `/worship/supportTask/${ids}`,
    method: 'delete',
  });
}
// 流转操作接口
export function postSupportTask(data) {
  return request({
    url: `/worship/supportTask/post`,
    method: 'post',
    data,
  });
}
// 获取用户部门类别(0:部门用户 1:部队用户)
export function getUserDeptType(userId) {
  return request({
    url: `/worship/supportTask/getUserDeptType`,
    method: 'get',
    params: { userId },
  });
}

// 获取退伍军人事务局常用部门
export function getStockRetireDept() {
  return request({
    url: `/system/dept/getStockRetireDept`,
    method: 'get',
  });
}
