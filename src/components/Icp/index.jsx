import React, { Component } from 'react';
import { TabBar } from 'antd-mobile';
import { connect } from 'umi';
import { history } from 'umi';
import Cookies from 'js-cookie';

import './index.less';

class ICP extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }
  render() {
    return (
      <div className='footer-icp'>
       <p><a href='https://beian.miit.gov.cn/#/Integrated/index' target='_blank'>浙ICP备2023008986号</a></p>
      </div>
    );
  }
}

export default ICP
