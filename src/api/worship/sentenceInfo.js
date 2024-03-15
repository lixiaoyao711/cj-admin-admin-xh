import request from '@/utils/request';

// 查询被判刑人员列表
export function queryBasicInfoPageList(query) {
  return request({
    url: '/worship/sentenceInfo/queryBasicInfoPageList',
    method: 'get',
    params: query,
  });
}
// 查询被判刑信息列表
export function listSentenceInfo(params) {
  return request({
    url: '/worship/sentenceInfo/list',
    method: 'get',
    params,
  });
}

// 获取被判刑人员详细信息
export function getSentenceInfo(id) {
  return request({
    url: `/worship/sentenceInfo/${id}`,
    method: 'get',
  });
}

// 新增被判刑人员
export function addSentenceInfo(data) {
  return request({
    url: `/worship/sentenceInfo`,
    method: 'post',
    data,
  });
}
// 修改被判刑人员
export function updateSentenceInfo(data) {
  return request({
    url: `/worship/sentenceInfo`,
    method: 'put',
    data,
  });
}

// 删除被判刑人员
export function delSentenceInfo(id) {
  return request({
    url: `/worship/sentenceInfo/${id}`,
    method: 'delete',
  });
}
