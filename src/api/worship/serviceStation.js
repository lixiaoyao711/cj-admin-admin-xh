import request from '@/utils/request'

// 查询退役军人服务站管理列表
export function listServiceStation(query) {
  return request({
    url: '/worship/serviceStation/list',
    method: 'get',
    params: query
  })
}

// 查询退役军人服务站管理详细
export function getServiceStation(id) {
  return request({
    url: '/worship/serviceStation/' + id,
    method: 'get'
  })
}

// 新增退役军人服务站管理
export function addServiceStation(data) {
  return request({
    url: '/worship/serviceStation',
    method: 'post',
    data: data
  })
}

// 修改退役军人服务站管理
export function updateServiceStation(data) {
  return request({
    url: '/worship/serviceStation',
    method: 'put',
    data: data
  })
}

// 删除退役军人服务站管理
export function delServiceStation(id) {
  return request({
    url: '/worship/serviceStation/' + id,
    method: 'delete'
  })
}
