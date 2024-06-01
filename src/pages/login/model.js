import Store from 'store2';
import QueryString from 'query-string';
import Cookies from 'js-cookie';
import { Toast } from 'antd-mobile';
import { router } from 'dva';
const { routerRedux } = router;
import * as login from './service';

export default {
  namespace: 'login',
  state: {
    mobile: '',
    code: '',
    invitation_code: '',
    invitation_code_from: '',
    access_token: '',
    nickname: '',
    new_user: '',
    is_has_buy_card: '', // 用户是否买过卡
    smsText: '发送验证码',
    sending: 0,
    smsTime: 30,
    erroMessage: '',
    type: 4, // 1微信 2QQ 3新浪 4.微信公众号 5.支付宝生活号 6.京东 7.返利
    toUrl: '/index' // 保存token登录超时，返回当前toUrl地址
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname, search }) => {
        if (pathname == '/login.html') {
          const query = QueryString.parse(search);
          if (query && query.toUrl) {
            let toUrl = decodeURIComponent(query.toUrl);

            dispatch({
              type: 'update',
              payload: {
                toUrl
              }
            });
          }
        }
      });
    }
  },

  effects: {
    *login({ payload }, { call, put, select }) {
      const { invitation_code_from, platform, channel, open_id, userInfo, third_info } = yield select(
        (state) => state.common
      );
      const { code, mobile, toUrl } = yield select((state) => state.login);
      const res = yield call(login.login, { code, mobile, invitation_code: invitation_code_from, platform, channel });
      const thirdInfo = third_info || Cookies.getJSON('third_info');

      if (res.status == 'ok') {
        let userInfo = {
          access_token: res.data.access_token,
          invitation_code: res.data.invitation_code,
          mobile: res.data.mobile,
          nickname: res.data.nickname,
          new_user: res.data.new_user,
          is_has_buy_card: res.data.is_has_buy_card,
          erroMessage: ''
        };

        Store.set('user_info', userInfo);
        Cookies.set('user_info', userInfo);
        Store.set('access_token', res.data.access_token);
        Cookies.set('access_token', res.data.access_token);

        yield put({
          type: 'common/update',
          payload: {
            access_token: res.data.access_token,
            invitation_code: res.data.invitation_code,
            mobile: res.data.mobile,
            nickname: res.data.nickname,
            new_user: res.data.new_user,
            user_info: userInfo,
            is_has_buy_card: res.data.is_has_buy_card,
            erroMessage: ''
          }
        });

        yield put({
          type: 'update',
          payload: {
            access_token: res.data.access_token,
            invitation_code: res.data.invitation_code,
            mobile: res.data.mobile,
            nickname: res.data.nickname,
            new_user: res.data.new_user,
            user_info: userInfo,
            is_has_buy_card: res.data.is_has_buy_card,
            erroMessage: ''
          }
        });
        // 登录成功后绑定操作
        console.log('thirdInfo:', thirdInfo);
        if (thirdInfo && thirdInfo.open_id) {
          yield put({
            type: 'thirdPartyBind',
            payload: {
              access_token: res.data.access_token,
              openId: thirdInfo.open_id
            }
          });
        } else {
          yield put({ type: 'home/init', payload: {} });
          yield put({ type: 'toUrlBefore', payload: {} });
        }
      } else {
        if (res.error && res.error.code == '11038') {
          window.location.href = `${window.location.origin}/index.html`;
        } else if (res.error && (res.error.code == '11045' || res.error.code == '11038')) {
          yield put({ type: 'update', payload: { erroMessage: res.error && res.error.message } });
        } else {
          yield put({ type: 'update', payload: { erroMessage: res.error && res.error.message } });
        }
      }
    },
    // 第三方绑定
    *thirdPartyBind({ payload }, { call, put, select }) {
      const { platform, channel, access_token, open_id, appId, appChannel, type, third_info } = yield select(
        (state) => state.common
      );
      const thirdInfo = third_info || Cookies.getJSON('third_info');

      let openId = open_id || thirdInfo.open_id;
      let accessToken = access_token || Cookies.get('access_token');

      if (!openId) {
        Toast.fail('授权失败，请返回首页重试重试！');
      }
      if (openId && accessToken) {
        const res = yield call(login.thirdPartyBind, {
          access_token: accessToken,
          openId,
          platform,
          channel,
          type,
          appChannel,
          appId
        });
        if (res.status == 'ok') {
          thirdInfo['third_status'] = false;
          Cookies.set('third_info', thirdInfo);
          Toast.success('绑定成功！');
        } else {
          thirdInfo['third_status'] = false;
          // 更新授权信息
          yield put({
            type: 'common/update',
            payload: {
              isOauthStatus: true,
              third_info: thirdInfo
            }
          });
          Cookies.set('third_info', thirdInfo);
        }

        yield put({ type: 'home/init', payload: {} });
        yield put({ type: 'toUrlBefore', payload: {} });
      }
    },

    *sendSms({ payload }, { call, put, select }) {
      const { mobile } = yield select((state) => state.login);
      const res = yield call(login.getSms, { mobile });
      if (res.status == 'ok') {
        yield put({ type: 'update', payload: { sending: 1, erroMessage: '' } });
      } else {
        yield put({ type: 'update', payload: { sending: 2, erroMessage: res.error && res.error.message } });
      }
    },

    *sendSmsVoice({ payload }, { call, put, select }) {
      const { mobile } = yield select((state) => state.login);
      const res = yield call(login.getSmsVoice, { mobile });
      if (res.status == 'ok') {
        yield put({ type: 'update', payload: { sending: 1, erroMessage: '' } });
      } else {
        yield put({ type: 'update', payload: { sending: 2, erroMessage: res.error && res.error.message } });
      }
    },

    *logout({ payload }, { call, put, select }) {
      yield put(routerRedux.push('/login.html'));
    },
    // 返回login 页面之前页面
    *toUrlBefore({ payload }, { call, put, select }) {
      const { toUrl } = yield select((state) => state.login);
      if (toUrl) {
        if (/^(http|https)/.test(toUrl)) {
          window.location.href = toUrl;
        } else {
          yield put(routerRedux.push(toUrl));
        }
      }
    }
  },

  reducers: {
    update(state, { payload: data }) {
      return { ...state, ...data };
    },
    init(state) {
      const payload = {
        code: '',
        invitation_code: ''
      };
      return { ...state, ...payload };
    }
  }
};
