import React, { Component } from 'react';
import { connect } from 'dva';
import { Toast, Modal } from 'antd-mobile';
import './index.less';

let setIntervalTime = null;

class LoginTitle extends Component {
  render() {
    return (
      <div className="loginTitle">{ this.props.isNotLogin ? '绑定手机号' : '登录'}</div>
    );
  }
}
class LoginModal extends Component {
  getMobile = (event) => {
    const value = event.target.value;
    this.props.dispatch({
      type: 'loginModal/update',
      payload: { mobile: value },
    });
  }

  getCode = (event) => {
    const value = event.target.value;
    this.props.dispatch({
      type: 'loginModal/update',
      payload: { code: value },
    });
  }

  login = () => {
    if (this.props.mobile == '' || this.props.mobile.length != 11 || this.props.code == '' || this.props.code.length != 4) {
      this.showToast('请输入有效的手机号或输入有效验证码！');
      return false;
    }

    this.props.dispatch({
      type: 'loginModal/login',
    }).then(() => {

      this.props.dispatch({
        type: 'loginModal/update',
        payload: { smsTime: 30, code: '' },
      });

      if (this.props.erroMessage != '') {
        this.showToast(this.props.erroMessage);
        this.props.onConfirmHandle('confirm but login filed!');
      } else {
        this.props.onConfirmHandle('confirm and login successed!');
        this.props.dispatch({
          type: 'loginModal/update',
          payload: { mobile: '', sending: 0 },
        });
        this.props.onClickToClose();
      }
    });
  }

  sendSms = () => {
    if (this.props.mobile == '' || this.props.mobile.length != 11) {
      this.showToast('请输入有效的手机号！');
      return false;
    }

    this.props.dispatch({
      type: 'loginModal/sendSms',
      payload: {
        code: this.props.code,
        mobile: this.props.mobile,
      },
    }).then(() => {
      this.jishiTime();
      if (this.props.erroMessage && this.props.erroMessage != '') {
        clearInterval(setIntervalTime);
        this.showToast(this.props.erroMessage);
      }
    });
  }

  jishiTime = () => {
    clearInterval(setIntervalTime);
    let num = 30;
    setIntervalTime = setInterval(() => {
      num--;
      this.props.dispatch({
        type: 'loginModal/update',
        payload: { smsTime: num },
      });

      if (num == 0 || (this.props.erroMessage && this.props.erroMessage != '')) {
        clearInterval(setIntervalTime);
        this.props.dispatch({
          type: 'loginModal/update',
          payload: { sending: 2, erroMessage: '', smsTime: 30 },
        });
      }
    }, 1000);
  }


  showToast(text) {
    Toast.info(text, 3);
  }

  getJishiTimeHtme() {
    if (this.props.sending == 2) {
      return (<div className="numberWrap" onClick={this.sendSms}>重新获取</div>);
    } if (this.props.sending == 1) {
      return (<div className="numberWrap">{`${this.props.smsTime}秒后重发`}</div>);
    }
    return (<div className="numberWrap" onClick={this.sendSms}>获取验证码</div>);
  }

  handleCloseModal =() => {
    /* clear data before close */
    this.props.dispatch({
      type: 'loginModal/update',
      payload: {
        mobile: '',
        sending: 0,
        code: '',
      },
    });
    /* tigger close event */
    this.props.onClickToClose();
  }

  render() {
    return (
      <div className="loginModal">
        <Modal
          title={<LoginTitle isNotLogin={this.props.third_status} />}
          visible={this.props.visible}
          transparent
          maskClosable={false}
          closable
          className="login-modal"
          onClose={this.handleCloseModal}
        >
          <div className="loginModalWrap">
            <div className="inpuWrapMpblie">
              <input type="number" name="mobile" maxLength="11" placeholder="请输入手机号" value={this.props.mobile} onChange={this.getMobile} />
            </div>
            <div className="inpuWrapNumber">
              <input type="number" name="code" maxLength="4" placeholder="请输入验证码" value={this.props.code} onChange={this.getCode} />
              {this.getJishiTimeHtme()}
            </div>
            { this.props.third_status
              ? <button className="loginBtn" onClick={this.login.bind(this, true)}>绑定</button>
              : <button className="loginBtn" onClick={this.login.bind(this, false)}>登录</button>
                    }
          </div>
        </Modal>
      </div>
    );
  }
}


const mapStateToProps = state => ({
  mobile: state.loginModal.mobile,
  code: state.loginModal.code,
  access_token: state.loginModal.access_token,
  smsText: state.loginModal.smsText,
  sending: state.loginModal.sending,
  smsTime: state.loginModal.smsTime,
  erroMessage: state.loginModal.erroMessage,
  third_status: state.common.third_info && state.common.third_info.third_status, // 第三方登录信息状态 表面用户是否绑定
});

const mapDispatchToProps = dispatch => ({
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginModal);
