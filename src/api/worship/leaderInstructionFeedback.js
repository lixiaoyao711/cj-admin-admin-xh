import request from '@/utils/request'

// 查询领导批示反馈列表
export function listLeaderInstructionFeedback(query) {
  return request({
    url: '/worship/leaderInstructionFeedback/list',
    method: 'get',
    params: query
  })
}

// 查询领导批示反馈详细
export function getLeaderInstructionFeedback(id) {
  return request({
    url: '/worship/leaderInstructionFeedback/' + id,
    method: 'get'
  })
}

// 新增领导批示反馈
export function addLeaderInstructionFeedback(data) {
  return request({
    url: '/worship/leaderInstructionFeedback',
    method: 'post',
    data: data
  })
}

// 修改领导批示反馈
export function updateLeaderInstructionFeedback(data) {
  return request({
    url: '/worship/leaderInstructionFeedback',
    method: 'put',
    data: data
  })
}

// 删除领导批示反馈
export function delLeaderInstructionFeedback(id) {
  return request({
    url: '/worship/leaderInstructionFeedback/' + id,
    method: 'delete'
  })
}
