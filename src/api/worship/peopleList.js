import request from '@/utils/request';

// 查询权益维护人员列表
export function listPetitionPerson(query) {
  return request({
    url: '/worship/petitionPerson/list',
    method: 'get',
    params: query,
  });
}
// 查询权益维护户外人员列表
export function listOutdoorsPerson(query) {
  return request({
    url: '/worship/petitionPerson/list',
    method: 'get',
    divisionCodeType: 'outDivisionCode',
    params: query,
  });
}
// 查询人员基本信息列表
export function basicPersonList(query) {
  return request({
    url: '/worship/basicPerson/list',
    method: 'get',
    params: query,
  });
}

// 新增权益维护人员
export function addPetitionPerson(data) {
  return request({
    url: '/worship/petitionPerson',
    method: 'post',
    data,
  });
}

// 修改权益维护人员
export function updatePetitionPerson(data) {
  return request({
    url: '/worship/petitionPerson',
    method: 'put',
    data,
  });
}

// 获取权益维护人员详细信息
export function getPetitionPerson(id) {
  return request({
    url: `/worship/petitionPerson/${id}`,
    method: 'get',
  });
}
// 转户内人员
export function transToIn(data) {
  return request({
    url: `/worship/petitionPerson/transToIn`,
    method: 'post',
    data,
  });
}
// 批量移出重点群体
export function outToFocusGroups(ids) {
  return request({
    url: `/worship/basicPerson/outToFocusGroups`,
    method: 'get',
    params: { ids },
  });
}
// 删除权益维护人员详细信息
export function delPetitionPerson(ids) {
  return request({
    url: `/worship/petitionPerson/${ids}`,
    method: 'DELETE',
  });
}
// 三色人员列表tab数量
export function getTabNum(query) {
  return request({
    url: `/worship/petitionPerson/getTabNum`,
    method: 'get',
    params: query,
  });
}
