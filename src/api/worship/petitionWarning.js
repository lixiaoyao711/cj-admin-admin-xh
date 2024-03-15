import request from '@/utils/request';

// 查询异动信息列表
export function listPetitionWarning(query) {
  return request({
    url: '/worship/petitionWarning/list',
    method: 'get',
    params: query,
  });
}
// 获取异动信息详细信息
export function getPetitionWarning(id) {
  return request({
    url: `/worship/petitionWarning/${id}`,
    method: 'get',
  });
}
// 新增异动信息
export function addPetitionWarning(data) {
  return request({
    url: `/worship/petitionWarning`,
    method: 'post',
    data,
  });
}
// 修改异动信息
export function updatePetitionWarning(data) {
  return request({
    url: `/worship/petitionWarning`,
    method: 'put',
    data,
  });
}
// 删除异动信息详细信息
export function deletePetitionWarning(ids) {
  return request({
    url: `/worship/petitionWarning/${ids}`,
    method: 'delete',
  });
}
// 获取异动信息列表tab数量
export function getTabNum(departCode) {
  return request({
    url: `/worship/petitionWarning/getTabNum`,
    method: 'get',
    params: {
      departCode,
    },
  });
}
// 异动信息反馈
export function feedback(data) {
  return request({
    url: `/worship/petitionWarning/feedback`,
    method: 'post',
    data,
  });
}
// 开启或解除预警
export function openOrClose(id) {
  return request({
    url: `/worship/petitionWarning/openOrClose`,
    method: 'get',
    params: {
      id,
    },
  });
}
// 开启或关闭追踪
export function trackOnOrOff(id) {
  return request({
    url: `/worship/petitionWarning/trackOnOrOff`,
    method: 'get',
    params: {
      id,
    },
  });
}
