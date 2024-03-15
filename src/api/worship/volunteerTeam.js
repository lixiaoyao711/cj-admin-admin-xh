import request from '@/utils/request'

// 查询志愿小队列表
export function listVolunteerTeam(query) {
  return request({
    url: '/worship/volunteerTeam/list',
    method: 'get',
    params: query
  })
}

// 查询志愿小队详细
export function getVolunteerTeam(id) {
  return request({
    url: '/worship/volunteerTeam/' + id,
    method: 'get'
  })
}

// 新增志愿小队
export function addVolunteerTeam(data) {
  return request({
    url: '/worship/volunteerTeam',
    method: 'post',
    data: data
  })
}

// 修改志愿小队
export function updateVolunteerTeam(data) {
  return request({
    url: '/worship/volunteerTeam',
    method: 'put',
    data: data
  })
}

// 删除志愿小队
export function delVolunteerTeam(id) {
  return request({
    url: '/worship/volunteerTeam/' + id,
    method: 'delete'
  })
}
