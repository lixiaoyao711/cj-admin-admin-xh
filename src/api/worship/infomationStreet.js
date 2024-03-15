import request from '@/utils/request'

// 查询信息宣传-镇街投稿列表
export function listInfomationStreet(query) {
  return request({
    url: '/worship/infomationStreet/list',
    method: 'get',
    params: query
  })
}

// 查询信息宣传-镇街投稿详细
export function getInfomationStreet(id) {
  return request({
    url: '/worship/infomationStreet/' + id,
    method: 'get'
  })
}

// 新增信息宣传-镇街投稿
export function addInfomationStreet(data) {
  return request({
    url: '/worship/infomationStreet',
    method: 'post',
    data: data
  })
}

// 修改信息宣传-镇街投稿
export function updateInfomationStreet(data) {
  return request({
    url: '/worship/infomationStreet',
    method: 'put',
    data: data
  })
}

// 删除信息宣传-镇街投稿
export function delInfomationStreet(id) {
  return request({
    url: '/worship/infomationStreet/' + id,
    method: 'delete'
  })
}
