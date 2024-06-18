// @ts-ignore
/* eslint-disable */
import { message } from 'antd';
import axios from 'axios';
import Cookies from 'js-cookie';

const limeet = 'https://www.limeetpet.com';
const dreamstep = 'https://www.dreamstep.top';
const devUrl = 'http://127.0.0.1:7001/';

const isDev = process.env.NODE_ENV === 'development';

const API_DEV = `${devUrl}/`;
const API_PRO = `${limeet}/`;

const instance = axios.create({
  baseURL: isDev ? API_DEV : API_PRO,
  timeout: 1000 * 60,
  headers: {
    'Access-Control-Allow-Credentials': true,
    'Access-Control-Allow-Origin': `${isDev ? API_DEV : limeet}`,
    'Access-Control-Allow-Methods': 'DELETE, HEAD, GET, OPTIONS, POST, PUT',
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Headers': 'Content-Type, Content-Range, Content-Disposition, Content-Description',
    'Access-Control-Max-Age': 1728000
  },
  withCredentials: true
});

const initConfig = {
  withCredentials: true,
  isCheckErrorCode: true, // 是否检测 errorCodeState 状态
  isToast: false, // 是否走通用 Toast
  isAccess: true, // 是否带上token 值，false 不需要权限，true需要权限,
  isConsole: false
};

// 请求拦截器
instance.interceptors.request.use(
  (request) => {
    if (request.config) {
      if (request.config.isConsole) {
        console.log(`${new Date().toLocaleString()}【 M=${request.url} 】P=`, request.params || request.data);
      }
      if (request.config.headers) {
        request.headers = Object.assign({}, request.headers, request.config.headers);
      }
    }
    return request;
  },
  (error) => {
    message.warning(String(error), 3);
    return Promise.reject(error);
  }
);

// 接口返回status错误处理
const errorCodeState = (res) => {
  if (res.data && res.data.status !== '200' && res.data.msg) {
    if (res.config.config.isToast) {
      message.warning(String(res.data.msg), 3);
    }
  }
};

// 响应拦截器
instance.interceptors.response.use(
  (response) => {
    if (response.status >= 200 && response.status < 300) {
      if (response.isConsole) {
        console.log(`${new Date().toLocaleString()}【 M=${response.config.url} 】【接口响应：】`, response.data);
      }
      errorCodeState(response);
      return response.data;
    }
    message.warning(response.statusText);
    throw new Error(response.statusText);
  },
  (error) => {
    message.warning(String(error));
    return Promise.reject(error);
  }
);

export default (url, options = { method: 'GET', data, config }) => {
  const access_token = Cookies.get('access_token');
  let config = Object.assign({}, initConfig, options.config);
  if (access_token && config.isAccess) {
    options.data = Object.assign({}, options.data, { access_token });
  } else {
    options.data = Object.assign({}, options.data);
  }

  if (options.method.toUpperCase() === 'GET') {
    return instance(url, {
      method: options.method.toUpperCase(),
      params: options.data || {},
      config
    });
  } else {
    return instance(url, {
      method: options.method.toUpperCase(),
      data: options.data || {},
      config
    });
  }
};
