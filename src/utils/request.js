import axios from 'axios';
import { Toast } from 'antd-mobile';
import Cookies from 'js-cookie';
import Store from 'store2';
import config from './config';

// let commonParams = Store.session.get('commonParams');

axios.defaults.baseURL = config.API_URL;
axios.defaults.timeout = config.TIMEOUT;
axios.defaults.headers = config.HEADERS;

let clientVersion = '1.0.0';

let reqConfig = {
  params: {},
  headers: {
    'Content-Type': 'application/json',
    'client-version': clientVersion // 接口版本控制
  },
  withCredentials: false,
  isCheckErroCode: true, // 是否检测 erroCodeState 状态
  isToast: false, // 是否走通用 Toast
  isAccess: true, // 是否带上token 值，false 不需要权限，true需要权限
  loading: false // 是否显示请求加载动画
};

function getBaseURL(options, is_wx) {
  let baseURL;

  if (is_wx) {
    baseURL = config.WX_URL;
  } else if (options.config && options.config.type === 'CSB') {
    baseURL = config.API_CSB_URL;
  } else {
    baseURL = config.API_URL;
  }

  return baseURL;
}

// 请求拦截器
axios.interceptors.request.use(
  (request) => {
    const access_token = Cookies.get('access_token');
    const md5 = Store.session('common.md5');
    if (config.CONSOLE) {
      console.log(`${new Date().toLocaleString()}【 M=${request.url} 】P=`, request.params || request.data);
    }

    request.headers = Object.assign({}, request.headers, reqConfig.headers, { access_token, md5 });

    return request;
  },
  (error) => {
    Toast.offline(String(error));
    return Promise.reject(error);
  }
);

// 接口返回status错误处理
const errorCodeState = (res) => {
  if (res.data && res.data.status != 'ok' && res.data.error) {
    // 601 602 603 604 access_token授权失败 code无效 微信授权获取用户信息失败 授权access_token获取用户信息失败
    if (
      res.data.error.code == '601' ||
      res.data.error.code == '602' ||
      res.data.error.code == '603' ||
      res.data.error.code == '604'
    ) {
      // TODO: 用户微信授权失败，重新唤起授权
      return;
    }
    // TODO: 拦截器无法获取 res.config.config 参数
    reqConfig = Object.assign({}, reqConfig, res.config.config);

    if (res.data.error.code !== 200) {
      if (reqConfig.isToast) {
        Toast.info(`${res.data.error.message} !!!~` || res.data.error.code, 1.5);
      }
    }
  }
};

// 响应拦截器
axios.interceptors.response.use(
  (res) => {
    if (res.status >= 200 && res.status < 900) {
      if (!config.CONSOLE) {
        // eslint-disable-next-line no-console
        console.log(`${new Date().toLocaleString()}【 M=${res.config.url} 】【接口响应：】`, res.data);
      }
      errorCodeState(res);
      return res.data;
    }
    Toast.offline(res.statusText);
    throw new Error(res.statusText);
  },
  (error) => {
    // Toast.offline(String(error));
    return Promise.reject(error);
  }
);

export default (options = { method: 'GET' }) => {
  const access_token = Cookies.get('access_token');
  const md5 = Store.session('common.md5');
  let reqConfigParams = Object.assign({}, reqConfig.params, options.params || {});
  let newReqConfig = Object.assign({}, reqConfig, { params: reqConfigParams }, options.config || {});

  if (access_token && newReqConfig.isAccess) {
    options.data = Object.assign({}, reqConfig.params, options.data, { access_token, md5 });
  } else {
    options.data = Object.assign({}, reqConfig.params, options.data);
  }

  let isData = true;

  if (
    options.method.toUpperCase() !== 'POST' &&
    options.method.toUpperCase() !== 'PUT' &&
    options.method.toUpperCase() !== 'PATCH'
  ) {
    isData = false;
  }

  return axios({
    method: options.method,
    baseURL: getBaseURL(options),
    url: options.url,
    data: isData ? options.data : null,
    params: !isData ? options.data : null,
    config: options.config
  });
};
