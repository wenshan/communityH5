import wx from 'weixin-js-sdk';
import config from '@/config/index';
import wxRes from './wxRequest';

const WxShare = {
  params: {
    baseurl: config.BASE_URL,
    img_url: 'https://static-rs.msparis.com/m-site/images/app_logo.png',
    page_url: 'http://ms.msparis.com/index.html',
    timeline_url: config.BASE_URL,
    friend_title: "MSParis女神派",
    friend_content: "MSParis女神派",
    timeline_content: "MSParis女神派",
  },
  reset(params) {
    const initParams = params || {};
    wxRes.getConfig().then(res => {
      let resdata = res.data;
      this.init(resdata, initParams);
    });
  },
  init(data, params) {
    let initParams = params || {};
    this.params = Object.assign({}, this.params, initParams, {page_url: initParams.page_url || document.location.href});
    wx.config({
      debug: false,
      appId: data.appId,
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
        'openCard',
      ],
    });
    this.BindShare();
  },
  BindShare() {
    wx.ready(() => {
      wx.onMenuShareAppMessage({
        title: this.params.friend_title,
        desc: this.params.friend_content,
        link: this.params.page_url,
        imgUrl: this.params.img_url,
        success: (res) => {
          console.log(res, this.params);
        },
        fail: (res) => {
          console.log(res, this.params);
        },
      });
      wx.onMenuShareTimeline({
        title: this.params.friend_title, // 分享标题
        link: this.params.page_url, // 分享链接
        imgUrl: this.params.img_url, // 分享图标
        success: (res) => {
          console.log(res);
        },
        fail: (res) => {
          console.log(res);
        },
      });
      wx.onMenuShareQQ({
        title: this.params.friend_title, // 分享标题
        desc: this.params.friend_content, // 分享描述
        link: this.params.page_url,
        imgUrl: this.params.img_url,
        success: (res) => {
          console.log(res);
        },
        fail: (res) => {
          console.log(res);
        },
      });
      wx.onMenuShareWeibo({
        title: this.params.friend_title, // 分享标题
        desc: this.params.friend_content, // 分享描述
        link: this.params.page_url,
        imgUrl: this.params.img_url,
        success: (res) => {
          console.log(res);
        },
        fail: (res) => {
          console.log(res);
        },
      });
    });
  },
  wxPay(data, callback) {
    wx.chooseWXPay({
      timestamp: String(data.timeStamp), // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
      nonceStr: data.nonceStr, // 支付签名随机串，不长于 32 位
      package: data.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
      signType: data.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
      paySign: data.paySign, // 支付签名
      success: (res) => {
        callback(res);
      },
      fail: (res) => {
        console.log(res);
      },
    });
  },
  choseImg() {
    wx.chooseImage({
      count: 9, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: (res) => {
        let localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
        this.uploadImg(localIds);
        Array.from(localIds).forEach((id) => {
          this.uploadImg(id);
        });
      },
    });
  },

  uploadImg(localIds) {
    let id = localIds.pop();
    wx.uploadImage({
      localId: id, // 需要上传的图片的本地ID，由chooseImage接口获得
      isShowProgressTips: 1, // 默认为1，显示进度提示
      success: (res) => {
        let serverId = res.serverId; // 返回图片的服务器端ID
        // store.commit('addPic', { img: id, serverId: serverId });
        if (localIds.length > 0) {
          this.uploadImg(localIds);
        }
      },
    });
  },
  getLocation(callback) {
    wx.getLocation({
      type: 'wgs84',
      success: (res) => {
        callback(true, res);
      },
    });
  },
};

export default WxShare;
