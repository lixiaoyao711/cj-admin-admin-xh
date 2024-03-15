import request from '@/utils/request';

// 查询军创企业列表
export function listMilitaryEntrepreneurship(query) {
  return request({
    url: '/worship/militaryEntrepreneurship/list',
    method: 'get',
    params: query,
  });
}

// 查询军创企业详细
export function getMilitaryEntrepreneurship(id) {
  return request({
    url: '/worship/militaryEntrepreneurship/' + id,
    method: 'get',
  });
}

// 新增军创企业
export function addMilitaryEntrepreneurship(data) {
  return request({
    url: '/worship/militaryEntrepreneurship',
    method: 'post',
    data: data,
  });
}

// 修改军创企业
export function updateMilitaryEntrepreneurship(data) {
  return request({
    url: '/worship/militaryEntrepreneurship',
    method: 'put',
    data: data,
  });
}

// 删除军创企业
export function delMilitaryEntrepreneurship(id) {
  return request({
    url: '/worship/militaryEntrepreneurship/' + id,
    method: 'delete',
  });
}

//获取创业人员列表
export function queryPersonPageList(query) {
  return request({
    url: '/worship/militaryEntrepreneurship/queryPersonPageList',
    method: 'get',
    params: query,
  });
}
