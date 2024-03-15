import request from '@/utils/request'

// 查询体检申请列表
export function listPhysicalExaminationApplication(query) {
  return request({
    url: '/worship/physicalExaminationApplication/list',
    method: 'get',
    params: query
  })
}

// 查询体检申请详细
export function getPhysicalExaminationApplication(id) {
  return request({
    url: '/worship/physicalExaminationApplication/' + id,
    method: 'get'
  })
}

// 新增体检申请
export function addPhysicalExaminationApplication(data) {
  return request({
    url: '/worship/physicalExaminationApplication',
    method: 'post',
    data: data
  })
}

// 修改体检申请
export function updatePhysicalExaminationApplication(data) {
  return request({
    url: '/worship/physicalExaminationApplication',
    method: 'put',
    data: data
  })
}

// 删除体检申请
export function delPhysicalExaminationApplication(id) {
  return request({
    url: '/worship/physicalExaminationApplication/' + id,
    method: 'delete'
  })
}
