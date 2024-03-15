import request from '@/utils/request'

// 查询通知发布列表
export function listNotificationRelease(query) {
  return request({
    url: '/worship/notificationRelease/list',
    method: 'get',
    params: query
  })
}

// 查询通知发布详细
export function getNotificationRelease(id) {
  return request({
    url: '/worship/notificationRelease/' + id,
    method: 'get'
  })
}

// 新增通知发布
export function addNotificationRelease(data) {
  return request({
    url: '/worship/notificationRelease',
    method: 'post',
    data: data
  })
}

// 修改通知发布
export function updateNotificationRelease(data) {
  return request({
    url: '/worship/notificationRelease',
    method: 'put',
    data: data
  })
}

// 删除通知发布
export function delNotificationRelease(id) {
  return request({
    url: '/worship/notificationRelease/' + id,
    method: 'delete'
  })
}
