import axios from 'axios';
import store from '@/store';
import { getToken } from '@/utils/auth';

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 10000 // request timeout
});

// request interceptor
service.interceptors.request.use(
  (config) => {
    console.group('config');
    console.log(config.url);
    console.log(config);
    console.groupEnd();

    // do something before request is sent
    const token = localStorage.getItem('access_token');
    if (token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['Authorization'] = 'Bearer ' + token;
    }
    return config;
  },
  (error) => {
    // do something with request error
    console.log(error); // for debug
    return Promise.reject(error);
  }
);

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  (response) => {
    console.group('response');
    console.log(response);
    console.groupEnd();
    const res = response.data;
    // console.group('res');
    // console.log(res);
    // console.groupEnd();

    // if the custom code is not 20000, it is judged as an error.
    if (res.status !== 200 && res.status !== 201 && res.status !== 204 && response.status !== 204) {
      console.log('res', res);

      return Promise.reject(new Error(res.message || 'Error'));
    } else {
      return res;
    }
  },
  (error) => {
    console.log(error);
    if (error.response.status === 401) {
      // 401 未授权
      // 跳转到登录页面
      window.location.href = '/login';
    }

    ElMessage({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    });
    return Promise.reject(error);
  }
);

export default service;
