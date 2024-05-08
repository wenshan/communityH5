import wx from 'weixin-js-sdk';
import config from './config';
import wxRes from './wxRequest';

const WxShare = {
  params: {
    baseurl: config.BASE_URL,
    img_url: 'https://static-rs.msparis.com/m-site/images/app_logo.png',
    page_url: 'http://ms.msparis.com/index.html',
    timeline_url: config.BASE_URL,
    friend_title: '西子翠苑',
    friend_content: '西子翠苑',
    timeline_content: '西子翠苑'
  },
  reset(params) {
    const initParams = params || {};
    wxRes.getConfig().then((res) => {
      let resdata = res.data;
      this.init(resdata, initParams);
    });
  },
  init(data, params) {
    let initParams = params || {};
    this.params = Object.assign({}, this.params, initParams, {
      page_url: initParams.page_url || document.location.href
    });
    wx.config({
      debug: false,
      appId: 'wx7284b74cc03f0299',
      timestamp: data.timestamp,
      nonceStr: data.nonceStr,
      signature: data.signature,
      jsApiList: [
        'openEnterpriseChat',
        'openEnterpriseContact',
        'checkJsApi',
        'onMenuShareTimeline',
        'onMenuShareAppMessage',
        'onMenuShareQQ',
        'onMenuShareWeibo',
        'hideMenuItems',
        'showMenuItems',
        'hideAllNonBaseMenuItem',
        'showAllNonBaseMenuItem',
        'translateVoice',
        'startRecord',
        'stopRecord',
        'onRecordEnd',
        'playVoice',
        'pauseVoice',
        'stopVoice',
        'uploadVoice',
        'downloadVoice',
        'chooseImage',
        'previewImage',
        'uploadImage',
        'downloadImage',
        'getNetworkType',
        'openLocation',
        'getLocation',
        'hideOptionMenu',
        'showOptionMenu',
        'closeWindow',
        'scanQRCode',
        'chooseWXPay',
        'openProductSpecificView',
        'addCard',
        'chooseCard',
        'openCard'
      ]
    });
    this.BindShare();
  },
  BindShare() {
    wx.ready(() => {
      wx.updateAppMessageShareData({
        title: this.params.friend_title,
        desc: this.params.friend_content,
        link: this.params.page_url,
        imgUrl: this.params.img_url,
        success: (res) => {
          console.log(res, this.params);
        },
        fail: (res) => {
          console.log(res, this.params);
        }
      });
      wx.updateTimelineShareData({
        title: this.params.friend_title, // 分享标题
        link: this.params.page_url, // 分享链接
        imgUrl: this.params.img_url, // 分享图标
        success: (res) => {
          console.log(res);
        },
        fail: (res) => {
          console.log(res);
        }
      });
    });
  }
};

export default WxShare;
