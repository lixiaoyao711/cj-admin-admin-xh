import request from '@/utils/request'

// 信息核查
export function getVerificationInfo(query) {
  return request({
    url: '/worship/indexData/getVerificationInfo',
    method: 'get',
    params: query
  })
}

// 人员优待
export function getPrefInfo(query) {
  return request({
    url: '/worship/indexData/getPrefInfo',
    method: 'get',
    params: query
  })
}

// 待办事项
export function getTodoData(query) {
  return request({
    url: '/worship/indexData/getTodoData',
    method: 'get',
    params: query
  })
}
