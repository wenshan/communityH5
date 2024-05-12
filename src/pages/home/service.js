import request from '@/utils/request';

// http://wiki.tools.msparis.com/pages/viewpage.action?pageId=1015930
export const configs = (params) =>
  request('/common/configs', {
    method: 'GET',
    data: params,
    config: {
      isToast: false
    }
  });

export const queryBanner = (params = {}) =>
  request('/api/web/banner/query', {
    method: 'POST',
    data: params,
    config: {
      isToast: false
    }
  });

// 主页数据
export const lastDayIntention = (params) =>
  request('/api/community/lastDayIntention', {
    method: 'POST',
    data: params
  });
