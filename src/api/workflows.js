import request from '@/utils/request';

// 获取工作流列表
export function getWorkflowsList(params) {
  return request({
    url: '/api/v1/workflows/',
    method: 'get',
    params
  });
}

// 创建工作流
export function createWorkflow(data) {
  return request({
    url: '/api/v1/workflows/',
    method: 'post',
    data
  });
}

// 获取工作流详情
export function getWorkflowDetail(id) {
  return request({
    url: `/api/v1/workflows/${id}/`,
    method: 'get'
  });
}

// 更新工作流
export function updateWorkflow(id, data) {
  return request({
    url: `/api/v1/workflows/${id}/`,
    method: 'put',
    data
  });
}

// 部分更新工作流
export function patchWorkflow(id, data) {
  return request({
    url: `/api/v1/workflows/${id}/`,
    method: 'patch',
    data
  });
}

// 删除工作流
export function deleteWorkflow(id) {
  return request({
    url: `/api/v1/workflows/${id}/`,
    method: 'delete'
  });
}

// 归档工作流
export function archiveWorkflow(id) {
  return request({
    url: `/api/v1/workflows/${id}/archive/`,
    method: 'post'
  });
}

// 创建工作流实例
export function createWorkflowInstance(id) {
  return request({
    url: `/api/v1/workflows/${id}/create_instance/`,
    method: 'post'
  });
}

// 记录工作流执行
export function recordWorkflowExecution(id, data) {
  return request({
    url: `/api/v1/workflows/${id}/record_execution/`,
    method: 'post',
    data
  });
}

// 恢复工作流
export function restoreWorkflow(id) {
  return request({
    url: `/api/v1/workflows/${id}/restore/`,
    method: 'post'
  });
}

// 软删除工作流
export function softDeleteWorkflow(id) {
  return request({
    url: `/api/v1/workflows/${id}/soft_delete/`,
    method: 'delete'
  });
}

// import { getWorkflowsList, createWorkflow, getWorkflowDetail, updateWorkflow, patchWorkflow, deleteWorkflow, archiveWorkflow, createWorkflowInstance, recordWorkflowExecution, restoreWorkflow, softDeleteWorkflow } from '@/api/workflows';
