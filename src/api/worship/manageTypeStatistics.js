import request from '@/utils/request'

// 工作统计-工作类型统计
export function getManageTypeStatistics(query) {
  return request({
    url: '/worship/manageTask/getManageTypeStatistics',
    method: 'get',
    params: query
  })
}

// 工作统计-完成任务数量趋势
export function getYearTrend(query) {
  return request({
    url: '/worship/manageTask/getYearTrend',
    method: 'get',
    params: query
  })
}

// 工作统计-科室工作统计
export function getManageDepartmentStatistics(query) {
  return request({
    url: '/worship/manageTask/getManageDepartmentStatistics',
    method: 'get',
    params: query
  })
}
