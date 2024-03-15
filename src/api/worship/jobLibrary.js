import request from '@/utils/request'

// 查询岗位库列表
export function listJobLibrary(query) {
  return request({
    url: '/worship/jobLibrary/list',
    method: 'get',
    params: query
  })
}

// 查询岗位库详细
export function getJobLibrary(id) {
  return request({
    url: '/worship/jobLibrary/' + id,
    method: 'get'
  })
}

// 新增岗位库
export function addJobLibrary(data) {
  return request({
    url: '/worship/jobLibrary',
    method: 'post',
    data: data
  })
}

// 修改岗位库
export function updateJobLibrary(data) {
  return request({
    url: '/worship/jobLibrary',
    method: 'put',
    data: data
  })
}

// 删除岗位库
export function delJobLibrary(id) {
  return request({
    url: '/worship/jobLibrary/' + id,
    method: 'delete'
  })
}
