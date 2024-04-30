import Request from '@/utils/request';

// http://wiki.tools.msparis.com/pages/viewpage.action?pageId=1015930
export const configs = (params) =>
  Request({
    url: '/common/configs',
    method: 'GET',
    data: params,
    config: {
      isToast: false
    }
  });

export const queryBanner = (params = {}) =>
  Request({
    url: '/api/web/banner/query',
    method: 'POST',
    data: params,
    config: {
      isToast: false
    }
  });

// wiki: http://wiki.tools.msparis.com/pages/viewpage.action?pageId=1016417
export const list = (params) =>
  Request({
    url: '/product/filter',
    method: 'GET',
    data: params,
    config: {
      isToast: false
    }
  });
