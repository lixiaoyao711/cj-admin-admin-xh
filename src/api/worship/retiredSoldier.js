import request from '@/utils/request';
/**
 * 查询人员基本信息列表
 * @param {attribute} 1:退役军人 2:其他优抚对象
 * @returns
 */
export function listBasicPerson(query) {
  return request({
    url: '/worship/basicPerson/list',
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

/**
  查询人员信息拓展列表
 * @param {expandParentType} 拓展父类型 A:基本信息 B:组织生活信息 C:服役信息 D:安置信息 E:就业创业信息 F:教育培训信息 G:抚恤有待信息 H:褒扬激励信息 I:帮扶救援信息 
 * @returns 
 */
export function personExpandPersonExpandList(params) {
  return request({
    url: '/personExpand/personExpand/list',
    method: 'get',
    params,
  });
}
/**
 * 根据id查询人员信息拓展
 * @param {*} id
 * @returns
 */
export function getPersonExpandById(id) {
  return request({
    url: `/personExpand/personExpand/${id}`,
    method: 'get',
  });
}
/**
 * 新增人员信息拓展
 * @param {*} data
 * @returns
 */
export function addPersonExpand(data) {
  return request({
    url: `/personExpand/personExpand`,
    method: 'post',
    data,
  });
}
/**
 * 修改人员信息拓展
 * @param {*} data
 * @returns
 */
export function updatePersonExpand(data) {
  return request({
    url: `/personExpand/personExpand`,
    method: 'put',
    data,
  });
}
/**
 * 删除人员信息拓展
 * @param {*} id
 * @returns
 */
export function delPersonExpand(id) {
  return request({
    url: `/personExpand/personExpand/${id}`,
    method: 'delete',
  });
}

// 现役军人转退役军人
export function transferRetireMan(data) {
  return request({
    url: '/worship/serviceMen/transferRetireMan',
    method: 'post',
    data: data,
  });
}