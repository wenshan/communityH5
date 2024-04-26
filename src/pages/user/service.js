import Request from '@/utils/request';

// 获取用户信息
export const getUserInfo = (params) =>
  Request({
    url: '/api/getUser',
    method: 'POST',
    data: params,
    config: {
      isToast: false
    }
  });
