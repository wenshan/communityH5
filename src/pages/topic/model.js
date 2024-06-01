// import { Toast } from 'antd-mobile';
// import Cookies from 'js-cookie';
// import Tool from '@/utils/tool';
// import Store from 'store2';
import * as giftIndexApi from './service';

export default {
  namespace: 'topic',
  state: {
    swiperBanner: [
      { id: 123244, name: 'banner1', src: 'https://img.dreamstep.top/ai/banner_01.jpg' },
      { id: 123245, name: 'banner2', src: 'https://img.dreamstep.top/ai/banner_01.jpg' }
    ]
  },
  effects: {},
  reducers: {
    update(state, { payload: data }) {
      return { ...state, ...data };
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {}
  }
};
