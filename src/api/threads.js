
import request from '@/utils/request';



// 获取所有线程列表
export function getThreadsList(params) {
  return request({
    url: '/api/v1/threads/',
    method: 'get',
    params
  });
}

// 创建新线程
export function createThread(data) {
  return request({
    url: '/api/v1/threads/',
    method: 'post',
    data
  });
}

// 获取线程详情
export function getThreadDetail(id) {
  return request({
    url: `/api/v1/threads/${id}/`,
    method: 'get'
  });
}

// 更新线程
export function updateThread(id, data) {
  return request({
    url: `/api/v1/threads/${id}/`,
    method: 'put',
    data
  });
}

// 部分更新线程
export function patchThread(id, data) {
  return request({
    url: `/api/v1/threads/${id}/`,
    method: 'patch',
    data
  });
}

// 删除线程
export function deleteThread(id) {
  return request({
    url: `/api/v1/threads/${id}/`,
    method: 'delete'
  });
}

// 归档线程
export function archiveThread(id) {
  return request({
    url: `/api/v1/threads/${id}/archive/`,
    method: 'post'
  });
}

// 恢复线程
export function restoreThread(id) {
  return request({
    url: `/api/v1/threads/${id}/restore/`,
    method: 'post'
  });
}

// 软删除线程
export function softDeleteThread(id) {
  return request({
    url: `/api/v1/threads/${id}/soft_delete/`,
    method: 'delete'
  });
}

// 获取活跃线程
export function getActiveThreads(params) {
  return request({
    url: '/api/v1/threads/active/',
    method: 'get',
    params
  });
}

// 批量归档线程
export function batchArchiveThreads(data) {
  return request({
    url: '/api/v1/threads/batch_archive/',
    method: 'post',
    data
  });
}

// 搜索线程
export function searchThreads(params) {
  return request({
    url: '/api/v1/threads/search/',
    method: 'get',
    params
  });
}

// import { getThreadsList, createThread, getThreadDetail, updateThread, patchThread, deleteThread, archiveThread, restoreThread, softDeleteThread, getActiveThreads, batchArchiveThreads, searchThreads } from '@/api/threads';