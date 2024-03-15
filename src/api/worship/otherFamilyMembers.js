import request from '@/utils/request'

// 查询现役军人家属-其他家庭成员列表
export function listOtherFamilyMembers(query) {
  return request({
    url: '/worship/otherFamilyMembers/list',
    method: 'get',
    params: query
  })
}

// 查询现役军人家属-其他家庭成员详细
export function getOtherFamilyMembers(id) {
  return request({
    url: '/worship/otherFamilyMembers/' + id,
    method: 'get'
  })
}

// 新增现役军人家属-其他家庭成员
export function addOtherFamilyMembers(data) {
  return request({
    url: '/worship/otherFamilyMembers',
    method: 'post',
    data: data
  })
}

// 修改现役军人家属-其他家庭成员
export function updateOtherFamilyMembers(data) {
  return request({
    url: '/worship/otherFamilyMembers',
    method: 'put',
    data: data
  })
}

// 删除现役军人家属-其他家庭成员
export function delOtherFamilyMembers(id) {
  return request({
    url: '/worship/otherFamilyMembers/' + id,
    method: 'delete'
  })
}
