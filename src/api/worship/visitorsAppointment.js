import request from '@/utils/request';

// 查询访客预约列表
export function listVisitorsAppointment(query) {
  return request({
    url: '/worship/visitorsAppointment/list',
    method: 'get',
    params: query,
  });
}
// 获取访客预约详细信息
export function getVisitAppointment(id) {
  return request({
    url: `/worship/visitAppointment/${id}`,
    method: 'get',
  });
}
// 新增访客预约
export function addVisitorsAppointment(data) {
  return request({
    url: '/worship/visitorsAppointment',
    method: 'post',
    data,
  });
}
// 修改访客预约
export function updateVisitorsAppointment(data) {
  return request({
    url: '/worship/visitorsAppointment',
    method: 'post',
    data,
  });
}
