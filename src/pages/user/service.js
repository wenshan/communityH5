import request from '@/utils/request';

// 获取用户信息
export const getUserInfo = () =>
  request('/api/user/currentUser', {
    method: 'POST',
    data: {},
    config: {
      isToast: false
    }
  });
// 获取社区用户信息
export const getCommunityUserInfo = () =>
  request('/api/community/getUserInfo', {
    method: 'POST',
    data: {},
    config: {
      isToast: false
    }
  });
