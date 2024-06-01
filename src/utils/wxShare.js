import wx from 'weixin-js-sdk';
import { getShareConfig } from './commonService';

class WxShare {
  constructor() {
    this.params = {
      baseurl: 'https://www.dreamstep.top/',
      img_url: 'https://img.dreamstep.top/community/img/logo2.png',
      page_url: 'https://www.dreamstep.top/index.html',
      timeline_url: 'https://www.dreamstep.top/index.html',
      friend_title: '西子翠苑-翠苑社区公益服务',
      friend_content: '共商共助，携手共建美好翠苑家园',
      timeline_content: '西子翠苑'
    };
  }
  reset(params) {
    this.params = Object.assign({}, this.params, params);
    getShareConfig({ url: this.params.page_url }).then((res) => {
      if (res.status == 200 && res.data) {
        this.params = Object.assign({}, this.params, res.data);
        this.init(this.params);
      }
    });
  }
  init(params) {
    this.params = Object.assign({}, params, { page_url: params.page_url || document.location.href });
    wx.config({
      debug: false,
      appId: 'wx7284b74cc03f0299',
      timestamp: this.params.timestamp,
      nonceStr: this.params.nonceStr,
      signature: this.params.signature,
      jsApiList: [
        'openEnterpriseChat',
        'openEnterpriseContact',
        'checkJsApi',
        'onMenuShareWeibo',
        'hideMenuItems',
        'showMenuItems',
        'hideAllNonBaseMenuItem',
        'showAllNonBaseMenuItem',
        'updateAppMessageShareData',
        'updateTimelineShareData'
      ]
    });
    this.BindShare();
  }
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
}

export default WxShare;
