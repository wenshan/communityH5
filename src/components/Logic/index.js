import React, { Component } from 'react';
import { connect } from 'dva';
import { Toast, Button, Space, InputItem, Picker, Modal, Icon } from 'antd-mobile';
import moment from 'moment';
import PropTypes from 'prop-types';
import appFunction from '@/utils/appFunction';
import { Tool } from '@/utils/index';
import WxShare from '@/utils/wxShare';
import wxRes from '@/utils/wxRequest';
import { If, Else, Switch, Case, Default, ForEach, item } from './index2.js';
import './index.less';

class Logic extends Component {
  test = () => {
    return true;
  };
  render() {
    let arr = [ 1, 2, 3, 4, 5, 6 ];
    return (
      <div>
        <div>xxxx</div>
        <If expression={true}>
          content2
          <h1>content3</h1>
          <h2>content4</h2>
        </If>
        <Else>
          abc
          <div>content5</div>
          <div>content6</div>
        </Else>
        <Switch var={this.test()}>
          <Case value={1}>
            <div>1111</div>
            <h1>123</h1>
          </Case>
          <Case value={2}>2222</Case>
          <Case value={3}>2222</Case>
          <Default>3333</Default>
        </Switch>
      </div>
    );
  }
}

export default Logic;
