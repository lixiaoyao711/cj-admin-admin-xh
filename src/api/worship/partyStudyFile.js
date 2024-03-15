import request from '@/utils/request'

// 查询学习内容文件列表
export function listPartyStudyFile(query) {
  return request({
    url: '/worship/partyStudyFile/list',
    method: 'get',
    params: query
  })
}

// 查询学习内容文件详细
export function getPartyStudyFile(id) {
  return request({
    url: '/worship/partyStudyFile/' + id,
    method: 'get'
  })
}

// 新增学习内容文件
export function addPartyStudyFile(data) {
  return request({
    url: '/worship/partyStudyFile',
    method: 'post',
    data: data
  })
}

// 修改学习内容文件
export function updatePartyStudyFile(data) {
  return request({
    url: '/worship/partyStudyFile',
    method: 'put',
    data: data
  })
}

// 删除学习内容文件
export function delPartyStudyFile(id) {
  return request({
    url: '/worship/partyStudyFile/' + id,
    method: 'delete'
  })
}
