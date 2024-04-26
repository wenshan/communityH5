import * as userIndexApi from './service';

export default {
  namespace: 'user',
  state: {
    userinfo: {
      nickname: '~',
      avatar: 'https://img.dreamstep.top/ai/avatar.png'
    }
  },
  effects: {
    *getUserInfo({ payload }, { call, put, select }) {
      const currentUserinfo = yield select((state) => state.common.userinfo);
      const { access_token } = currentUserinfo;
      const result = yield call(userIndexApi.getUserInfo, { access_token });
      if (result && result.data && result.data.userid) {
        const userinfo = Object.assign({}, currentUserinfo, result.data);
        yield put({ type: 'update', payload: { userinfo } });
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
