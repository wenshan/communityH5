import React, { Component } from 'react';
import { Toast, Button, Space, InputItem, Picker, Modal, Icon } from 'antd-mobile';
import DepositPayPicker from './index';
import './index.less';

class Demo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false // modal 是否可见
    };
  }

  getDepositType = (item, visible) => {
    this.setState(
      {
        visible: false
      },
      () => {
        // console.log(item);
      }
    );
  };

  submitPay = () => {
    this.setState({
      visible: true
    });
  };

  render() {
    return (
      <div>
        <Button type='primary' onClick={this.submitPay}>
          申请免押并支付
        </Button>
        <DepositPayPicker visible={this.state.visible} callback={this.getDepositType} deposit_type='cash' />
      </div>
    );
  }
}

export default Demo;
