import request from '@/utils/request';

// 列表查询
export function listSendSmsLog(query) {
  return request({
    url: '/worship/sendSmsLog/list',
    method: 'get',
    params: query,
  });
}
// 删除短信
export function deleteSendSmsLog(id) {
  return request({
    url: '/worship/sendSmsLog/delete',
    method: 'get',
    params: { id },
  });
}
// 发送短信
export function sendSms(data) {
  return request({
    url: '/worship/sendSmsLog/sendSms',
    method: 'post',
    data,
  });
}
// 导入短信信息
export function importSmsInfo(data) {
  return request({
    url: '/worship/sendSmsLog/importSmsInfo',
    method: 'post',
    data,
  });
}
