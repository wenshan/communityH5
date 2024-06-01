import { queryBanner, lastDayIntention } from './service';

export default {
  namespace: 'home',
  state: {
    swiperBanner: [
      {
        id: 123244,
        name: 'banner1',
        src: 'https://img.dreamstep.top/community/banner/banner_intention.png',
        value: '/intention.html'
      },
      {
        id: 12324,
        name: 'banner2',
        src: 'https://img.dreamstep.top/community/banner/qun_400_220.png',
        value: '/intentionMap.html'
      }
    ],
    currentBanner: {
      id: 12324,
      name: 'banner2',
      src: 'https://img.dreamstep.top/community/banner/qun_400_220.png',
      value: '/intentionMap.html'
    },
    lastDayIntentionB: {
      value: [],
      days: [],
      agreeUserNum: 0,
      unwillingUserNum: 0,
      communityUserNum: 0
    },
    lastDayIntentionC: {
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
    *lastDayIntentionB({ payload: data }, { call, put, select }) {
      if (data) {
        const result = yield call(lastDayIntention, data);
        if (result && result.status == 200 && result.data) {
          yield put({ type: 'update', payload: { lastDayIntentionB: result.data } });
        } else {
          // Toast.info('获取用户信息失败');
        }
      }
    },
    *lastDayIntentionC({ payload: data }, { call, put, select }) {
      if (data) {
        const result = yield call(lastDayIntention, data);
        if (result && result.status == 200 && result.data) {
          yield put({ type: 'update', payload: { lastDayIntentionC: result.data } });
        } else {
          // Toast.info('获取用户信息失败');
        }
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
