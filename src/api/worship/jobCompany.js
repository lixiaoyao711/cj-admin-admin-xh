import request from '@/utils/request'

// 查询入驻企业列表
export function listJobCompany(query) {
  return request({
    url: '/worship/jobCompany/list',
    method: 'get',
    params: query
  })
}

// 查询入驻企业详细
export function getJobCompany(id) {
  return request({
    url: '/worship/jobCompany/' + id,
    method: 'get'
  })
}

// 新增入驻企业
export function addJobCompany(data) {
  return request({
    url: '/worship/jobCompany',
    method: 'post',
    data: data
  })
}

// 修改入驻企业
export function updateJobCompany(data) {
  return request({
    url: '/worship/jobCompany',
    method: 'put',
    data: data
  })
}

// 删除入驻企业
export function delJobCompany(id) {
  return request({
    url: '/worship/jobCompany/' + id,
    method: 'delete'
  })
}
