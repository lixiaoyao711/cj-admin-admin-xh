import request from '@/utils/request';
// 接口模块: 应急预案
const moduleName = 'emergencyPlan';
// 查询列表
export function list(query) {
  return request({
    url: `/worship/${moduleName}/list`,
    method: 'get',
    params: query || {},
  });
}

// 获取信息
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

// 导出就业创业人员情况列表
export function exportList(query) {
  return request({
    url: `/worship/${moduleName}/export`,
    method: 'post',
    params: query || {},
  });
}
