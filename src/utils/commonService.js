/* eslint-disable */
import request from '@/utils/request';
import wechatApi from '@/utils/wechatApi';

// 获取token
export const getWebToken2 = (params) =>
  request(wechatApi.WEBTOKENGET, {
    method: 'GET',
    data: params
  });

// getUserUnionID
export const getUserUnionID = (params) =>
  request('/api/community/getUserUnionID', {
    method: 'POST',
    data: params,
    config: {
      CONSOLE: true,
      isToast: true
    }
  });
export const getWebToken = (params) =>
  request('/api/community/getWebToken', {
    method: 'POST',
    data: params,
    config: {
      CONSOLE: true,
      isToast: true
    }
  });

export const getWebUserinfo = (params) =>
  request('/api/community/getWebUserinfo', {
    method: 'POST',
    data: params
  });

export const getRefreshToken = (params) =>
  request('/api/community/getRefreshToken', {
    method: 'POST',
    data: params
  });
// 保存 签名图片
export const uploadBase64Image = (params) =>
  request('/api/community/uploadBase64Image', {
    method: 'POST',
    data: params
  });
// 提交同意
export const submitContract = (params) =>
  request('/api/community/submitContract', {
    method: 'POST',
    data: params
  });

// 实名认证
export const userCertification = (params) =>
  request('/api/community/userCertification', {
    method: 'POST',
    data: params
  });
export const uploadRoomNum = (params) =>
  request('/api/community/uploadRoomNum', {
    method: 'POST',
    data: params
  });
export const getUserList = (params) =>
  request('/api/community/getUserList', {
    method: 'POST',
    data: params
  });
