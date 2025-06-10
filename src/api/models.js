import request from '@/utils/request';

// 获取模型列表
export function getModelsList(query) {
  return request({
    url: '/api/v1/admin/models/',
    method: 'get',
    params: query
  });
}

// 创建新模型
export function createModel(data) {
  return request({
    url: '/api/v1/admin/models/',
    method: 'post',
    data
  });
}

// 获取模型详情
export function getModelDetail(id) {
  return request({
    url: `/api/v1/admin/models/${id}/`,
    method: 'get'
  });
}

// 更新模型
export function updateModel(id, data) {
  return request({
    url: `/api/v1/admin/models/${id}/`,
    method: 'put',
    data
  });
}

// 部分更新模型
export function patchModel(id, data) {
  return request({
    url: `/api/v1/admin/models/${id}/`,
    method: 'patch',
    data
  });
}

// 删除模型
export function deleteModel(id) {
  return request({
    url: `/api/v1/admin/models/${id}/`,
    method: 'delete'
  });
}

// 切换模型启用状态
export function toggleModelEnable(id) {
  return request({
    url: `/api/v1/admin/models/${id}/toggle_enable/`,
    method: 'post'
  });
}

// 切换模型高级功能状态
export function toggleModelPremium(id) {
  return request({
    url: `/api/v1/admin/models/${id}/toggle_premium/`,
    method: 'post'
  });
}

// import { getModelsList, createModel, getModelDetail, updateModel, patchModel, deleteModel, toggleModelEnable, toggleModelPremium } from '@/api/models';
