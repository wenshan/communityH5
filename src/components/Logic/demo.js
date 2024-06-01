import React, { Component } from 'react';
import { Toast, Button, Space, InputItem, Picker, Modal, Icon } from 'antd-mobile';
import Logic from './index';

class Demo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false
    };
  }

  render() {
    return (
      <div>
        <Logic />
      </div>
    );
  }
}

export default Demo;
