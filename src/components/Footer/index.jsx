import React, { Component } from 'react';
import { TabBar } from 'antd-mobile';
import { connect } from 'umi';
import { history } from 'umi';
import Cookies from 'js-cookie';

import './index.less';

class LayoutFooter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeKey: '/index',
    };
    this.tabsTable = [
      {
        key: '/index.html',
        title: '首页',
        icon: (active) => active ? <img src="https://img.dreamstep.top/community/tab/icon-home-ac.png" /> : <img src="https://img.dreamstep.top/community/tab/icon-home.png" />,
      },
      {
        key: '/mall.html',
        title: '易物(建设中..)',
        icon: (active) => active ? <img src="https://img.dreamstep.top/community/tab/icon-gift-ac.png" /> : <img src="https://img.dreamstep.top/community/tab/icon-gift.png" />,
      },
      {
        key: '/intention.html',
        title: '话题',
        icon: (active) => active ? <img src="https://img.dreamstep.top/community/tab/icon-topic-ac.png" /> : <img src="https://img.dreamstep.top/community/tab/icon-topic.png" />,
      },
      {
        key: '/user.html',
        title: '我的',
        icon: (active) => active ? <img src="https://img.dreamstep.top/community/tab/icon-user.png" /> : <img src="https://img.dreamstep.top/community/tab/icon-user.png" />,
      },
    ]
  }

  setActiveKey = (key) => {
    const access_token = Cookies.get('access_token');
    const { openid } = this.props.userinfo;
    this.setState({
      activeKey: key,
    });
    this.props.dispatch({
      type: 'common/update',
      payload: {
        activeKey: key,
      }
    });
    if (access_token && openid) {
      history.push(key);
    } else {
      if (key == '/index.html') {
        history.push('/index.html');
      } else {
        this.props.dispatch({
          type: 'common/getUserInfo'
        });
      }
    }
  }

  render() {
    return (
      <div className='footer'>
        <TabBar activeKey={this.props.activeKey} onChange={this.setActiveKey}>
          {this.tabsTable.map(item => (
            <TabBar.Item key={item.key} icon={item.icon} title={item.title} />
          ))}
        </TabBar>
      </div>
    );
  }
}

export default connect(
  (state) => ({
    activeKey: state.common.activeKey,
    userinfo: state.common.userinfo
  }),
)(LayoutFooter);
