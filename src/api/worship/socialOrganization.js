import request from '@/utils/request'

// 查询社会化组织列表
export function listSocialOrganization(query) {
  return request({
    url: '/worship/socialOrganization/list',
    method: 'get',
    params: query
  })
}

// 查询社会化组织详细
export function getSocialOrganization(id) {
  return request({
    url: '/worship/socialOrganization/' + id,
    method: 'get'
  })
}

// 新增社会化组织
export function addSocialOrganization(data) {
  return request({
    url: '/worship/socialOrganization',
    method: 'post',
    data: data
  })
}

// 修改社会化组织
export function updateSocialOrganization(data) {
  return request({
    url: '/worship/socialOrganization',
    method: 'put',
    data: data
  })
}

// 删除社会化组织
export function delSocialOrganization(id) {
  return request({
    url: '/worship/socialOrganization/' + id,
    method: 'delete'
  })
}
