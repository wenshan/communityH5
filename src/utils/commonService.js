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
export const saveSignature = (params) =>
  request('/api/community/saveSignature', {
    method: 'POST',
    data: params
  });

export const createRoom = (params) =>
  request('/api/community/createRoom', {
    method: 'POST',
    data: params
  });
export const getUserList = (params) =>
  request('/api/community/getUserList', {
    method: 'POST',
    data: params,
    config: {
      isAccess: false
    }
  });

// delUser
export const delUser = (params) =>
  request('/api/community/delUser', {
    method: 'POST',
    data: params
  });

export const getShareConfig = (params) =>
  request('/api/community/getShareConfig', {
    method: 'POST',
    data: params,
    config: {
      isAccess: false
    }
  });
export const sendSms = (params) =>
  request('/api/user/sendSms', {
    method: 'POST',
    data: params
  });
export const mobileCertification = (params) =>
  request('/api/community/mobileCertification', {
    method: 'POST',
    data: params
  });
export const superUpdateCommunityUser = (params) =>
  request('/api/community/superUpdateCommunityUser', {
    method: 'POST',
    data: params
  });
// 提交同意
export const submitContractAgree = (params) =>
  request('/api/community/submitContractAgree', {
    method: 'POST',
    data: params
  });
// 提交不同意
export const submitContractUnwilling = (params) =>
  request('/api/community/submitContractUnwilling', {
    method: 'POST',
    data: params
  });
// saveName
export const saveName = (params) =>
  request('/api/community/saveName', {
    method: 'POST',
    data: params
  });
