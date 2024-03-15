import request from '@/utils/request'

// 查询适龄人员列表
export function listAgeAppropriate(query) {
  return request({
    url: '/worship/ageAppropriate/list',
    method: 'get',
    params: query
  })
}

// 查询适龄人员详细
export function getAgeAppropriate(id) {
  return request({
    url: '/worship/ageAppropriate/' + id,
    method: 'get'
  })
}

// 新增适龄人员
export function addAgeAppropriate(data) {
  return request({
    url: '/worship/ageAppropriate',
    method: 'post',
    data: data
  })
}

// 修改适龄人员
export function updateAgeAppropriate(data) {
  return request({
    url: '/worship/ageAppropriate',
    method: 'put',
    data: data
  })
}

// 删除适龄人员
export function delAgeAppropriate(id) {
  return request({
    url: '/worship/ageAppropriate/' + id,
    method: 'delete'
  })
}
// 适龄人员转现役军人
export function transferToServiceMan(id) {
  return request({
    url: '/worship/ageAppropriate/transferToServiceMan?ids=' + id,
    method: 'get'
  })
}
