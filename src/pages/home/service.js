import Request from '@/utils/request';

// http://wiki.tools.msparis.com/pages/viewpage.action?pageId=1015930
export const configs = params => Request({
  url: '/common/configs',
  method: 'GET',
  data: params,
  config: {
    isToast: false,
  },
});

// http://wiki.tools.msparis.com/pages/viewpage.action?pageId=2130801
export const banner = (params = {}) => Request({
  url: '/homepage-v3',
  method: 'GET',
  data: params,
  config: {
    isToast: false,
  },
});

// wiki: http://wiki.tools.msparis.com/pages/viewpage.action?pageId=1016417
export const list = params => Request({
  url: '/product/filter',
  method: 'GET',
  data: params,
  config: {
    isToast: false,
  },
});
