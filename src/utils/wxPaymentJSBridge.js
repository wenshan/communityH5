const wxPaymentJSBridge = async (paymentData) => {
  if (!window.WeixinJSBridge) {
    return false;
  }
  return new Promise((resolve, reject) => {
    WeixinJSBridge.invoke(
      'getBrandWCPayRequest',
      {
        appId: paymentData.appid,
        timeStamp: paymentData.timeStamp,
        nonceStr: paymentData.nonceStr,
        package: `prepay_id=${paymentData.prepay_id}`,
        signType: 'RSA',
        paySign: paymentData.paySign
      },
      (res) => {
        console.log('WeixinJSBridge:', res);
        // 使用以上方式判断前端返回,微信团队郑重提示：
        // res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。 2
        // get_brand_wcpay_request:cancel 1
        // get_brand_wcpay_request:fail 3
        // Toast.info('支付成功');
        let returnData;
        // err_msg: 'get_brand_wcpay_request:cancel
        if (res.err_msg == 'get_brand_wcpay_request:cancel' || res.err_msg == 'get_brand_wcpay_request:fail') {
          if (res.err_msg == 'get_brand_wcpay_request:fail') {
            returnData = {
              prepay_id: paymentData.prepay_id,
              pay_status: 3,
              msg: '支付失败'
            };
          } else {
            returnData = {
              prepay_id: paymentData.prepay_id,
              pay_status: 1,
              msg: '支付被终止'
            };
          }
          reject(returnData);
        } else {
          returnData = {
            prepay_id: paymentData.prepay_id,
            pay_status: 2,
            msg: '支付成功'
          };
          resolve(returnData);
        }
      }
    );
  });
};
module.exports = wxPaymentJSBridge;
