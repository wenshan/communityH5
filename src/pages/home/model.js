import { queryBanner } from './service';

export default {
  namespace: 'home',
  state: {
    swiperBanner: [
      {
        id: 123244,
        name: 'banner1',
        src: 'https://affiliate-traffic.oss-cn-hongkong.aliyuncs.com/community/banner/banner_intention.png',
        value: '/intention.html'
      }
    ]
  },
  effects: {
    *queryBanner({ payload }, { call, put, select }) {
      const result = yield call(queryBanner);
      if (result && result.status == 200 && result.data && result.data.rows) {
        yield put({ type: 'update', payload: { swiperBanner: result.data.rows } });
      } else {
        // Toast.info('获取用户信息失败');
      }
    }
  },
  reducers: {
    update(state, { payload: data }) {
      return { ...state, ...data };
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {}
  }
};
