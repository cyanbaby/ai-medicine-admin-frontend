import request from '@/utils/request';



export function getInfo(token) {
  return request({
    url: '/vue-element-admin/user/info',
    method: 'get',
    params: { token }
  });
  // return Promise.resolve({
  //   data: JSON.parse(localStorage.getItem('user'))
  // });
}

export function logout(token) {
  return request({
    url: '/vue-element-admin/user/logout',
    method: 'post',
    params: { token }
  });
}
// 登录接口
export function login(data) {
  return request({
    url: '/api/v1/login/',
    method: 'post',
    data
  });
}

// 注册接口
export function register(data) {
  return request({
    url: '/api/v1/register/',
    method: 'post',
    data
  });
}