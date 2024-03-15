import request from '@/utils/request'

// 查询领导接访列表
export function listLeaderShip(query) {
  return request({
    url: '/worship/leaderShip/list',
    method: 'get',
    params: query
  })
}

// 查询领导接访详细
export function getLeaderShip(id) {
  return request({
    url: '/worship/leaderShip/' + id,
    method: 'get'
  })
}

// 新增领导接访
export function addLeaderShip(data) {
  return request({
    url: '/worship/leaderShip',
    method: 'post',
    data: data
  })
}

// 修改领导接访
export function updateLeaderShip(data) {
  return request({
    url: '/worship/leaderShip',
    method: 'put',
    data: data
  })
}

// 删除领导接访
export function delLeaderShip(id) {
  return request({
    url: '/worship/leaderShip/' + id,
    method: 'delete'
  })
}
