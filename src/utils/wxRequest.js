import axios from 'axios';
import config from '../config';

const isDev = process.env.NODE_ENV === 'development';
const API_DEV = 'http://127.0.0.1:7001/';
const API_PRO = 'https://www.dreamstep.top/';

const wxRequest = axios.create({
  baseURL: isDev ? API_DEV : API_PRO,
  timeout: 1000 * 60,
  headers: {
    'Access-Control-Allow-Credentials': true,
    'Access-Control-Allow-Origin': `${isDev ? 'http://127.0.0.1:7001' : 'https://www.dreamstep.top'}`,
    'Access-Control-Allow-Methods': 'DELETE, HEAD, GET, OPTIONS, POST, PUT',
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Headers': 'Content-Type, Content-Range, Content-Disposition, Content-Description',
    'Access-Control-Max-Age': 1728000
  },
  withCredentials: true
});

// 提交买卡订单
export async function getShareConfig(params) {
  return wxRequest({
    url: '/api/community/getShareConfig',
    method: 'POST',
    data: params
  });
}

export default {
  getShareConfig
};
