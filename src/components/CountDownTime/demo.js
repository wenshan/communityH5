import React, { Component } from 'react';
import { Toast, Button, Space, InputItem, Picker, Modal, Icon } from 'antd-mobile';
import CountDownTime from './index';
import './index.less';

let initInterval = null;

class Demo extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <CountDownTime endTime='2018-10-25 23:59:00' />
      </div>
    );
  }
}

export default Demo;
