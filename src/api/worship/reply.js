import request from '@/utils/request';

// 查询咨询回复列表
export function listConsulting(query) {
  return request({
    url: '/worship/consulting/list',
    method: 'get',
    params: query,
  });
}
//根据id获取历史记录
export function getListById(query) {
    return request({
      url: '/worship/consulting/getListById',
      method: 'get',
      params: query,
    });
  }
// 分页查询律师咨询
export function listGetPageForLawyer(query) {
  return request({
    url: '/worship/consulting/getPageForLawyer',
    method: 'get',
    params: query,
  });
}
// 判断账号对于咨询回复下子咨询的权限
export function checkPermFromRoles(query) {
  return request({
    url: '/worship/consulting/checkPermFromRoles',
    method: 'get',
    params: query,
  });
}
// 咨询流转（设置deptId）
export function setDeptId(query) {
  return request({
    url: '/worship/consulting/setDeptId',
    method: 'get',
    params: query,
  });
}
// 新增咨询回复
export function addConsulting(data) {
  return request({
    url: '/worship/consulting',
    method: 'post',
    data,
  });
}
