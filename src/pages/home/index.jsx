import React, { Component } from 'react';
import { connect, Link } from 'umi';
import { TabBar, Badge, Space, Grid } from 'antd-mobile';
import { RightOutline} from 'antd-mobile-icons'
import { routerRedux } from 'dva/router';
import BannerSwiper from './components/BannerSwiper';
import ChartColumn from './components/ChartColumn';
import WxShare from '@/utils/wxShare';


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
    /** 分享 -- start */
    const initShare = new WxShare();
    initShare.reset();
    /** 分享 -- end */
    this.props.dispatch({
      type: 'common/update',
      payload: {
        unionidModalStatus: false
      }
    });
    this.props.dispatch({
      type: 'common/getUserList',
      payload: { areas: '翠苑三区', build: null, unit: null }
    });
  }
  // https://echarts.apache.org/zh/option.html#title
  render() {
    const { communityUserCount  } = this.props
    return (
      <div className="page">
        <div className="home-page">
          <div className="swiper-wrap">
            <BannerSwiper history={history} swiperBanner={this.props.swiperBanner} callback={this.swpierClick}></BannerSwiper>
          </div>
          <Space></Space>
          <div className='warning-box'>
            <h1>此公众号H项目正在测试阶段，数据随时清理，功能完善中，5月10号（周日）后正式对外使用</h1>
          </div>
          <Space></Space>
          <div className='intention-view'>
            <div className="header">
              <Link to="/intention.html">
                <h2>翠苑三区C区原建原拆意向数据</h2>
                <span className='link'>点击去申请<RightOutline /></span>
              </Link>
            </div>
            <div className='content'>
              <div className='topic'>
                <div className='rate'>{(communityUserCount/951).toFixed(4)*100} %</div>
                <div className='des'>共计: 951户 当前申请: {communityUserCount}户</div>
              </div>
              <div className='chart'>
                <ChartColumn></ChartColumn>
              </div>
            </div>
            <div className='footer-box'>
              <span><Link to="/intentionList.html">查看数据明细<RightOutline /></Link></span>
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
    communityUserCount: state.common.communityUserCount,
  }),
)(Home);
