import request from '@/utils/request'

// 查询信息宣传-稿件列列表
export function listInformationPromotion(query) {
  return request({
    url: '/worship/informationPromotion/list',
    method: 'get',
    params: query
  })
}

// 查询信息宣传-稿件列详细
export function getInformationPromotion(id) {
  return request({
    url: '/worship/informationPromotion/' + id,
    method: 'get'
  })
}

// 新增信息宣传-稿件列
export function addInformationPromotion(data) {
  return request({
    url: '/worship/informationPromotion',
    method: 'post',
    data: data
  })
}

// 修改信息宣传-稿件列
export function updateInformationPromotion(data) {
  return request({
    url: '/worship/informationPromotion',
    method: 'put',
    data: data
  })
}

// 删除信息宣传-稿件列
export function delInformationPromotion(id) {
  return request({
    url: '/worship/informationPromotion/' + id,
    method: 'delete'
  })
}
