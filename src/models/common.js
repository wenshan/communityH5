/* eslint-disable no-undef */
import QueryString from 'query-string';
import Store from 'store2';
import Cookies from 'js-cookie';
import { Toast, Modal, Dialog } from 'antd-mobile';
import Tool from '@/utils/tool';
import {
  getWebToken,
  saveSignature,
  submitContractAgree,
  submitContractUnwilling,
  uploadRoomNum,
  getUserList,
  delUser,
  sendSms,
  mobileCertification,
  superUpdateCommunityUser,
  saveName
} from '@/utils/commonService';
import { getUserInfo, getCommunityUserInfo } from '@/pages/user/service';

const CommonStore = Store.namespace('common');
// 测试数据 userinfo
// eslint-disable-next-line import/first
import userinfo from '@/utils/userInforDate';
const initCommunityUser = {
  id: '',
  userid: '',
  roomid: '',
  name: '',
  contractId: '',
  contractPath: '',
  signatureFile: '',
  is_checkSignature: 0,
  is_submitConfirmation: 0,
  is_submitContractUnwilling: 0,
  areas: '翠苑三区',
  build: 0,
  unit: 0,
  room: 0
};

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
      name: ''
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
      contractId: '',
      contractPath: '',
      signatureFile: '',
      is_checkSignature: 0,
      is_submitConfirmation: 0,
      is_submitContractUnwilling: 0,
      areas: '翠苑三区',
      build: null,
      unit: null,
      room: null,
      smsCode: '',
      mobile: '',
      owner: 0, // [0, 1]
      feedback: '',
      propertyType: 0 // [0,1]
    },
    communityUserFilter: {
      areas: '翠苑三区',
      build: null,
      unit: null
    },
    communityUserList: {
      count: 0,
      rows: []
    },
    communityUserSubmitLoading: false,
    communityUserSubmitUnwillingLoading: false
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
          Dialog.alert({
            content: '登录信息已过期，请授权微信登录!',
            title: '授权登录',
            confirmText: '确认',
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
        Cookies.set('access_token', result.data.access_token, { expires: 1, path: '/' });
        yield put({ type: 'getUserInfo', payload: {} });
      } else {
        // 用户授权失败 手动授权
        yield put({ type: 'getWeixinOauth2', payload: { isOperateType: true } });
      }
    },
    // 获取用户信息
    *getUserInfo({ payload }, { call, put, select }) {
      const currentUserinfo = yield select((state) => state.common.userinfo);
      // const currentCommunityUser = yield select((state) => state.common.currentCommunityUser);
      const access_token = Cookies.get('access_token');
      if (access_token) {
        const result = yield call(getUserInfo, {});
        if (result && result.status == 200 && result.data) {
          const userinfo = Object.assign({}, currentUserinfo, result.data);
          // const communityUser = Object.assign({}, currentCommunityUser, result.data);
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
        if (result && result.status == 200 && result.data && result.data.id) {
          const communityUser = Object.assign({}, currentCommunityUser, result.data);
          yield put({ type: 'update', payload: { communityUser, communityUserSubmitLoading: false } });
        } else {
          yield put({
            type: 'update',
            payload: { communityUser: initCommunityUser, communityUserSubmitLoading: false }
          });
        }
      }
    },
    // 保存 签名信息
    *saveSignature({ payload: data }, { call, put, select }) {
      const { signatureFile } = data;
      const { is_checkMobile, name } = yield select((state) => state.common.userinfo);

      if (name && signatureFile && is_checkMobile) {
        const result = yield call(saveSignature, {
          signatureFile
        });
        if (result && result.status == 200 && result.data) {
          yield put({ type: 'getCommunityUserInfo', payload: {} });
        }
      }
    },
    // 更新房号
    *uploadRoomNum({ payload: data }, { call, put, select }) {
      const { areas, build, unit, room } = data;
      if (areas && build && unit && room) {
        const result = yield call(uploadRoomNum, { areas, build, unit, room });
        if (result && result.status == 200) {
          yield put({ type: 'getCommunityUserInfo', payload: {} });
          Toast.show({
            icon: 'success',
            content: '房号提交成功！'
          });
        } else {
          Toast.show({
            icon: 'fail',
            content: '服务器问题稍后重试'
          });
        }
      } else {
        Toast.show({
          icon: 'fail',
          content: '检测参数'
        });
      }
    },
    // 查询房号
    *getUserList({ payload: data }, { call, put, select }) {
      const { areas, build, unit } = data;
      if (areas) {
        const result = yield call(getUserList, { areas, build, unit });
        if (result && result.status == 200 && result.data) {
          yield put({ type: 'update', payload: { communityUserList: result.data } });
        } else {
          Toast.show({
            icon: 'fail',
            content: '检测参数'
          });
        }
      }
    },
    // 删除社区用户
    *delUser({ payload: data }, { call, put, select }) {
      const { id } = data;
      if (id) {
        const result = yield call(delUser, { id });
        if (result && result.status == 200 && result.data) {
          yield put({ type: 'getCommunityUserInfo', payload: {} });
          Toast.show({
            icon: 'success',
            content: '删除成功！'
          });
        } else {
          Toast.show({
            icon: 'fail',
            content: '删除失败，检测参数'
          });
        }
      }
    },
    // 发送验证码
    *communitySendSms({ payload: data }, { call, put, select }) {
      const { mobile } = data;
      if (mobile) {
        const result = yield call(sendSms, { mobile });
        if (result && result.status == 200) {
          Toast.show({
            icon: 'success',
            content: '验证码发送成功'
          });
        } else {
          Toast.show({
            icon: 'fail',
            content: '验证码发送失败'
          });
        }
      } else {
        Toast.show({
          icon: 'fail',
          content: '请先输入手机号码'
        });
      }
    },
    // 验证手机号码
    *mobileCertification({ payload: data }, { call, put, select }) {
      const currentUserinfo = yield select((state) => state.common.userinfo);
      const currentCommunityUser = yield select((state) => state.common.communityUser);
      const { mobile, smsCode } = data;
      if (mobile && smsCode) {
        const resultUserInfo = yield call(mobileCertification, { mobile, smsCode });
        if (resultUserInfo && resultUserInfo.status == 200 && resultUserInfo.data) {
          const newCurrentUserinfo = Object.assign({}, currentUserinfo, resultUserInfo.data);
          const { mobile, is_checkMobile } = newCurrentUserinfo;
          const newCurrentCommunityUser = Object.assign({}, currentCommunityUser, { mobile, is_checkMobile });
          yield put({
            type: 'update',
            payload: { userinfo: newCurrentUserinfo, communityUser: newCurrentCommunityUser }
          });
          yield put({ type: 'getUserInfo', payload: {} });
          Toast.show({
            icon: 'success',
            content: '验证码发送成功'
          });
        } else {
          Toast.show({
            icon: 'fail',
            content: '验证失败'
          });
        }
      } else {
        Toast.show({
          icon: 'fail',
          content: '请输入手机号和验证码'
        });
      }
    },
    // 反馈
    *saveFeedback({ payload: data }, { call, put, select }) {
      const { feedback } = data;
      const { id, name, areas, build, unit, room } = yield select((state) => state.common.communityUser);
      if (feedback && id && name && areas && build && unit && room) {
        const result = yield call(superUpdateCommunityUser, { feedback, id });
        if (result && result.status == 200) {
          yield put({ type: 'getCommunityUserInfo', payload: {} });
          Toast.show({
            icon: 'success',
            content: '反馈已经提交'
          });
        } else {
          Toast.show({
            icon: 'fail',
            content: '服务问题请重试'
          });
        }
      } else {
        Toast.show({
          icon: 'fail',
          content: '请先处理必填项'
        });
      }
    },
    *saveName({ payload: data }, { call, put, select }) {
      const { name } = data;
      const { id, areas, build, unit, room } = yield select((state) => state.common.communityUser);
      if (id && areas && build && unit && room && name) {
        const result = yield call(saveName, { name, id });
        if (result && result.status == 200) {
          yield put({ type: 'getCommunityUserInfo', payload: {} });
          Toast.show({
            icon: 'success',
            content: '姓名已保存'
          });
        } else {
          Toast.show({
            icon: 'fail',
            content: '服务问题请重试'
          });
        }
      } else {
        Toast.show({
          icon: 'fail',
          content: '请先处理必填项'
        });
      }
    },
    *saveOwnerStatus({ payload: data }, { call, put, select }) {
      const { is_checkMobile } = yield select((state) => state.common.userinfo);
      const { id, areas, build, unit, room, name } = yield select((state) => state.common.communityUser);
      if (id && areas && build && unit && room && data && name && is_checkMobile) {
        const postData = Object.assign({}, data, { id });
        const result = yield call(superUpdateCommunityUser, postData);
        if (result && result.status == 200) {
          yield put({ type: 'getCommunityUserInfo', payload: {} });
        } else {
          Toast.show({
            icon: 'fail',
            content: '服务问题请重试'
          });
        }
      } else {
        Toast.show({
          icon: 'fail',
          content: '请先处理必填项'
        });
      }
    },
    // 提交 意愿申请
    *submitContractPDF({ payload: data }, { call, put, select }) {
      const { is_checkMobile, mobile } = yield select((state) => state.common.userinfo);
      const { id, areas, build, unit, room, signatureFile, owner, propertyType, name } = yield select(
        (state) => state.common.communityUser
      );
      if (areas && build && unit && room && signatureFile && id && mobile && is_checkMobile && propertyType) {
        yield put({ type: 'update', payload: { communityUserSubmitLoading: true } });
        const result = yield call(submitContractAgree, {
          id,
          areas,
          build,
          unit,
          room,
          name,
          is_checkMobile,
          owner,
          propertyType
        });
        if (result && result.status == 200) {
          yield put({ type: 'getCommunityUserInfo', payload: {} });
          yield put({ type: 'update', payload: { communityUserSubmitLoading: false } });
          Toast.show({
            icon: 'success',
            content: '意愿提交成功！'
          });
        } else {
          yield put({ type: 'update', payload: { communityUserSubmitUnwillingLoading: true } });
          Toast.show({
            icon: 'fail',
            content: '提交失败，刷新页面重试'
          });
        }
      } else {
        Toast.show({
          icon: 'fail',
          content: '检测参数'
        });
      }
    },
    // 不惨 意愿申请
    *submitContractUnwilling({ payload: data }, { call, put, select }) {
      const { is_checkMobile } = yield select((state) => state.common.userinfo);
      const { id, areas, build, unit, room, owner, name, propertyType } = yield select(
        (state) => state.common.communityUser
      );
      if (is_checkMobile && areas && build && unit && room && propertyType) {
        yield put({ type: 'update', payload: { communityUserSubmitUnwillingLoading: true } });
        const result = yield call(submitContractUnwilling, {
          id,
          areas,
          build,
          unit,
          room,
          name,
          owner,
          is_checkMobile,
          propertyType
        });
        if (result && result.status == 200) {
          yield put({ type: 'getCommunityUserInfo', payload: {} });
          yield put({ type: 'update', payload: { communityUserSubmitUnwillingLoading: false } });
          Toast.show({
            icon: 'success',
            content: '不同意意愿申请提交成功！'
          });
        } else {
          yield put({ type: 'update', payload: { communityUserSubmitUnwillingLoading: true } });
          Toast.show({
            icon: 'fail',
            content: '提交失败，刷新页面重试'
          });
        }
      } else {
        Toast.show({
          icon: 'fail',
          content: '检测参数'
        });
      }
    }
  },

  reducers: {
    update(state, { payload: data }) {
      console.log('reducers update data:', { ...data });
      console.log('reducers update:', { ...state, ...data });
      return { ...state, ...data };
    }
  }
};
