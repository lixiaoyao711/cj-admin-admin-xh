import request from '@/utils/request'

// 查询现役军人列表
export function listServiceMen(query) {
  return request({
    url: '/worship/serviceMen/list',
    method: 'get',
    params: query
  })
}

// 查询现役军人详细
export function getServiceMen(id) {
  return request({
    url: '/worship/serviceMen/' + id,
    method: 'get'
  })
}

// 新增现役军人
export function addServiceMen(data) {
  return request({
    url: '/worship/serviceMen',
    method: 'post',
    data: data
  })
}

// 修改现役军人
export function updateServiceMen(data) {
  return request({
    url: '/worship/serviceMen',
    method: 'put',
    data: data
  })
}

// 删除现役军人
export function delServiceMen(id) {
  return request({
    url: '/worship/serviceMen/' + id,
    method: 'delete'
  })
}
