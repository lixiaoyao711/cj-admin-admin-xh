import request from '@/utils/request';

// 查询信访咨询列表
export function listPetitionInfo(query) {
  return request({
    url: '/worship/petitionInfo/list',
    method: 'get',
    divisionCodeType: 'infoDivisionCode',
    params: query,
  });
}
// 获取待我审核或我已审核列表
export function listPetitionFeedbackLog(query) {
  return request({
    url: '/worship/petitionFeedbackLog/getPermPage',
    method: 'get',
    divisionCodeType: 'infoDivisionCode',
    params: query,
  });
}
// 获取信访咨询详细信息
export function getPetitionInfo(id) {
  return request({
    url: `/worship/petitionInfo/${id}`,
    method: 'get',
  });
}
// 新增信访咨询
export function addPetitionInfo(data) {
  return request({
    url: '/worship/petitionInfo',
    method: 'post',
    data,
  });
}
// 修改信访咨询
export function updatePetitionInfo(data) {
  return request({
    url: '/worship/petitionInfo',
    method: 'put',
    data,
  });
}
// 删除信访咨询
export function delPetitionInfo(ids) {
  return request({
    url: `/worship/petitionInfo/${ids}`,
    method: 'DELETE',
  });
}
//获取信访咨询列表tab数量
export function getTabNum(query) {
  return request({
    url: `/worship/petitionInfo/getTabNum`,
    method: 'get',
    divisionCodeType: 'infoDivisionCode',
    params: query,
  });
}
//信访流转操作
export function petitionInfoPost(data) {
  return request({
    url: `/worship/petitionInfo/post`,
    method: 'post',
    data,
  });
}
//根据行政区划和岗位名称获取用户列表
export function getUserListByDivCodeAndPostName(query) {
  return request({
    url: `/system/user/getUserListByDivCodeAndPostName`,
    method: 'get',
    params: query,
  });
}
//获取流转详情
export function getLogList(query) {
  return request({
    url: `/worship/petitionFeedbackLog/getLogList`,
    method: 'get',
    params: query,
  });
}
//新增信访重复访
export function petitionInfoRepeat(data) {
  return request({
    url: `/worship/petitionInfoRepeat`,
    method: 'post',
    data,
  });
}
//审核接口
export function permFeedback(query) {
  return request({
    url: `/worship/petitionFeedbackLog/permFeedback`,
    method: 'get',
    params: query,
  });
}

//根据人员信息id查询关联信访咨询
export function queryPetitionInfoByPersonId(query) {
  // query: {
  //   personId: personId;
  // }
  return request({
    url: `/worship/petitionInfo/queryPetitionInfoByPersonId`,
    method: 'get',
    params: query,
  });
}

//根据id获取权益维护人员
export function getPersonById(query) {
  return request({
    url: `/worship/petitionPerson/getPersonById`,
    method: 'get',
    params: query,
  });
}
