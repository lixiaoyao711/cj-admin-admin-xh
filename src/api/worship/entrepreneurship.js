import request from '@/utils/request'

// 查询浙里办-就业创业列表
export function listEntrepreneurship(query) {
  return request({
    url: '/worship/entrepreneurship/list',
    method: 'get',
    params: query
  })
}

// 查询浙里办-就业创业详细
export function getEntrepreneurship(id) {
  return request({
    url: '/worship/entrepreneurship/' + id,
    method: 'get'
  })
}

// 新增浙里办-就业创业
export function addEntrepreneurship(data) {
  return request({
    url: '/worship/entrepreneurship',
    method: 'post',
    data: data
  })
}

// 修改浙里办-就业创业
export function updateEntrepreneurship(data) {
  return request({
    url: '/worship/entrepreneurship',
    method: 'put',
    data: data
  })
}

// 删除浙里办-就业创业
export function delEntrepreneurship(id) {
  return request({
    url: '/worship/entrepreneurship/' + id,
    method: 'delete'
  })
}
