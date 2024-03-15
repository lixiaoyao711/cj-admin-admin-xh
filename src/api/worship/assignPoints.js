import request from '@/utils/request';

// 查询分数总和列表
export function totalList(query) {
  return request({
    url: 'total/list',
    method: 'get',
    baseURL: process.env.NODE_ENV !== 'development' ? process.env.VUE_APP_BASE_API + '/fraction/' : '/fraction-api',
    params: query,
  });
}
// 查询最后得分
export function getFractionTotalByCode(query) {
  return request({
    url: 'total/getFractionTotalByCode',
    method: 'get',
    baseURL: process.env.NODE_ENV !== 'development' ? process.env.VUE_APP_BASE_API + '/fraction/' : '/fraction-api',
    params: query,
  });
}
