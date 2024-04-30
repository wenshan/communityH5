import React, { Component } from 'react';
import { connect } from 'umi';
import { TabBar, Badge, Space, Grid, List, Toast } from 'antd-mobile';
import { routerRedux } from 'dva/router';
import WxQRcode from '@/components/WxQRcode';
import Footer from '@/components/Footer';

import './index.less';

const Item = List.Item;
const Brief = Item.Brief;

class User extends Component {
  constructor(props) {
    super(props);
    console.log('props:', props);
    this.state = {};
  }
  gotoPage = (val) => {
    if (val){
      this.props.dispatch(routerRedux.push(val));
    }
  }
  shareToPage = () => {
    /*
    wx.ready(function () {
      wx.updateAppMessageShareData({
        title: '西湖翠苑社区', // 分享标题
        desc: '复刻专属的声音，让我们创造更有个性。', // 分享描述
        link: 'https://www.dreamstep.top/', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: 'https://img.dreamstep.top/ai/banner_03_01.png', // 分享图标
        success: () => {
          Toast.info('分享成功！');
        }
      })
    });
    */
  }
  modalWxQRcodeStatus = () => {
    this.props.dispatch({
      type: 'common/update',
      payload: {
        unionidModalStatus: true
      }
    });
  }

  componentDidMount() {
    // 授权登录
    this.props.dispatch({
      type: 'user/getUserInfo',
    });
    this.props.dispatch({
      type: 'common/update',
      payload: {
        unionidModalStatus: false
      }
    });
  }

  render() {
    console.log('props:', this.props);
    return (
      <div className="page">
        <div className="user-page">
          <Space></Space>
          <div className="userinfor">
            <div className="avatar"><img src={this.props.userinfo.avatar} /></div>
            <div className="middle">
              <div className="nickname">{this.props.userinfo.nickname}</div>
              <div className="account-type"><span>账户类型：</span>微信授权 | {this.props.userinfo.unionid ? '公众号已关注' : '公众号未关注'}</div>
            </div>
            <div className="arrow"><img src="https://img.dreamstep.top/ai/arrow_right.png" /></div>
          </div>
          <Space size="lg"></Space>
          <div className="tool-wrap">
            {/**
            <div className="content">
              <Grid columns={3} gap={8}>
                <Grid.Item>
                  <div className="item">
                    <span className="img"><img src="https://p.cdn.izhaoli.cn/gc/wx/help2.png?2024" /></span>
                    <span>帮助中心</span>
                  </div>
                </Grid.Item>
                <Grid.Item>
                  <div className="item">
                    <span className="img"><img src="https://p.cdn.izhaoli.cn/gc/wx/i2.png?2024" /></span>
                    <span>我的推广</span>
                  </div>
                </Grid.Item>
                <Grid.Item>
                  <div className="item" onClick={this.modalWxQRcodeStatus}>
                    <span className="img"><img src="https://p.cdn.izhaoli.cn/gc/wx/i4.png?2024" /></span>
                    <span>关注公众号</span>
                  </div>
                </Grid.Item>
              </Grid>

            </div>
            */}
          </div>
          <Space size="lg"></Space>
          <List renderHeader={() => '我的账单'} className="my-bill">
            <Item arrow="horizontal" multipleLine onClick={() => { this.gotoPage('/orderList.html') }}>我的订单</Item>
            <Item arrow="horizontal" multipleLine onClick={() => { this.gotoPage('/cloud.html') }}>我云盘</Item>
          </List>
          <Space size="lg"></Space>
          <List renderHeader={() => '其他'} className="my-other">
            <Item arrow="horizontal" multipleLine onClick={this.modalWxQRcodeStatus}>
              在线客服 <Brief>服务时间: 7x24 9:00 - 21:00</Brief>
            </Item>
            <Item arrow="horizontal" multipleLine onClick={() => { this.shareToPage() }}>
              分享给我的好友
            </Item>
            <Item arrow="horizontal" multipleLine onClick={() => {}}>
              关于我们 <Brief>杭州智能复现科技</Brief>
            </Item>
          </List>
          <Space size="lg"></Space>
        </div>
        <WxQRcode></WxQRcode>
      </div>
    );
  }
}

export default connect(
  (state) => ({
    userinfo: state.user.userinfo
  }),
)(User);
