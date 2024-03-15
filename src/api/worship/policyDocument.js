import request from '@/utils/request'

// 查询政策文件列表
export function listPolicyDocument(query) {
  return request({
    url: '/worship/policyDocument/list',
    method: 'get',
    params: query
  })
}

// 查询政策文件详细
export function getPolicyDocument(id) {
  return request({
    url: '/worship/policyDocument/' + id,
    method: 'get'
  })
}

// 新增政策文件
export function addPolicyDocument(data) {
  return request({
    url: '/worship/policyDocument',
    method: 'post',
    data: data
  })
}

// 修改政策文件
export function updatePolicyDocument(data) {
  return request({
    url: '/worship/policyDocument',
    method: 'put',
    data: data
  })
}

// 删除政策文件
export function delPolicyDocument(id) {
  return request({
    url: '/worship/policyDocument/' + id,
    method: 'delete'
  })
}
