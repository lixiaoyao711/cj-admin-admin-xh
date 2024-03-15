import request from '@/utils/request';

// 查询人员基本信息列表
export function listBasicPerson(query) {
  return request({
    url: '/worship/basicPerson/list',
    method: 'get',
    divisionCodeType: 'divisionCode',
    params: query,
  });
}
// 获取义务兵家属
export function conscriptsParentList(query) {
  return request({
    url: '/worship/basicPerson/getConscriptsParentList',
    method: 'get',
    params: query,
  });
}

// 查询人员基本信息详细
export function getBasicPerson(id) {
  return request({
    url: '/worship/basicPerson/' + id,
    method: 'get',
  });
}

// 新增人员基本信息
export function addBasicPerson(data) {
  return request({
    url: '/worship/basicPerson',
    method: 'post',
    data: data,
  });
}

// 修改人员基本信息
export function updateBasicPerson(data) {
  return request({
    url: '/worship/basicPerson',
    method: 'put',
    data: data,
  });
}

// 删除人员基本信息
export function delBasicPerson(id) {
  return request({
    url: '/worship/basicPerson/' + id,
    method: 'delete',
  });
}

// 获取党建引领-党员列表
export function partyMemberList(query) {
  return request({
    url: '/worship/basicPerson/partyMemberList',
    method: 'get',
    params: query,
  });
}

// 获取党建引领-兵支书列表
export function militarySupportLetterList(query) {
  return request({
    url: '/worship/basicPerson/militarySupportLetterList',
    method: 'get',
    params: query,
  });
}

// 获取党建引领-志愿者列表
export function obtainListVolunteersList(query) {
  return request({
    url: '/worship/basicPerson/obtainListVolunteersList',
    method: 'get',
    params: query,
  });
}
