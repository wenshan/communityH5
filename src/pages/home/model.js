import * as giftIndexApi from './service';

export default {
  namespace: 'home',
  state: {
    swiperBanner: [
      { id: 123244, name: 'banner1', src: 'https://img.dreamstep.top/ai/banner_05.png', value: '/voice' },
      { id: 123245, name: 'banner2', src: 'https://img.dreamstep.top/ai/banner_03_01.png', value: '/user' }
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
