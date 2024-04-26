import React, { Component } from 'react';
import { TabBar } from 'antd-mobile';
import { connect } from 'umi';
import { routerRedux } from 'dva/router';
import Cookies from 'js-cookie';

import './index.less';

class LayoutFooter extends Component {
  toggleTab(path) {
    const access_token = Cookies.get('access_token');
    const { openid } = this.props.userinfo;
    if (access_token && openid) {
      this.props.dispatch(routerRedux.push(path));
    } else {
      if (path == '/index.html') {
        this.props.dispatch(routerRedux.push('/index.html'));
      } else {
        this.props.dispatch({
          type: 'common/getUserInfo'
        });
      }
    }
  }

  render() {
    return (
      <div className='myfooter'>
        <TabBar unselectedTintColor='#333' tintColor='#333' barTintColor='white'>
          <TabBar.Item
            title='首页'
            key='首页'
            icon={
              <div
                style={{
                  width: '30px',
                  height: '30px',
                  background: `url('@/images/tab/home.png') center center /  30px 30px no-repeat`
                }}
              />
            }
            selectedIcon={
              <div
                style={{
                  width: '30px',
                  height: '30px',
                  background: `url('@/images/tab/home-active.png') center center /  30px 30px no-repeat`
                }}
              />
            }
            selected={this.props.pathname === '/index.html' || this.props.pathname === '/'}
            onPress={() => {
              this.toggleTab('/index.html');
            }}
            data-seed='logId'
          />
          <TabBar.Item
            title='易物(建设中..)'
            key='易物'
            icon={
              <div
                style={{
                  width: '30px',
                  height: '30px',
                  background: `url('@/images/tab/message.png') center center /  30px 30px no-repeat`
                }}
              />
            }
            selectedIcon={
              <div
                style={{
                  width: '30px',
                  height: '30px',
                  background: `url('@/images/tab/message-active.png') center center /  30px 30px no-repeat`
                }}
              />
            }
            selected={this.props.pathname === '/orderList.html'}
            badge={this.props.cartAmount}
            onPress={() => {
              this.toggleTab('/orderList.html');
            }}
            data-seed='logId'
          />
          <TabBar.Item
            title='话题'
            key='话题'
            icon={
              <div
                style={{
                  width: '30px',
                  height: '30px',
                  background: `url('@/images/tab/cloud.png') center center /  30px 30px no-repeat`
                }}
              />
            }
            selectedIcon={
              <div
                style={{
                  width: '30px',
                  height: '30px',
                  background: `url('@/images/tab/cloud-active.png') center center /  30px 30px no-repeat`
                }}
              />
            }
            selected={this.props.pathname === '/cloud.html'}
            onPress={() => {
              this.toggleTab('/cloud.html');
            }}
            data-seed='logId'
          />
          <TabBar.Item
            title='我的'
            key='我的'
            icon={
              <div
                style={{
                  width: '30px',
                  height: '30px',
                  background: `url('@/images/tab/user.png') center center /  30px 30px no-repeat`
                }}
              />
            }
            selectedIcon={
              <div
                style={{
                  width: '30px',
                  height: '30px',
                  background: `url('@/images/tab/user-active.png') center center /  30px 30px no-repeat`
                }}
              />
            }
            selected={this.props.pathname === '/user.html'}
            onPress={() => {
              this.toggleTab('/user.html');
            }}
            data-seed='logId'
          />
        </TabBar>
      </div>
    );
  }
}

export default connect(
  (state) => ({
    pathname: state.common.pathname,
    userinfo: state.common.userinfo
  }),
)(LayoutFooter);
