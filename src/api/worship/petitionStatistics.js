import request from '@/utils/request';

// 获取信访统计信访人员数据
export function getPetitionPersonDataStatistics(query) {
  return request({
    url: '/worship/petitionScreen/getPetitionPersonDataStatistics',
    method: 'get',
    params: query,
  });
}

// 获取信访统计信访咨询数据
export function getPetitionInfoDataStatistics(query) {
  return request({
    url: '/worship/petitionScreen/getPetitionInfoDataStatistics',
    method: 'get',
    params: query,
  });
}

// 获取信访统计趋势
export function getPetitionTrends(query) {
  return request({
    url: '/worship/petitionScreen/getPetitionTrends',
    method: 'get',
    params: query,
  });
}

// 获取镇街信访情况
export function getDivisionPetitionInfoData(query) {
  return request({
    url: '/worship/petitionScreen/getDivisionPetitionInfoData',
    method: 'get',
    params: query,
  });
}
