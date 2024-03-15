import request from '@/utils/request'

// 查询送喜报列表
export function listSendGoodNews(query) {
  return request({
    url: '/worship/sendGoodNews/list',
    method: 'get',
    params: query
  })
}

// 查询送喜报详细
export function getSendGoodNews( id) {
  return request({
    url: '/worship/sendGoodNews/' +  id,
    method: 'get'
  })
}

// 新增送喜报
export function addSendGoodNews(data) {
  return request({
    url: '/worship/sendGoodNews',
    method: 'post',
    data: data
  })
}

// 修改送喜报
export function updateSendGoodNews(data) {
  return request({
    url: '/worship/sendGoodNews',
    method: 'put',
    data: data
  })
}

// 删除送喜报
export function delSendGoodNews( id) {
  return request({
    url: '/worship/sendGoodNews/' +  id,
    method: 'delete'
  })
}
