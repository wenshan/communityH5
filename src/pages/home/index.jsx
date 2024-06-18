import React, { Component } from 'react';
import { connect, Link, history } from 'umi';
import { Space, Swiper } from 'antd-mobile';
import { RightOutline} from 'antd-mobile-icons'
import ICP from '@/components/Icp';
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
    const { lastDayIntentionC, lastDayIntentionB} = this.props;
    /** 分享 -- start */
    const initShare = new WxShare();
    initShare.reset({
      friend_title: '翠苑三区(C区1-14/19-28幢)原拆原建业主意向征集和倡议书',
      friend_content: `今日上报：住房户号比例 ${((lastDayIntentionC.communityUserNum/951)*100).toFixed(2)} %，申请住房户数:${lastDayIntentionC.communityUserNum}，已申报成功用户: ${lastDayIntentionC.agreeUserNum},加油💪🏻`,
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
      type: 'home/lastDayIntentionA',
      payload: {
        areas: '翠苑三区',
        region: 'A',
      }
    });
    this.props.dispatch({
      type: 'home/lastDayIntentionB',
      payload: {
        areas: '翠苑三区',
        region: 'B',
      }
    });
    this.props.dispatch({
      type: 'home/lastDayIntentionC',
      payload: {
        areas: '翠苑三区',
        region: 'C',
      }
    });
    this.props.dispatch({
      type: 'home/lastDayIntentionE',
      payload: {
        areas: '翠苑三区',
        region: 'E',
      }
    });
  }
  // https://echarts.apache.org/zh/option.html#title
  render() {
    const { lastDayIntentionC, lastDayIntentionB, lastDayIntentionA, lastDayIntentionE} = this.props;
    return (
      <div className="page">
        <div className="home-page">
          <div className="swiper-wrap">
            <div className='banner-swiper'>
              <section className='swiper-container'>
                <Swiper loop autoplay autoplayInterval={5000}>
                  {this.swiperRender()}
                </Swiper>
              </section>
            </div>
          </div>
          <Space></Space>
          <div className='intention-view'>
            <div className="header">
              <Link to="/intention.html">
                <h2>翠苑三区(A区64-78幢)</h2>
              </Link>
            </div>
            <div className='content'>
              <div className='topic'>
                <div className='rate'>{((lastDayIntentionA.communityUserNum/869)*100).toFixed(2)} % <Link to="/intention.html"><span className='link'>点击去申报<RightOutline /></span></Link></div>
                <div className='des'><p>总户数: <span>869</span></p> <p>已申请住房户数: <span>{lastDayIntentionA.communityUserNum}</span></p><p> 已申报成功用户: <span>{lastDayIntentionA.agreeUserNum}</span></p></div>
              </div>
              <div className='chart'>
                <ChartColumn data={{value: lastDayIntentionA.value, days:lastDayIntentionA.days}}></ChartColumn>
              </div>
            </div>
            <div className='footer-box'>
              <span><Link to="/intentionList.html">查看数据明细<RightOutline /></Link></span>
            </div>
          </div>
          <Space></Space>
          <div className='intention-view'>
            <div className="header">
              <Link to="/intention.html">
                <h2>翠苑三区(B区42-61幢)</h2>
              </Link>
            </div>
            <div className='content'>
              <div className='topic'>
                <div className='rate'>{((lastDayIntentionB.communityUserNum/1014)*100).toFixed(2)} % <Link to="/intention.html"><span className='link'>点击去申报<RightOutline /></span></Link></div>
                <div className='des'><p>总户数: <span>1014</span></p> <p>已申请住房户数: <span>{lastDayIntentionB.communityUserNum}</span></p><p> 已申报成功用户: <span>{lastDayIntentionB.agreeUserNum}</span></p></div>
              </div>
              <div className='chart'>
                <ChartColumn data={{value: lastDayIntentionB.value, days:lastDayIntentionB.days}}></ChartColumn>
              </div>
            </div>
            <div className='footer-box'>
              <span><Link to="/intentionList.html">查看数据明细<RightOutline /></Link></span>
            </div>
          </div>
          <Space></Space>
          <div className='intention-view'>
            <div className="header">
              <Link to="/intention.html">
                <h2>翠苑三区(C区1-14/19-28幢)</h2>
              </Link>
            </div>
            <div className='content'>
              <div className='topic'>
                <div className='rate'>{((lastDayIntentionC.communityUserNum/951)*100).toFixed(2)} % <Link to="/intention.html"><span className='link'>点击去申报<RightOutline /></span></Link></div>
                <div className='des'><p>总户数: <span>951</span></p><p>已申请住房户数: <span>{lastDayIntentionC.communityUserNum}</span></p><p>已申报成功用户: <span>{lastDayIntentionC.agreeUserNum}</span></p></div>
              </div>
              <div className='chart'>
                <ChartColumn data={{value: lastDayIntentionC.value, days:lastDayIntentionC.days}}></ChartColumn>
              </div>
            </div>
            <div className='footer-box'>
              <span><Link to="/intentionList.html">查看数据明细<RightOutline /></Link></span>
            </div>
          </div>
          <Space></Space>
          <div className='intention-view'>
            <div className="header">
              <Link to="/intention.html">
                <h2>翠苑三区(E区38-41幢)</h2>
              </Link>
            </div>
            <div className='content'>
              <div className='topic'>
                <div className='rate'>{((lastDayIntentionE.communityUserNum/224)*100).toFixed(2)} % <Link to="/intention.html"><span className='link'>点击去申报<RightOutline /></span></Link></div>
                <div className='des'><p>总户数: <span>224</span></p><p>已申请住房户数: <span>{lastDayIntentionE.communityUserNum}</span></p><p>已申报成功用户: <span>{lastDayIntentionE.agreeUserNum}</span></p></div>
              </div>
              <div className='chart'>
                <ChartColumn data={{value: lastDayIntentionE.value, days:lastDayIntentionE.days}}></ChartColumn>
              </div>
            </div>
            <div className='footer-box'>
              <span><Link to="/intentionList.html">查看数据明细<RightOutline /></Link></span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  (state) => ({
    swiperBanner: state.home.swiperBanner,
    lastDayIntentionA: state.home.lastDayIntentionA,
    lastDayIntentionB: state.home.lastDayIntentionB,
    lastDayIntentionC: state.home.lastDayIntentionC,
    lastDayIntentionE: state.home.lastDayIntentionE,
  }),
)(Home);
