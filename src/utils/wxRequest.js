import axios from 'axios';
import { Toast } from 'antd-mobile';
import config from '../config/index';
import request from './request';

const wxRequest = axios.create({
  baseURL: 'https://wechat.msparis.com/api/',
  timeout: config.TIMEOUT,
  withCredentials: true,
});

// 提交买卡订单
export async function getWxConfig(params){
  return wxRequest({
    url: 'common/jsconfig',
    method: 'GET',
    data: params,
  });
}

// 获取wx用户信息
export async function getWxUser(params){
  return wxRequest({
    url: 'common/user',
    method: 'GET',
    params,
    data: params,
  });
}

// 获取wx三方登录  http://wiki.tools.msparis.com/pages/viewpage.action?pageId=1016179
export async function thirdParty(params){
  return request({
    url: '/user/third-party',
    method: 'POST',
    data: params,
    config: {
      isToast: false,
      isAccess: false,
      isCheckErroCode: false,
    },
    isCheckErroCode: false,
  });
}

// 获取用户信息
export async function userCenterInfo(params){
  return request({
    url: '/user/lteration',
    method: 'GET',
    data: params,
    config: {
      isToast: false,
      isAccess: true,
    },
  });
}

export default {
  getWxConfig, getWxUser, thirdParty, userCenterInfo,
};
