import request from '@/utils/request'

// 查询人员基本信息列表
export function listBasicPerson(query) {
  return request({
    url: '/worship/basicPerson/list',
    method: 'get',
    params: query
  })
}

// 查询人员基本信息详细
export function getBasicPerson(id) {
  return request({
    url: '/worship/basicPerson/' + id,
    method: 'get'
  })
}

// 新增人员基本信息
export function addBasicPerson(data) {
  return request({
    url: '/worship/basicPerson',
    method: 'post',
    data: data
  })
}

// 修改人员基本信息
export function updateBasicPerson(data) {
  return request({
    url: '/worship/basicPerson',
    method: 'put',
    data: data
  })
}

// 删除人员基本信息
export function delBasicPerson(id) {
  return request({
    url: '/worship/basicPerson/' + id,
    method: 'delete'
  })
}
