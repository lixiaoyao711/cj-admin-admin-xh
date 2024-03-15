import request from '@/utils/request';
// 接口模块：崇军事件
const moduleName = 'event';
// 列表
export function list(query) {
  return request({
    url: `/worship/${moduleName}/list`,
    method: 'get',
    params: query,
  });
}

// 查询详细
export function get(id) {
  return request({
    url: `/worship/${moduleName}/` + id,
    method: 'get',
  });
}

// 新增
export function add(data) {
  return request({
    url: `/worship/${moduleName}`,
    method: 'post',
    data: data,
  });
}

// 修改
export function update(data) {
  return request({
    url: `/worship/${moduleName}`,
    method: 'put',
    data: data,
  });
}

// 删除
export function del(id) {
  return request({
    url: `/worship/${moduleName}/` + id,
    method: 'delete',
  });
}
