import request from '@/utils/request';
// 老用户登录
export async function login(params) {
  return request('/user/login', {
    method: 'POST',
    data: params
  });
}
// 获取手机验证码
export async function getSms(params) {
  return request('/common/sms', {
    method: 'GET',
    data: params
  });
}
// 获取语音验证码
export async function getSmsVoice(params) {
  return request('/common/voice', {
    method: 'GET',
    data: params
  });
}
// 发券
export async function getReceive(params) {
  return request('/coupon/receive-v2', {
    method: 'POST',
    data: params
  });
}

// 微信登录绑定
// http://wiki.tools.msparis.com/pages/viewpage.action?pageId=1016191
/*
 *
 * params : {open_id:'',type:'1微信 2QQ 3新浪 4.微信公众号 5.支付宝生活号 6.京东 7.返利', mobile:'',code:'',nickname:'',gender:'',head_portrait:'',invitation_code:''}
 *
 */
export async function bindMobile(params) {
  return request('/user/mobile', {
    method: 'POST',
    data: params
  });
}
// cbs login 三方用户登录
// http://wiki.tools.msparis.com/pages/viewpage.action?pageId=2689211
export async function authLogin(params) {
  return request('/api/user/oauth/login', {
    data: params,
    method: 'POST',
    config: {
      type: 'CSB',
      isAccess: true
    }
  });
}

// cbs 三方用户绑定
// http://wiki.tools.msparis.com/pages/viewpage.action?pageId=2689213
export async function thirdPartyBind(params) {
  return request('/api/user/oauth/bind', {
    data: params,
    method: 'POST',
    config: {
      type: 'CSB',
      isAccess: true
    }
  });
}

// cbs 三方用户解绑
// http://wiki.tools.msparis.com/pages/viewpage.action?pageId=2689216
export async function unbindThirdParty(params) {
  return request('/api/user/oauth/unbind', {
    data: params,
    method: 'POST',
    config: {
      type: 'CSB',
      isAccess: true
    }
  });
}
