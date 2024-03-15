import request from '@/utils/request';

// 走访统计人员走访数据分析
export function getVisitStatisticsCon(query) {
  return request({
    url: '/worship/supportScreen/getVisitStatisticsCon',
    method: 'get',
    params: query,
  });
}
// 走访统计频率覆盖率数据分析
export function getVisitDataAnalysisForStatistics(query) {
  return request({
    url: '/worship/supportScreen/getVisitDataAnalysisForStatistics',
    method: 'get',
    params: query,
  });
}
