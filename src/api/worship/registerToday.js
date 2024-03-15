import request from '@/utils/request';
// 接口模块：红色园地
const moduleName = 'redGarden';
// 查询信访当日登记情况列表
export function listGetPetitionDailyLog(params) {
  return request({
    url: `/worship/petitionDailyLog/list`,
    method: 'get',
    params,
  });
}
// 修改信访当日登记情况
export function updateGetPetitionDailyLog(data) {
  return request({
    url: `/worship/petitionDailyLog`,
    method: 'put',
    data,
  });
}
// 获取信访当日登记情况详细信息
export function getPetitionDailyLog(id) {
  return request({
    url: `/worship/petitionDailyLog/${id}`,
    method: 'get',
  });
}
// 重新生成并更新单条
export function updateDataSingle(params) {
  return request({
    url: `/worship/petitionDailyLog/updateDataSingle`,
    method: 'get',
    params,
  });
}
// 生成当日全部新数据
export function generateNewDataFull(params) {
  return request({
    url: `/worship/petitionDailyLog/generateNewDataFull`,
    method: 'get',
    params,
  });
}
