import wx from 'weixin-js-sdk';
import { getShareConfig } from './commonService';

const WxShare = {
  params: {
    baseurl: 'https://www.dreamstep.top/',
    img_url: 'https://affiliate-traffic.oss-cn-hongkong.aliyuncs.com/community/img/logo2.png',
    page_url: 'https://www.dreamstep.top/index.html',
    timeline_url: 'https://www.dreamstep.top/',
    friend_title: '西子翠苑',
    friend_content: '西子翠苑-为翠苑社区公益服务',
    timeline_content: '西子翠苑'
  },
  reset(params) {
    const initParams = params || {};
    getShareConfig().then((res) => {
      if (res.status == 200 && res.data) {
        let data = res.data;
        this.init(data, initParams);
      }
    });
  },
  init(data, params) {
    let initParams = params || {};
    this.params = Object.assign({}, this.params, initParams, {
      page_url: initParams.page_url || document.location.href
    });
    wx.config({
      debug: true,
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
      console.log('分享已经开启成功！');
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
