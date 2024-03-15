import request from '@/utils/request'

// 查询双拥模范城列表
export function listExemplaryCity(query) {
  return request({
    url: '/worship/exemplaryCity/list',
    method: 'get',
    params: query
  })
}

// 查询双拥模范城详细
export function getExemplaryCity(id) {
  return request({
    url: '/worship/exemplaryCity/' + id,
    method: 'get'
  })
}

// 新增双拥模范城
export function addExemplaryCity(data) {
  return request({
    url: '/worship/exemplaryCity',
    method: 'post',
    data: data
  })
}

// 修改双拥模范城
export function updateExemplaryCity(data) {
  return request({
    url: '/worship/exemplaryCity',
    method: 'put',
    data: data
  })
}

// 删除双拥模范城
export function delExemplaryCity(id) {
  return request({
    url: '/worship/exemplaryCity/' + id,
    method: 'delete'
  })
}

// 新增双拥模范城反馈
export function addExemplaryCityLog(data) {
  return request({
    url: '/worship/exemplaryCityLog',
    method: 'post',
    data: data
  })
}

// 查询双拥模范城反馈列表
export function listExemplaryCityLog(query) {
  return request({
    url: '/worship/exemplaryCityLog/list',
    method: 'get',
    params: query
  })
}

// 获取双拥模范城反馈详细信息
export function getExemplaryCityLog(id) {
  return request({
    url: '/worship/exemplaryCityLog' + id,
    method: 'get'
  })
}