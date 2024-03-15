import request from '@/utils/request';

// 查询体检列表
export function listPhysicalExamination(query) {
  return request({
    url: '/worship/physicalExamination/list',
    method: 'get',
    params: query,
  });
}

// 查询体检详细
export function getPhysicalExamination(id) {
  return request({
    url: '/worship/physicalExamination/' + id,
    method: 'get',
  });
}

// 新增体检
export function addPhysicalExamination(data) {
  return request({
    url: '/worship/physicalExamination',
    method: 'post',
    data: data,
  });
}

// 修改体检
export function updatePhysicalExamination(data) {
  return request({
    url: '/worship/physicalExamination',
    method: 'put',
    data: data,
  });
}

// 删除体检
export function delPhysicalExamination(id) {
  return request({
    url: '/worship/physicalExamination/' + id,
    method: 'delete',
  });
}

// 发送体检短信
export function sendSms(data) {
  return request({
    url: '/worship/physicalExamination/sendSms',
    method: 'post',
    data,
  });
}
