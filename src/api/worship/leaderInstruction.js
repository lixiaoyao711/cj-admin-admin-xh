import request from '@/utils/request'

// 查询领导批示列表
export function listLeaderInstruction(query) {
  return request({
    url: '/worship/leaderInstruction/list',
    method: 'get',
    params: query
  })
}

// 查询领导批示详细
export function getLeaderInstruction(query) {
  return request({
    url: '/worship/leaderInstruction/getInfoWithQueryType',
    method: 'get',
    params: query
  })
}

// 新增领导批示
export function addLeaderInstruction(data) {
  return request({
    url: '/worship/leaderInstruction',
    method: 'post',
    data: data
  })
}

// 修改领导批示
export function updateLeaderInstruction(data) {
  return request({
    url: '/worship/leaderInstruction',
    method: 'put',
    data: data
  })
}

// 删除领导批示
export function delLeaderInstruction(id) {
  return request({
    url: '/worship/leaderInstruction/' + id,
    method: 'delete'
  })
}
