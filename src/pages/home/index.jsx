import React, { Component } from 'react';
import { connect, Link, history } from 'umi';
import { Space, Swiper } from 'antd-mobile';
import { RightOutline} from 'antd-mobile-icons'
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

  swpierClick = (item) => {
    if (item && item.value){
      this.props.dispatch({
        type: 'home/update',
        payload: { currentBanner: item }
      });
      history.push(item.value);
    }
  }

  gotoPage = (val) => {
    if (val){
      history.push(val);
    }
  }
  handleClickWeixinOauth2 = () => {
    // 授权登录
    this.props.dispatch({
      type: 'common/getWeixinOauth2',
      payload: { isOperateType: false }
    });
  }
  // 走马灯
  swiperRender =() => {
    const html = [];
    const { swiperBanner } = this.props;
    console.log('swiperBanner:', swiperBanner);
    if (swiperBanner && swiperBanner.length) {
      swiperBanner.map((item,idx) => {
        if (item.value && item.id) {
          html.push(
            <Swiper.Item key={`${idx}-${item.id}`} onClick={()=>{this.swpierClick(item)}}>
              <div className='swiper-slide' key={item.id}>
                <img src={item.src} />
              </div>
            </Swiper.Item>
          );
        }
      });
    }
    return html;
  }
  componentDidMount() {
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
            <div className='banner-swiper'>
              <section className='swiper-container'>
                <Swiper loop autoplay>
                  {this.swiperRender()}
                </Swiper>
              </section>
            </div>
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
