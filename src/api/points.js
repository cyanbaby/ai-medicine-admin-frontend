
import request from '@/utils/request';

// 获取所有积分记录（分页列表）
export function getPointsList(params) {
  return request({
    url: '/api/v1/points/',
    method: 'get',
    params
  });
}

// 创建一条新的积分记录
export function createPoint(data) {
  return request({
    url: '/api/v1/points/',
    method: 'post',
    data
  });
}

// 获取某一条具体积分记录的详情
export function getPointDetail(id) {
  return request({
    url: `/api/v1/points/${id}/`,
    method: 'get'
  });
}

// 整体更新某一条积分记录
export function updatePoint(id, data) {
  return request({
    url: `/api/v1/points/${id}/`,
    method: 'put',
    data
  });
}

// 删除某一条积分记录
export function deletePoint(id) {
  return request({
    url: `/api/v1/points/${id}/`,
    method: 'delete'
  });
}

// import { getPointsList, createPoint, getPointDetail, updatePoint, deletePoint } from '@/api/points';