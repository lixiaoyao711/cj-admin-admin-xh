import request from '@/utils/request'

// 查询富春老兵-活动发布列表
export function listActivityReleaseFy(query) {
  return request({
    url: '/worship/activityReleaseFy/list',
    method: 'get',
    params: query
  })
}

// 查询富春老兵-活动发布详细
export function getActivityReleaseFy(id) {
  return request({
    url: '/worship/activityReleaseFy/' + id,
    method: 'get'
  })
}

// 新增富春老兵-活动发布
export function addActivityReleaseFy(data) {
  return request({
    url: '/worship/activityReleaseFy',
    method: 'post',
    data: data
  })
}

// 修改富春老兵-活动发布
export function updateActivityReleaseFy(data) {
  return request({
    url: '/worship/activityReleaseFy',
    method: 'put',
    data: data
  })
}

// 删除富春老兵-活动发布
export function delActivityReleaseFy(id) {
  return request({
    url: '/worship/activityReleaseFy/' + id,
    method: 'delete'
  })
}
