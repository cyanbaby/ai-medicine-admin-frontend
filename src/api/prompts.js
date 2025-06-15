import request from '@/utils/request';

// 获取用户信息列表
export function getUserProfileList(params) {

  return request({
    url: '/api/v1/profiles/',
    method: 'get',
    params
  });
}

// 获取所有提示词列表
export function getPromptsList(params) {
  return request({
    url: '/api/v1/prompts/',
    method: 'get',
    params
  });
}

// 创建新的提示词
export function createPrompt(data) {
  return request({
    url: '/api/v1/prompts/',
    method: 'post',
    data
  });
}

// 获取指定ID的提示词
export function getPromptById(id) {
  return request({
    url: `/api/v1/prompts/${id}`,
    method: 'get'
  });
}

// 更新指定ID的提示词
export function updatePrompt(id, data) {
  return request({
    url: `/api/v1/prompts/${id}`,
    method: 'put',
    data
  });
}

// 部分更新指定ID的提示词
export function partialUpdatePrompt(id, data) {
  return request({
    url: `/api/v1/prompts/${id}`,
    method: 'patch',
    data
  });
}

// 删除指定ID的提示词
export function deletePrompt(id) {
  return request({
    url: `/api/v1/prompts/${id}`,
    method: 'delete'
  });
}

// 批量删除提示词
export function batchDeletePrompts(data) {
  return request({
    url: '/api/v1/prompts/batch_delete',
    method: 'post',
    data
  });
}

// 获取按目录分类的提示词列表
export function getPromptsByDirectory(params) {
  return request({
    url: '/api/v1/prompts/by_directory',
    method: 'get',
    params
  });
}


// import { getPromptsList, createPrompt, getPromptById, updatePrompt, partialUpdatePrompt, deletePrompt, batchDeletePrompts, getPromptsByDirectory } from '@/api/prompts';