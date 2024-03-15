import request from '@/utils/request'

// 查询纪念设施维护记录列表
export function listMemorialFacilitiesMtLogs(query) {
  return request({
    url: '/worship/memorialFacilitiesMtLogs/list',
    method: 'get',
    params: query
  })
}

// 查询纪念设施维护记录详细
export function getMemorialFacilitiesMtLogs(id) {
  return request({
    url: '/worship/memorialFacilitiesMtLogs/' + id,
    method: 'get'
  })
}

// 新增纪念设施维护记录
export function addMemorialFacilitiesMtLogs(data) {
  return request({
    url: '/worship/memorialFacilitiesMtLogs',
    method: 'post',
    data: data
  })
}

// 修改纪念设施维护记录
export function updateMemorialFacilitiesMtLogs(data) {
  return request({
    url: '/worship/memorialFacilitiesMtLogs',
    method: 'put',
    data: data
  })
}

// 删除纪念设施维护记录
export function delMemorialFacilitiesMtLogs(id) {
  return request({
    url: '/worship/memorialFacilitiesMtLogs/' + id,
    method: 'delete'
  })
}
