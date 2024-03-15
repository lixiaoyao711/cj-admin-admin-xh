import request from '@/utils/request';
// 获取行政区划
export function getDivisionsTreeList(code = '330106') {
  return request({
    url: `https://lsvz.xhnic.com/api/area/administrativeDivisions/getTreeList?code=${code}`,
    baseURL: null,
    method: 'get',
  });
}

// 根据code获取行政区划
export function getDivisionsByCode(code) {
  return request({
    url: `https://lsvz.xhnic.com/api/area/administrativeDivisions/byCode/${code}`,
    baseURL: null,
    method: 'get',
  });
}
