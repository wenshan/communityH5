import React, { Component } from 'react';
import { connect, Link } from 'umi';
import { TabBar, Badge, Space, Grid } from 'antd-mobile';
import { RightOutline} from 'antd-mobile-icons'
import { router } from 'dva';
const { routerRedux } = router;
import BannerSwiper from './components/BannerSwiper';
import ChartColumn from './components/ChartColumn';
import WxShare from '@/utils/wxShare';
import Cookies  from 'cookie_js';
import moment from 'moment';


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
    // Cookies.expiresMultiplier = 60 * 60 * 2;
    Cookies.set({'name': 123123},{
      path: '/',
      secure: false,
      expires: moment().second(10)
    })
    // console.log('CookiesJs:', cookies );
    const { value, days, agreeUserNum, unwillingUserNum, communityUserNum} = this.props.lastDayIntention;
    /** 分享 -- start */
    const initShare = new WxShare();
    initShare.reset({
      friend_title: '翠苑三区( C区1-14/19-28幢)原拆原建业主意向征集和倡议书',
      friend_content: `今日上报：住房户号比例 ${((communityUserNum/951)*100).toFixed(2)} %，申请住房户数:${communityUserNum}，已申报成功用户: ${agreeUserNum},加油💪🏻`,
      img_url: 'https://img.dreamstep.top/community/banner/banner_intention.png',
      page_url: 'https://www.dreamstep.top/intention.html'
    });
    /** 分享 -- end */
    this.props.dispatch({
      type: 'common/update',
      payload: {
        unionidModalStatus: false
      }
    });
    this.props.dispatch({
      type: 'home/lastDayIntention',
    });
  }
  // https://echarts.apache.org/zh/option.html#title
  render() {
    const { value, days, agreeUserNum, unwillingUserNum, communityUserNum} = this.props.lastDayIntention;
    return (
      <div className="page">
        <div className="home-page">
          <div className="swiper-wrap">
            <BannerSwiper history={history} swiperBanner={this.props.swiperBanner} callback={this.swpierClick}></BannerSwiper>
          </div>
          <Space></Space>
          {/**
          <div className='warning-box'>
            <h1>此公众号项目正在测试阶段，数据随时清理，功能完善中，5月15号（周三）后正式对外使用</h1>
          </div>
          */}
          <Space></Space>
          <div className='intention-view'>
            <div className="header">
              <Link to="/intention.html">
                <h2>翠苑三区C区原拆原建意向数据</h2>
                <span className='link'>点击去申请<RightOutline /></span>
              </Link>
            </div>
            <div className='content'>
              <div className='topic'>
                <div className='rate'>{((communityUserNum/951)*100).toFixed(2)} %</div>
                <div className='des'>总户数: <span>951</span> 已申请住房户数: <span>{communityUserNum}</span> 已申报成功用户: <span>{agreeUserNum}</span></div>
              </div>
              <div className='chart'>
                <ChartColumn data={{value, days}}></ChartColumn>
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
    swiperBanner: state.home.swiperBanner,
    lastDayIntention: state.home.lastDayIntention,
  }),
)(Home);
