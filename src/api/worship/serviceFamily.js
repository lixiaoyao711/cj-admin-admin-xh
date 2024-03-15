import request from '@/utils/request';

// 查询现役军人家属列表
export function listServiceFamily(query) {
  return request({
    url: '/worship/serviceFamily/list',
    method: 'get',
    params: query,
  });
}

// 查询现役军人家属详细
export function getServiceFamily(id) {
  return request({
    url: '/worship/serviceFamily/' + id,
    method: 'get',
  });
}

// 新增现役军人家属
export function addServiceFamily(data) {
  return request({
    url: '/worship/serviceFamily',
    method: 'post',
    data: data,
  });
}

// 修改现役军人家属
export function updateServiceFamily(data) {
  return request({
    url: '/worship/serviceFamily',
    method: 'put',
    data: data,
  });
}

// 删除现役军人家属
export function del(id) {
  return request({
    url: '/worship/serviceFamily/' + id,
    method: 'delete',
  });
}
