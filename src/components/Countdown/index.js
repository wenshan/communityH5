// JavaScript Document
import React, { Component } from 'react';
import { connect } from 'umi';
import { Toast, Button } from 'antd-mobile';
import msgStatus from '@/constant/msgStatus';
import './index.less';

const timeCount = 60;

class Countdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nums: props.nums || timeCount, // 倒计时时间（s）
      countdown: '发送验证码', // 倒计时按钮值
      status: props.status // 倒计时按钮状态(disable:不可发送,able:可发送,sending:倒计时中)
    };
  }

  componentWillUnmount() {
    clearInterval(this.clock);
  }
  // 点击发送验证码
  handleSend = () => {
    const _self = this;
    const { smsCodeStatus, userinfo } = this.props;
    const { mobile } = userinfo;
    const reg = /^1[0-9]{10}$/; //验证规则
    const flag = reg.test(mobile); // true
    if (mobile && flag) {
      switch (smsCodeStatus) {
        // 按钮处于可发送状态发送并倒计时
        case 'able':
          // 倒计时开启
          this.clock = setInterval(() => this.doLoop(), 1000);
          // 状态改变
          this.setState({
            status: 'able',
            countdown: '重新发送(' + this.state.nums + 's)'
          });
          // 通知父组件
          break;
        case 'disable':
          this.setState({
            status: 'disable',
            countdown: '发送验证码'
          });
          break;
        case 'sending':
          this.setState(
            {
              status: 'sending',
              countdown: '发送验证码'
            },
            () => {
              _self.resetButton();
              // 发送请求
              _self.props.dispatch({
                type: 'common/communitySendSms',
                payload: { mobile }
              });
            }
          );

          break;
        default:
          this.setState({
            status: 'sending',
            countdown: '发送验证码'
          });
          break;
      }
    } else {
      Toast.show({
        icon: 'fail',
        content: '请输入正确的手机号'
      });
    }
  };
  // 倒计时实现
  doLoop() {
    var nums = this.state.nums;
    nums--;
    this.setState({
      nums: nums
    });
    if (nums > 0) {
      this.setState({
        countdown: '重新发送(' + nums + 's)'
      });
    } else {
      this.resetButton();
    }
  }
  // 按钮重置
  resetButton() {
    const _self = this;
    clearInterval(this.clock); // 清除js定时器
    this.setState(
      {
        countdown: '发送验证码',
        status: 'sending',
        nums: timeCount // 重置时间
      },
      () => {
        _self.props.dispatch({
          type: 'common/update',
          payload: { smsCodeStatus: 'sending' }
        });
      }
    );
    // 通知父组件
  }
  componentWillReceiveProps(nextProps) {
    const { smsCodeStatus } = nextProps;
    if (smsCodeStatus !== this.props.smsCodeStatus) {
      switch (smsCodeStatus) {
        case 'able':
          this.clock = setInterval(() => this.doLoop(), 1000);
          this.setState({
            status: 'able',
            countdown: '重新发送(' + this.state.nums + 's)'
          });
          break;
        case 'disable':
          this.setState({
            status: 'disable',
            countdown: '发送验证码'
          });
          break;
        case 'sending':
          this.setState({
            status: 'sending',
            countdown: '发送验证码'
          });
          break;
        default:
          this.setState({
            status: 'sending',
            countdown: '发送验证码'
          });
          break;
      }
    }
  }

  render() {
    const { status } = this.state;
    return (
      <Button
        id='sendCodeAction'
        color='primary'
        className='sms-send'
        fill='solid'
        size='small'
        disabled={status == 'able' ? true : false}
        onClick={this.handleSend}
      >
        {this.state.countdown}
      </Button>
    );
  }
}

export default connect((state) => ({
  userinfo: state.common.userinfo,
  smsCodeStatus: state.common.smsCodeStatus
}))(Countdown);
