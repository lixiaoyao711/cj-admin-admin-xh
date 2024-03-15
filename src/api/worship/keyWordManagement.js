// 关键字管理 模块 keyWordManagement 接口
import request from '@/utils/request';
const ModuleName = 'keyWordManagement';
const ModulePrefix = '/worship';
export default {
  add(data) {
    //新增
    return request({
      method: 'post',
      url: `${ModulePrefix}/${ModuleName}`,
      data: data,
    });
  },
  update(data) {
    //修改
    return request({
      method: 'put',
      url: `${ModulePrefix}/${ModuleName}`,
      data: data,
    });
  },
  get(id) {
    //根据id获取详情
    return request({
      method: 'get',
      url: `${ModulePrefix}/${ModuleName}/${id}`,
    });
  },
  list(query) {
    //获取列表
    return request({
      method: 'get',
      url: `${ModulePrefix}/${ModuleName}/list`,
      params: query ? query : {},
    });
  },
  del(ids) {
    // 删除
    return request({
      url: `${ModulePrefix}/${ModuleName}/${ids}`,
      method: 'delete',
    });
  },
  exportList(query) {
    //导出列表
    return request({
      method: 'post',
      url: `${ModulePrefix}/${ModuleName}/export`,
      params: query ? query : {},
    });
  },
};
