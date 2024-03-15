import request from '@/utils/request'

// 查询办公任务列表
export function listManageTask(query) {
  return request({
    url: '/worship/manageTask/list',
    method: 'get',
    params: query
  })
}



// 查询办公任务详细
export function getManageTask(id) {
  return request({
    url: '/worship/manageTask/' + id,
    method: 'get'
  })
}

// 新增办公任务
export function addManageTask(data) {
  return request({
    url: '/worship/manageTask',
    method: 'post',
    data: data
  })
}

// 修改办公任务
export function updateManageTask(data) {
  return request({
    url: '/worship/manageTask',
    method: 'put',
    data: data
  })
}

// 删除办公任务
export function delManageTask(id) {
  return request({
    url: '/worship/manageTask/' + id,
    method: 'delete'
  })
}
// 查询办公任务列表长度
export function listCount(query) {
  return request({
    url: '/worship/manageTask/typeCount',
    method: 'get',
    params: query
  })
}

// 查询所属年份
export function getYearList() {
  return request({
    url: '/worship/manageTask/getYearList',
    method: 'get'
  })
}