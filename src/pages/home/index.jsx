import React, { Component } from 'react';
import { connect, Link } from 'umi';
import { TabBar, Badge, Space, Grid } from 'antd-mobile';
import { routerRedux } from 'dva/router';
import BannerSwiper from './components/BannerSwiper';
import ChartColumn from './components/ChartColumn';


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
  // https://echarts.apache.org/zh/option.html#title
  render() {
    return (
      <div className="page">
        <div className="home-page">
          <div className="swiper-wrap">
            <BannerSwiper history={history} swiperBanner={this.props.swiperBanner} callback={this.swpierClick}></BannerSwiper>
          </div>
          <Space></Space>
          <div className='intention-view'>
            <div className="header">
              <h2>翠苑三区C区原建原拆意向数据</h2>
            </div>
            <div className='content'>
              <div className='topic'>
                <div className='rate'>{(90/951).toFixed(4)*100} %</div>
                <div className='des'>共计: 951户 当前申请: 90户</div>
              </div>
              <div className='chart'>
                <ChartColumn></ChartColumn>
              </div>
            </div>
            <div className='footer-box'>
              <span><Link to="/intentionList.html">查看数据明细</Link></span>
            </div>
          </div>
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
