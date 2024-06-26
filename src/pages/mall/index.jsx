import React, { Component } from 'react';
import { connect } from 'umi';
import { TabBar, Badge, Space, Grid, List, Toast } from 'antd-mobile';
import { router } from 'dva';
const { routerRedux } = router;
import WxQRcode from '@/components/WxQRcode';
import WxShare from '@/utils/wxShare';

import './index.less';

const Item = List.Item;
const Brief = Item.Brief;

class Mall extends Component {
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

  }

  render() {
    return (
      <div className="page">
        <div className="mall-page">
          <div className="content">
            <h1>
              翠苑三区生活服务-易物（闲置物品以物换物）功能正在建设中...
            </h1>
          </div>
        </div>
      </div>
    );
  }
}

export default Mall;
