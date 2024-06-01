import React, { Component } from 'react';
import { connect } from 'dva';
import { Toast, Button, Space, InputItem, Picker, Modal, Icon } from 'antd-mobile';
import moment from 'moment';
import PropTypes from 'prop-types';
import './index.less';

const alert = Modal.alert;

class CountDownTime extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nowTime: '',
      endTime: '',
      totalMillisecond: 0,
      visible: false
    };
  }

  componentDidMount() {
    let endTime = moment(this.props.endTime);
    let nowTime = moment(new Date().getTime());
    let millisecond = endTime.diff(nowTime);

    if (millisecond > 0) {
      this.setState(
        {
          nowTime,
          endTime,
          totalMillisecond: millisecond
        },
        () => {
          this.setIntervalTime();
        }
      );
    } else {
      this.setState({
        totalMillisecond: 0,
        visible: true
      });
    }
  }

  // 计时器
  setIntervalTime = () => {
    let self = this;
    setInterval(() => {
      let newTotalMillisecond = self.state.totalMillisecond - 1000;
      this.setState({
        totalMillisecond: newTotalMillisecond
      });
    }, 1000);
  };

  render() {
    let millisecond = this.state.totalMillisecond;
    let days = moment.duration(millisecond).days();
    let hours = moment.duration(millisecond).hours();
    let minutes = moment.duration(millisecond).minutes();
    let seconds = moment.duration(millisecond).seconds();
    return (
      <div className='count-Down-time'>
        <div className='time-box'>
          <span className='days'>{days}</span>
          <span className='tx'>天</span>
          <span className='hours'>{hours}</span>
          <span className='tx'>时</span>
          <span className='minutes'>{minutes}</span>
          <span className='tx'>分</span>
          <span className='seconds'>{seconds}</span>
          <span className='tx'>秒</span>
        </div>
        <Modal visible={this.state.visible} transparent maskClosable={false} title=''>
          <div style={{ height: 50 }}>活动已经结束，详情请咨询客服人员，谢谢关注。</div>
        </Modal>
      </div>
    );
  }
}

CountDownTime.defaultProps = {
  nowTime: '',
  endTime: ''
};

CountDownTime.propTypes = {
  nowTime: PropTypes.string,
  endTime: PropTypes.string
};

export default CountDownTime;
