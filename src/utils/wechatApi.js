const fixUrl = 'https://api.weixin.qq.com';
const fixUrlPay = 'https://api.mch.weixin.qq.com';
const API = {
  WEBTOKENGET: `${fixUrl}/sns/oauth2/access_token`, // TOKEN 接口
  WEBUSERINFOGET: `${fixUrl}/sns/userinfo`, // Userinfor 接口 https://api.weixin.qq.com/sns/userinfo?access_token=ACCESS_TOKEN&openid=OPENID&lang=zh_CN
  WEBREFRESHTOKENGET: `${fixUrl}/sns/oauth2/refresh_token`, // refresh_token 刷新token接口
  SERVICEGETPREPAYIDPOST: `${fixUrlPay}/v3/pay/transactions/jsapi` // JSAPI下单
};
module.exports = API;
