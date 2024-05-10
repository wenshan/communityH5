import React, { Component } from 'react';
import { connect } from 'umi';
import { TabBar, Badge, Space, Grid, List, Toast } from 'antd-mobile';
import { routerRedux } from 'dva/router';
import WxQRcode from '@/components/WxQRcode';

import './index.less';

const Item = List.Item;
const Brief = Item.Brief;

class About extends Component {
  constructor(props) {
    super(props);
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

  componentDidMount() {
    /** 分享 -- start */
    const initShare = new WxShare();
    initShare.reset();
    /** 分享 -- end */
  }

  render() {
    return (
      <div className="page">
        <div className="about-page">
          <div className="content">
            <p>
              翠苑三区生活服务
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default About;
