import request from '@/utils/request'

// 查询体检人员关联信息列表
export function listPhysicalExaminationPerson(query) {
  return request({
    url: '/worship/physicalExaminationPerson/list',
    method: 'get',
    params: query
  })
}

// 查询体检人员关联信息详细
export function getPhysicalExaminationPerson(examexaminationId) {
  return request({
    url: '/worship/physicalExaminationPerson/' + examexaminationId,
    method: 'get'
  })
}

// 新增体检人员关联信息
export function addPhysicalExaminationPerson(data) {
  return request({
    url: '/worship/physicalExaminationPerson',
    method: 'post',
    data: data
  })
}

// 修改体检人员关联信息
export function updatePhysicalExaminationPerson(data) {
  return request({
    url: '/worship/physicalExaminationPerson',
    method: 'put',
    data: data
  })
}

// 删除体检人员关联信息
export function delPhysicalExaminationPerson(examexaminationId) {
  return request({
    url: '/worship/physicalExaminationPerson/' + examexaminationId,
    method: 'delete'
  })
}
