import React, { Component } from 'react';
import { connect } from 'umi';
import Cookies from 'js-cookie';
import { Toast, Button, Space } from 'antd-mobile';
import './index.less';
import { Tool } from '@/utils/index';
import WxShare from '@/utils/wxShare';


let setIntervalTime = null;

class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  getMobile = (event) => {
    const value = event.target.value;
    this.props.dispatch({
      type: 'login/update',
      payload: { mobile: value },
    });

    this.props.dispatch({
      type: 'common/update',
      payload: { mobile: value },
    });
  }

  getCode = (event) => {
    const value = event.target.value;
    this.props.dispatch({
      type: 'login/update',
      payload: { code: value },
    });
  }


  login = () => {
    const thirdInfo = this.props.third_info || Cookies.getJSON('third_info');
    const userInfo = Cookies.getJSON('user_info');
    const openId = thirdInfo ? thirdInfo.open_id : '';
    const third_status = thirdInfo ? thirdInfo.third_status : '';
    // 1.微信 2.QQ 3新浪 4.微信公众号 5.支付宝生活号 6.京东 7.返利
    let type = this.props.type;
    if (Tool.isWeiXin()){
      type = 4;
    } else if (this.props.platform == 'zhima' || this.props.platform == 'huabei'){
      type = 5;
    } else {
      type = 1;
    }

    this.props.dispatch({
      type: 'login/update',
      payload: {
        mobile: this.props.mobile,
        type,
      },
    });

    this.props.dispatch({
      type: 'common/update',
      payload: { mobile: this.props.mobile },
    });

    if (this.props.mobile == '' || this.props.mobile.length != 11 || this.props.code == '' || this.props.code.length != 4) {
      this.showToast('请输入有效的手机号或输入有效验证码！');
      return false;
    }

    // 绑定手机微信

    this.props.dispatch({
      type: 'login/login',
      payload: {
        code: this.props.code,
        mobile: this.props.mobile,
      },
    });

    this.props.dispatch({
      type: 'login/init',
    });
  }

  sendSms = () => {
    this.props.dispatch({
      type: 'login/update',
      payload: { mobile: this.props.mobile },
    });

    if (this.props.mobile == '' || this.props.mobile.length != 11) {
      this.showToast('请输入有效的手机号！');
      return false;
    }

    this.props.dispatch({
      type: 'login/sendSms',
      payload: {
        mobile: this.props.mobile,
      },
    }).then(() => {
      this.setIntervalTime();
      if (this.props.erroMessage && this.props.erroMessage != '') {
        clearInterval(setIntervalTime);
        this.showToast(this.props.erroMessage);
      }
    });
  }

  setIntervalTime = () => {
    clearInterval(setIntervalTime);
    let numConst = 30;
    setIntervalTime = setInterval(() => {
      numConst--;
      this.props.dispatch({
        type: 'login/update',
        payload: { smsTime: numConst },
      });

      if (numConst == 0 || (this.props.erroMessage && this.props.erroMessage != '')) {
        clearInterval(setIntervalTime);
        this.props.dispatch({
          type: 'login/update',
          payload: { sending: 2, erroMessage: '', smsTime: 30 },
        });
      }
    }, 1000);
  }

  // tips
  showToast(text) {
    Toast.info(text, 3);
  }

  // 验证码计数器
  intervalTimeHtml() {
    let html = '';
    if (this.props.sending == 2) {
      html = (<div className="numberWrap" onClick={this.sendSms}>重新获取</div>);
    } else if (this.props.sending == 1) {
      html = (<div className="numberWrap">{`${this.props.smsTime}秒后重发`}</div>);
    } else {
      html = (<div className="numberWrap" onClick={this.sendSms}>获取验证码</div>);
    }
    return html;
  }

  // 跳转会员协议
  agreement = () => {
    this.props.history.push('/useragreement.html');
  }

  getVoiceCode = () => {
    // 语音验证码
    if (this.props.mobile == '' || this.props.mobile.length != 11) {
      this.showToast('请输入有效的手机号！');
      return false;
    }

    this.props.dispatch({
      type: 'login/sendSmsVoice',
      payload: {
        mobile: this.props.mobile,
      },
    }).then(() => {
      this.setIntervalTime();
      if (this.props.erroMessage && this.props.erroMessage != '') {
        clearInterval(setIntervalTime);
        this.showToast(this.props.erroMessage);
      } else {
        this.showToast("电话拨打中...请留意相关电话");
      }
    });
  }

  switchLoginMethod = () => {
    this.props.history.push('/password_login.html');
  }

  switchLoginRenderHtml = () => {
    const canUsePassword = Tool.isWeiXin() !== 'wx';
    let html = '';
    if (this.props.platform == 'huabei' || this.props.platform == 'zhima'){
      html = '';
    } else {
      html = (
        <div className="switch" onClick={this.switchLoginMethod}>
          <div className="current">
            您好，请用验证码登录
          </div>
          {
            canUsePassword && (
              <div className="other">
                <span className="text">
                  密码登录
                </span>
                <i className="other-icon"></i>
              </div>
            )
          }
        </div>);
    }
    return html;
  }

  render() {
    return (
      <div className="login-page" id="login-page">
        <h2 className="title">
          {this.switchLoginRenderHtml()}
        </h2>
        <div className="title-des">{this.props.login_slogan}</div>
        <div className="bgtopWrap">
          <div className="loginWrap">
            <div className="inpuWrapMpblie">
              <input type="number" name="mobile" maxLength="11" placeholder="请输入手机号" value={this.props.mobile} onChange={this.getMobile} />
            </div>
            <Space />
            <div className="inpuWrapNumber">
              <input type="number" name="code" maxLength="4" placeholder="请输入验证码" value={this.props.code} onChange={this.getCode} />
              {this.intervalTimeHtml()}
            </div>

            <Space />
            <Space />
            <Space />

            <div className="button">
              <Button type="warning" onClick={this.login}>登录</Button>
            </div>

            <Space />
            <Space />
            <Space />

            <div className="see-des" onClick={this.agreement}>
              登录后即表示接受
              <span>《用户协议》</span>
            </div>
            <div className="see-des" onClick={this.getVoiceCode}>
              收不到短信？
              <span>使用语音验证码</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

LoginPage.propDefault = {
  mobile: '',
  code: '',
  invitation_code: '',
  access_token: '',
  nickname: '',
  new_user: '',
  is_has_buy_card: '',
  smsText: '发送验证码',
  sending: false,
  smsTime: 30,
  erroMessage: '',
};


export default connect(
  (state) => ({
    mobile: state.login.mobile || state.common.mobile,
    user_info: state.common.user_info,
    platform: state.common.platform,
    login_slogan: state.common.login_slogan,
    third_info: state.common.third_info,
    type: state.login.type,
    code: state.login.code,
    access_token: state.login.access_token,
    invitation_code: state.login.invitation_code,
    new_user: state.login.new_user,
    is_has_buy_card: state.login.is_has_buy_card,
    nickname: state.login.nickname,
    smsText: state.login.smsText,
    sending: state.login.sending,
    smsTime: state.login.smsTime,
    erroMessage: state.login.erroMessage,
  }),
)(LoginPage);
