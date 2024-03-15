import request from '@/utils/request'

// 查询办公任务动态列表
export function listManageTaskDynamic(query) {
  return request({
    url: '/worship/manageTaskDynamic/list',
    method: 'get',
    params: query
  })
}

// 查询办公任务动态详细
export function getManageTaskDynamic(id) {
  return request({
    url: '/worship/manageTaskDynamic/' + id,
    method: 'get'
  })
}

// 新增办公任务动态
export function addManageTaskDynamic(data) {
  return request({
    url: '/worship/manageTaskDynamic',
    method: 'post',
    data: data
  })
}

// 修改办公任务动态
export function updateManageTaskDynamic(data) {
  return request({
    url: '/worship/manageTaskDynamic',
    method: 'put',
    data: data
  })
}

// 删除办公任务动态
export function delManageTaskDynamic(id) {
  return request({
    url: '/worship/manageTaskDynamic/' + id,
    method: 'delete'
  })
}
