import React, { Component } from 'react';
import { connect, history } from 'umi';
import { TabBar, Badge, Space, Grid, List, Toast } from 'antd-mobile';
import {
  UnorderedListOutline,
  PayCircleOutline,
  SetOutline,
} from 'antd-mobile-icons'
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
      history.push(val);
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
    /** 分享 -- start */
    const initShare = new WxShare();
    initShare.reset();
    /** 分享 -- end */
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
    console.log('props userinfo:', this.props.userinfo);
    return (
      <div className="page">
        <div className="user-page">
          <Space></Space>
          <div className="userinfor">
            <div className="avatar"><img src={this.props.userinfo.avatar? this.props.userinfo.avatar : 'https://affiliate-traffic.oss-cn-hongkong.aliyuncs.com/community/img/avatar.png'} /></div>
            <div className="middle">
              <div className="nickname">{this.props.userinfo.nickname}</div>
              <div className="account-type"><span>账户类型：</span>微信授权 | {this.props.userinfo.unionid ? '公众号已关注' : '公众号未关注'}</div>
            </div>
            <div className="arrow"><img src="https://affiliate-traffic.oss-cn-hongkong.aliyuncs.com/community/img/arrow_right.png" /></div>
          </div>
          <Space size="lg"></Space>
          <div className="tool-wrap">
            <div className="content">
              <Grid columns={2} gap={12}>
                <Grid.Item>
                  <div className="item">
                    <span className="img"><img src="http://p.cdn.izhaoli.cn/gc/wx/help2.png?2024" /></span>
                    <span>帮助中心</span>
                  </div>
                </Grid.Item>
                <Grid.Item>
                  <div className="item" onClick={this.modalWxQRcodeStatus}>
                    <span className="img"><img src="http://p.cdn.izhaoli.cn/gc/wx/i4.png?2024" /></span>
                    <span>关注公众号</span>
                  </div>
                </Grid.Item>
              </Grid>
            </div>
          </div>
          <Space size="lg"></Space>
          <List header='基础'>
            <List.Item prefix={<UnorderedListOutline />} onClick={() => {this.gotoPage('/index.html')}}>
            我的信息
            </List.Item>
            <List.Item prefix={<PayCircleOutline />} onClick={() => {this.gotoPage('/wish.html')}}>
            我的意愿
            </List.Item>
          </List>
          <Space size="lg"></Space>
          <List header='其他'>
            <List.Item prefix={<UnorderedListOutline />} onClick={() => { }}>
              分享给我的好友
            </List.Item>
            <List.Item prefix={<UnorderedListOutline />} onClick={() => {}}>
              关于《西子翠苑》
            </List.Item>
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
    userinfo: state.common.userinfo
  }),
)(User);
