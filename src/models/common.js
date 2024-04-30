/* eslint-disable no-undef */
import QueryString from 'query-string';
import Store from 'store2';
import Cookies from 'js-cookie';
import { routerRedux } from 'dva/router';
import { Toast, Modal } from 'antd-mobile';
import Tool from '@/utils/tool';
import { getWebToken, getUserUnionID } from '@/utils/commonService';
import { getUserInfo } from '@/pages/user/service';

const CommonStore = Store.namespace('common');

// 测试数据 userinfo
// eslint-disable-next-line import/first
import userinfo from '@/utils/userInforDate';

const initUserInfo = {
  access_token: '',
  expires_in: '7200',
  nickname: '',
  refresh_token: '',
  openid: '',
  userid: '',
  unionid: '',
  gender: ''
};

const DEV_ENV = process.env.DEV_ENV;
console.log('DEV_ENV:', DEV_ENV);

export default {
  namespace: 'common',
  state: {
    fromType: 0,
    platform: 'wxwap', // wap:浏览器访问 wxwap: 微信访问
    mobile: '',
    type: 1, // 登录参数 1.微信 2.QQ 3.穿新衣 4.微信公众号 5.芝麻信用 6.京东 7.宝宝树 8.返利 9.QQ内部应用登录 10.微信积分购小程序 11. 支付宝无线换小程序 12.微信无线换小程序 13.微信穿新衣小程序
    query: '',
    code: '', // 微信code
    state: '',
    unionidModalStatus: false, // 关注公众号modal的状态
    userinfo: {
      access_token: '',
      expires_in: '7200',
      nickname: '',
      refresh_token: '',
      openid: '',
      userid: '',
      unionid: '',
      gender: ''
    },
    wxConfig: {
      appid: 'wx7284b74cc03f0299',
      redirect_uri: '',
      response_type: 'code',
      scope: 'snsapi_userinfo', // 授权类型，深度授权   snsapi_base
      initState: '',
      fix: '#wechat_redirect',
      forcePopup: 'false',
      lang: 'zh_CN',
      secret: '6bbc5ba71886f4a4abdcad3fdc95fa7d',
      grant_type: 'authorization_code'
    }, // 微信公共配置
    activeKey: '/'
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname, search }) => {
        const query = QueryString.parse(window.location.search);
        dispatch({
          type: 'update',
          payload: {
            activeKey: pathname
          }
        });
        if (query.fromType) {
          dispatch({
            type: 'update',
            payload: {
              fromType: query.fromType
            }
          });
        }

        // 设定一个测试用户
        if (DEV_ENV == 'dev') {
          dispatch({
            type: 'update',
            payload: {
              userinfo
            }
          });
          Cookies.set('access_token', userinfo.access_token, { expires: 1 });
        }

        // 存在CODE 更新用户数据
        if (query.code && query.state) {
          // 比较下新旧code码
          const code = CommonStore.session('code');
          if (code !== query.code) {
            dispatch({
              type: 'update',
              payload: {
                state: query.state,
                code: query.code
              }
            });
            CommonStore.session('code', query.code);
            // 获取token
            dispatch({ type: 'getWeixinToken', payload: { state: query.state, code: query.code } });
          }
        }
      });
    }
  },

  effects: {
    // 微信授权
    // https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421140842
    *getWeixinOauth2({ payload }, { call, put, select }) {
      // 清理缓存
      CommonStore.session('userinfo', initUserInfo);
      CommonStore.session('access_token', '');
      Cookies.set('access_token', '');
      // isOperateType 手动授权 自动授权
      let isOperateType = payload.isOperateType || false; // 自动授权
      const wxConfig = yield select((state) => state.common.wxConfig);
      const { origin, pathname } = window.location;
      const url_path = `${origin}/index.html`;
      const redirect_uri = encodeURIComponent(url_path);
      if (wxConfig) {
        const openAuthUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${wxConfig.appid}&redirect_uri=${redirect_uri}&response_type=code&scope=snsapi_userinfo&forcePopup=true&state=wxwap#wechat_redirect`;
        // 手动授权
        if (isOperateType) {
          Modal.alert({
            content: '微信 token 已过期，请重新授权获取 token',
            title: '失败',
            onConfirm: () => {
              setTimeout(() => {
                window.location.href = openAuthUrl;
              }, 500);
            }
          });
        } else {
          setTimeout(() => {
            window.location.href = openAuthUrl;
          }, 500);
        }
      } else {
        // eslint-disable-next-line no-alert
        if (DEV_ENV == 'pro') {
          Tool.info('请重新刷新页面获取微信授权');
        }
      }
    },
    // https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx7284b74cc03f0299&redirect_uri=http%3A%2F%2F127.0.0.1%3A8000%2Findex.html&response_type=code&scope=snsapi_userinfo&forcePopup=true&state=wxwap
    // https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx7284b74cc03f0299&redirect_uri=http%3A%2F%2F127.0.0.1%3A8000%2Findex.html&response_type=code&scope=snsapi_userinfo&forcePopup=true&state=wxwap&uin=MjA0MTMzOTc1&key=bd5ed1236ec0478576b9340d9290f124a786013d28070ae058d85ba17f5c396f94eece3cec4a19be190bdb557ae0cc5b&pass_ticket=676qaW89M4CBjPeRtUhJ5Mg38Zml3rF/h8Blg60UuY2FzVIPVKRg12+mDqWDz2SncT69P7Dsl9GD39FyS6LWUgqDgwsNda6peOw31LhtYzo=
    // 获取到 code，换取token openid
    // https://api.weixin.qq.com/sns/oauth2/access_token?appid=APPID&secret=SECRET&code=CODE&grant_type=authorization_code
    *getWeixinToken({ payload }, { call, put, select }) {
      const code = yield select((state) => state.common.code);
      const currentUserinfo = yield select((state) => state.common.userinfo);
      const { platform } = yield select((state) => state.common);
      const result = yield call(getWebToken, { code, platform });
      if (result && result.status == 200 && result.data && result.data.access_token) {
        const userinfo = Object.assign({}, currentUserinfo, result.data);
        // 更新缓存用户授权后信息
        CommonStore.session('userinfo', userinfo);
        CommonStore.session('access_token', result.data.access_token);

        if (result.data.md5) {
          CommonStore.session('md5', result.data.md5);
        } else {
          Toast.info('授权失败, md5用户标识创建失败', 5);
        }

        Cookies.set('access_token', result.data.access_token, { expires: 1 });
        yield put({ type: 'update', payload: { userinfo } });
      } else {
        // 用户授权失败 手动授权
        yield put({ type: 'getWeixinOauth2', payload: { isOperateType: true } });
      }
    },
    // 获取用户信息
    *getUserInfo({ payload }, { call, put, select }) {
      const access_token = Cookies.get('access_token');
      const currentUserinfo = yield select((state) => state.common.userinfo);
      if (access_token) {
        const result = yield call(getUserInfo);
        if (result && result.status == 200 && result.data && result.data.openid) {
          const userinfo = Object.assign({}, currentUserinfo, result.data);
          // 判断用户是否拥有
          let unionidModalStatus = false;
          if (!userinfo.unionid) {
            unionidModalStatus = true;
          }
          yield put({ type: 'update', payload: { userinfo, unionidModalStatus } });
          CommonStore.session('userinfo', userinfo);
        } else {
          yield put({ type: 'getWeixinOauth2', payload: { isOperateType: true } });
          // Toast.info('获取用户信息失败');
        }
      } else {
        yield put({ type: 'getWeixinOauth2', payload: { isOperateType: true } });
      }
    }
  },

  reducers: {
    update(state, { payload: data }) {
      return { ...state, ...data };
    }
  }
};
