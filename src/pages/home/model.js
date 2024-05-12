import { queryBanner, lastDayIntention } from './service';

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
    ],
    lastDayIntention: {
      value: [],
      days: [],
      agreeUserNum: 0,
      unwillingUserNum: 0,
      communityUserNum: 0
    }
  },
  effects: {
    *queryBanner({ payload }, { call, put, select }) {
      const result = yield call(queryBanner);
      if (result && result.status == 200 && result.data && result.data.rows) {
        yield put({ type: 'update', payload: { swiperBanner: result.data.rows } });
      } else {
        // Toast.info('获取用户信息失败');
      }
    },
    *lastDayIntention({ payload }, { call, put, select }) {
      const result = yield call(lastDayIntention);
      if (result && result.status == 200 && result.data) {
        yield put({ type: 'update', payload: { lastDayIntention: result.data } });
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
