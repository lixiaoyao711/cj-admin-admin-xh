import request from '@/utils/request'

// 查询纪念设施列表
export function listMemorialFacilities(query) {
  return request({
    url: '/worship/memorialFacilities/list',
    method: 'get',
    params: query
  })
}

// 查询纪念设施详细
export function getMemorialFacilities(id) {
  return request({
    url: '/worship/memorialFacilities/' + id,
    method: 'get'
  })
}

// 新增纪念设施
export function addMemorialFacilities(data) {
  return request({
    url: '/worship/memorialFacilities',
    method: 'post',
    data: data
  })
}

// 修改纪念设施
export function updateMemorialFacilities(data) {
  return request({
    url: '/worship/memorialFacilities',
    method: 'put',
    data: data
  })
}

// 删除纪念设施
export function delMemorialFacilities(id) {
  return request({
    url: '/worship/memorialFacilities/' + id,
    method: 'delete'
  })
}
