import request from '@/utils/request'

// 查询选树典型列表
export function listTypical(query) {
  return request({
    url: '/worship/typical/list',
    method: 'get',
    params: query
  })
}

// 查询选树典型详细
export function getTypical(id) {
  return request({
    url: '/worship/typical/' + id,
    method: 'get'
  })
}

// 新增选树典型
export function addTypical(data) {
  return request({
    url: '/worship/typical',
    method: 'post',
    data: data
  })
}

// 修改选树典型
export function updateTypical(data) {
  return request({
    url: '/worship/typical',
    method: 'put',
    data: data
  })
}

// 删除选树典型
export function delTypical(id) {
  return request({
    url: '/worship/typical/' + id,
    method: 'delete'
  })
}

// 查询选树典型年份
export function getYearList() {
  return request({
    url: '/worship/typical/getYearList',
    method: 'get'
  })
}
