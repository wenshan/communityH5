/* eslint-disable no-undef */
import QueryString from 'query-string';
import Store from 'store2';
import Cookies from 'js-cookie';
import * as FormData from 'form-data';
import { routerRedux } from 'dva/router';
import { Toast, Modal } from 'antd-mobile';
import Tool from '@/utils/tool';
import {
  getWebToken,
  getUserUnionID,
  uploadBase64Image,
  userCertification,
  queryRoomAreas,
  submitContract
} from '@/utils/commonService';
import { getUserInfo, getCommunityUserInfo } from '@/pages/user/service';

const CommonStore = Store.namespace('common');
const formdata = new FormData();
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

const NODE_ENV = process.env.NODE_ENV;
console.log('NODE_ENV:', NODE_ENV);

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
      gender: '',
      name: '',
      idcard: '',
      is_certification: 0
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
    activeKey: '/',
    communityUser: {
      id: '',
      userid: '',
      roomid: '',
      name: '',
      idcard: '',
      is_certification: 0,
      contractId: '',
      contractPath: '',
      signatureFile: '',
      is_checkSignature: 0,
      areas: null,
      build: 0,
      unit: 0,
      room: 0
    }
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
        if (NODE_ENV == 'development' && false) {
          dispatch({
            type: 'update',
            payload: {
              userinfo
            }
          });
          // Cookies.set('access_token', userinfo.access_token, { expires: 1 });
        }

        // 存在CODE 更新用户数据
        if (query.code && query.state) {
          // 比较下新旧code码
          const code = CommonStore.session('code');
          if (code !== query.code) {
            // if (true) {
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
          } else {
            dispatch({ type: 'getWeixinOauth2', payload: { isOperateType: false } });
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
      // Cookies.set('access_token', '');
      // isOperateType 手动授权 自动授权
      let isOperateType = payload.isOperateType || false; // 自动授权
      const wxConfig = yield select((state) => state.common.wxConfig);
      const { origin, pathname } = window.location;
      //const url_path = `${origin}/index.html`;
      const url_path = 'https://www.dreamstep.top/index.html';
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
    // https://mp.weixin.qq.com/debug/cgi-bin/sandboxinfo?action=showinfo&t=sandbox/index
    // https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx7284b74cc03f0299&redirect_uri=https%3A%2F%2Fwww.dreamstep.top%2Findex.html&response_type=code&scope=snsapi_userinfo&forcePopup=true&state=wxwap
    // https://api.weixin.qq.com/sns/userinfo?access_token=80_SSLqnIHKo-Z3hrp-0QigEMWg8jSAG8RjaUha6qcs_Fwx6y0ADhNeYxd-s7xR-Y9_tvsAvGOi930UoibPIuej5vqO1un-nrSYwnXHy5481mk&openid=o_Vnq6RT2B-FJv6G6iKia7PwonTA&lang=zh_CN
    // 获取到 code，换取token openid
    // https://api.weixin.qq.com/sns/oauth2/access_token?appid=APPID&secret=SECRET&code=CODE&grant_type=authorization_code
    *getWeixinToken({ payload }, { call, put, select }) {
      const code = yield select((state) => state.common.code);
      const currentUserinfo = yield select((state) => state.common.userinfo);
      const { platform } = yield select((state) => state.common);
      const { wxConfig } = yield select((state) => state.common);
      const { secret, appid, grant_type } = wxConfig;
      const result = yield call(getWebToken, { code, platform, secret, appid, grant_type });
      if (result && result.status == 200 && result.data && result.data.access_token) {
        const userinfo = Object.assign({}, currentUserinfo, result.data);
        // 更新缓存用户授权后信息
        CommonStore.session('userinfo', userinfo);
        CommonStore.session('access_token', result.data.access_token);

        // Cookies.set('access_token', result.data.access_token, { expires: 1 });
        yield put({ type: 'update', payload: { userinfo } });
      } else {
        // 用户授权失败 手动授权
        yield put({ type: 'getWeixinOauth2', payload: { isOperateType: true } });
      }
    },
    // 获取用户信息
    *getUserInfo({ payload }, { call, put, select }) {
      const currentUserinfo = yield select((state) => state.common.userinfo);
      const access_token = Cookies.get('access_token');
      if (access_token) {
        const result = yield call(getUserInfo, {});
        if (result && result.status == 200 && result.data) {
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
          // Toast.show('获取用户信息失败');
        }
      } else {
        yield put({ type: 'getWeixinOauth2', payload: { isOperateType: true } });
      }
    },
    // 获取社区用户信息
    *getCommunityUserInfo({ payload: data }, { call, put, select }) {
      const currentCommunityUser = yield select((state) => state.common.communityUser);
      const access_token = Cookies.get('access_token');
      if (access_token) {
        const result = yield call(getCommunityUserInfo, {});
        if (result && result.status == 200 && result.data) {
          const communityUser = Object.assign({}, currentCommunityUser, result.data);
          yield put({ type: 'update', payload: { communityUser } });
        }
      }
    },
    // 实名认证
    *userCertification({ payload: data }, { call, put, select }) {
      const currentUserinfo = yield select((state) => state.common.userinfo);
      const currentCommunityUser = yield select((state) => state.common.communityUser);
      const { communityUser } = data;
      const { name, idcard } = communityUser;
      const resultUserInfo = yield call(userCertification, { name, idcard });
      if (resultUserInfo && resultUserInfo.status == '200' && resultUserInfo.data) {
        const newCurrentUserinfo = Object.assign({}, currentUserinfo, resultUserInfo.data);
        const { name, idcard, is_certification } = newCurrentUserinfo;
        const newCurrentCommunityUser = Object.assign({}, currentCommunityUser, { name, idcard, is_certification });
        yield put({ type: 'update', payload: { userinfo: newCurrentUserinfo } });
        yield put({ type: 'update', payload: { communityUser: newCurrentCommunityUser } });
      } else {
        Toast.show({
          icon: 'fail',
          content: '认证失败，请刷新重试'
        });
      }
    },
    // 保存 签名信息
    *saveSignature({ payload: data }, { call, put, select }) {
      const { signatureFile } = data;
      const currentUserinfo = yield select((state) => state.common.userinfo);
      const communityUser = yield select((state) => state.common.communityUser);
      const result = yield call(uploadBase64Image, { signatureFile });
      if (result && result.status == 200 && result.data) {
        const newCommunityUser = Object.assign({}, communityUser, result.data);
        yield put({ type: 'update', payload: { communityUser: newCommunityUser } });
      }
    },
    // 提交 PDF
    *submitContractPDF({ payload: data }, { call, put, select }) {
      const { areas, build, unit, room, signatureFile, id } = yield select((state) => state.common.communityUser);
      const { is_certification, name, idcard } = yield select((state) => state.common.userinfo);
      debugger;
      if (is_certification && areas && build && unit && room && signatureFile) {
        const result = yield call(submitContract, { id, areas, build, unit, room, name, idcard, is_certification });
        console.log('result:', result);
        if (result) {
        }
      }
    }
  },

  reducers: {
    update(state, { payload: data }) {
      return { ...state, ...data };
    }
  }
};
