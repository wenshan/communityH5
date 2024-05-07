import React, { Component } from 'react';
import { connect } from 'umi';
import { TabBar, Badge, Space, Grid } from 'antd-mobile';
import { routerRedux } from 'dva/router';
import BannerSwiper from './components/BannerSwiper';

import './index.less';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeKey: 'home',
    };
  }

  swpierClick = (val) => {
    if (val){
      this.props.dispatch(routerRedux.push(val));
    }
  }

  gotoPage = (val) => {
    if (val){
      this.props.dispatch(routerRedux.push(val));
    }
  }
  handleClickWeixinOauth2 = () => {
    // 授权登录
    this.props.dispatch({
      type: 'common/getWeixinOauth2',
      payload: { isOperateType: false }
    });
  }
  componentDidMount() {
    this.props.dispatch({
      type: 'common/update',
      payload: {
        unionidModalStatus: false
      }
    });
  }

  render() {
    return (
      <div className="page">
        <div className="home-page">
          <div className="swiper-wrap">
            <BannerSwiper history={history} swiperBanner={this.props.swiperBanner} callback={this.swpierClick}></BannerSwiper>
          </div>
          <Space></Space>
          <Space></Space>
          <Space></Space>
        </div>
      </div>
    );
  }
}

export default connect(
  (state) => ({
    home: state.home,
    swiperBanner: state.home.swiperBanner,
  }),
)(Home);
