import request from '@/utils/request'

// 查询褒扬批评列表
export function listPraiseCriticism(query) {
  return request({
    url: '/worship/praiseCriticism/list',
    method: 'get',
    params: query
  })
}

// 查询褒扬批评详细
export function getPraiseCriticism(id) {
  return request({
    url: '/worship/praiseCriticism/' + id,
    method: 'get'
  })
}

// 新增褒扬批评
export function addPraiseCriticism(data) {
  return request({
    url: '/worship/praiseCriticism',
    method: 'post',
    data: data
  })
}

// 修改褒扬批评
export function updatePraiseCriticism(data) {
  return request({
    url: '/worship/praiseCriticism',
    method: 'put',
    data: data
  })
}

// 删除褒扬批评
export function delPraiseCriticism(id) {
  return request({
    url: '/worship/praiseCriticism/' + id,
    method: 'delete'
  })
}
