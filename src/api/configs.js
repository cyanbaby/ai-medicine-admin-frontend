

import request from '@/utils/request';

// 获取配置列表
export function getConfigsList(query) {
  return request({
    url: '/api/v1/configs/',
    method: 'get',
    params: query
  });
}

// 创建新配置
export function createConfig(data) {
  return request({
    url: '/api/v1/configs/',
    method: 'post',
    data
  });
}

// 获取配置详情
export function getConfigDetail(id) {
  return request({
    url: `/api/v1/configs/${id}/`,
    method: 'get'
  });
}

// 更新配置
export function updateConfig(id, data) {
  return request({
    url: `/api/v1/configs/${id}/`,
    method: 'put',
    data
  });
}

// 部分更新配置
export function patchConfig(id, data) {
  return request({
    url: `/api/v1/configs/${id}/`,
    method: 'patch',
    data
  });
}

// 删除配置
export function deleteConfig(id) {
  return request({
    url: `/api/v1/configs/${id}/`,
    method: 'delete'
  });
}

// 获取特定配置
export function getSpecificConfig(params) {
  return request({
    url: '/api/v1/configs/get_config',
    method: 'get',
    params
  });
}

// 设置特定配置
export function setSpecificConfig(data) {
  return request({
    url: '/api/v1/configs/set_config',
    method: 'post',
    data
  });
}

// import { getConfigsList, createConfig, getConfigDetail, updateConfig, patchConfig, deleteConfig, getSpecificConfig, setSpecificConfig } from '@/api/configs';