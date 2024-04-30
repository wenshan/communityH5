/* eslint-disable */
import axios from 'axios';
import Request from '@/utils/request';
import wechatApi from '@/utils/wechatApi';

// 获取token
export const getWebToken2 = (params) =>
  Request({
    url: wechatApi.WEBTOKENGET,
    method: 'GET',
    data: params
  });

// getUserUnionID
export const getUserUnionID = (params) =>
  Request({
    url: '/api/community/getUserUnionID',
    method: 'POST',
    data: params,
    config: {
      CONSOLE: true,
      isToast: true
    }
  });
export const getWebToken = (params) =>
  Request({
    url: '/api/community/getWebToken',
    method: 'POST',
    data: params,
    config: {
      CONSOLE: true,
      isToast: true
    }
  });

export const getWebUserinfo = (params) =>
  Request({
    url: '/api/community/getWebUserinfo',
    method: 'POST',
    data: params
  });

export const getRefreshToken = (params) =>
  Request({
    url: '/api/community/getRefreshToken',
    method: 'POST',
    data: params
  });
