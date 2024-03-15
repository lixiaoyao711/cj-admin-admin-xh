import request from '@/utils/request'

// 查询浙里办-相关政策列表
export function listRelatedPolicies(query) {
  return request({
    url: '/worship/relatedPolicies/list',
    method: 'get',
    params: query
  })
}

// 查询浙里办-相关政策详细
export function getRelatedPolicies(id) {
  return request({
    url: '/worship/relatedPolicies/' + id,
    method: 'get'
  })
}

// 新增浙里办-相关政策
export function addRelatedPolicies(data) {
  return request({
    url: '/worship/relatedPolicies',
    method: 'post',
    data: data
  })
}

// 修改浙里办-相关政策
export function updateRelatedPolicies(data) {
  return request({
    url: '/worship/relatedPolicies',
    method: 'put',
    data: data
  })
}

// 删除浙里办-相关政策
export function delRelatedPolicies(id) {
  return request({
    url: '/worship/relatedPolicies/' + id,
    method: 'delete'
  })
}
