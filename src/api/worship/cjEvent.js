import request from '@/utils/request'

// 查询党建引领活动列表
export function listPartyActivities(query) {
  return request({
    url: '/worship/partyActivities/list',
    method: 'get',
    params: query
  })
}

// 查询党建引领活动详细
export function getPartyActivities(id) {
  return request({
    url: '/worship/partyActivities/' + id,
    method: 'get'
  })
}

// 新增党建引领活动
export function addPartyActivities(data) {
  return request({
    url: '/worship/partyActivities',
    method: 'post',
    data: data
  })
}

// 修改党建引领活动
export function updatePartyActivities(data) {
  return request({
    url: '/worship/partyActivities',
    method: 'put',
    data: data
  })
}

// 删除党建引领活动
export function delPartyActivities(id) {
  return request({
    url: '/worship/partyActivities/' + id,
    method: 'delete'
  })
}
