import request from '@/utils/request';

// 获取用户配置列表
export function getUserConfigsList(query) {
  return request({
    url: '/api/v1/user-configs/',
    method: 'get',
    params: query
  });
}

// 创建新用户配置
export function createUserConfig(data) {
  return request({
    url: '/api/v1/user-configs/',
    method: 'post',
    data
  });
}

// 获取用户配置详情
export function getUserConfigDetail(id) {
  return request({
    url: `/api/v1/user-configs/${id}/`,
    method: 'get'
  });
}

// 更新用户配置
export function updateUserConfig(id, data) {
  return request({
    url: `/api/v1/user-configs/${id}/`,
    method: 'put',
    data
  });
}

// 部分更新用户配置
export function patchUserConfig(id, data) {
  return request({
    url: `/api/v1/user-configs/${id}/`,
    method: 'patch',
    data
  });
}

// 删除用户配置
export function deleteUserConfig(id) {
  return request({
    url: `/api/v1/user-configs/${id}/`,
    method: 'delete'
  });
}

// 批量创建用户配置
export function batchCreateUserConfigs(data) {
  return request({
    url: '/api/v1/user-configs/batch_create/',
    method: 'post',
    data
  });
}

// 批量更新用户配置
export function batchUpdateUserConfigs(data) {
  return request({
    url: '/api/v1/user-configs/batch_update/',
    method: 'post',
    data
  });
}

// import { getUserConfigsList, createUserConfig, getUserConfigDetail, updateUserConfig, patchUserConfig, deleteUserConfig, batchCreateUserConfigs, batchUpdateUserConfigs } from '@/api/user-configs';
