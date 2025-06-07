import request from '@/utils/request';

// 获取用户信息列表
export function getUserProfileList(params) {

  return request({
    url: '/api/v1/profiles/',
    method: 'get',
    params
  });
}
// 获取用户信息详情
export function getUserProfileDetail(id) {
  return request({
    url: `/api/v1/profiles/${id}/`,
    method: 'get'
  });
}