import request from '@/utils/request'

// 查询消息通知列表
export function listMessageNotification(query) {
  return request({
    url: '/worship/messageNotification/list',
    method: 'get',
    params: query
  })
}

// 查询消息通知详细
export function getMessageNotification(id) {
  return request({
    url: '/worship/messageNotification/' + id,
    method: 'get'
  })
}

// 新增消息通知
export function addMessageNotification(data) {
  return request({
    url: '/worship/messageNotification',
    method: 'post',
    data: data
  })
}

// 修改消息通知
export function updateMessageNotification(data) {
  return request({
    url: '/worship/messageNotification',
    method: 'put',
    data: data
  })
}

// 删除消息通知
export function delMessageNotification(id) {
  return request({
    url: '/worship/messageNotification/' + id,
    method: 'delete'
  })
}
