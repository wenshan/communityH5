import React, { Component } from 'react';
import { connect } from 'umi';
import { TabBar, Badge, Space, Grid, List, Toast } from 'antd-mobile';
import { router } from 'dva';
import WxShare from '@/utils/wxShare';

import './index.less';

class PublicPlatform extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handSubmit = () => {
    const userinfo = this.props.userinfo;
    // 关注后 拉取用户信息
    if (userinfo.openid) {
      if (!userinfo.unionid) {
        setTimeout(() => {
          this.props.dispatch({
            type: 'common/getUserInfo'
          });
        }, 3000);
      }
    }

    if (this.props.submit) {
      this.props.submit();
    }
  };

  componentDidMount() {
    const { currentBanner } = this.props;
    /** 分享 -- start */
    const initShare = new WxShare();
    initShare.reset({
      friend_title: currentBanner.name,
      friend_content: currentBanner.describe || currentBanner.name,
      img_url: currentBanner.src,
      page_url: 'https://www.dreamstep.top/publicPlatform.html'
    });
    /** 分享 -- end */
  }

  render() {
    const { currentBanner } = this.props;
    if (!currentBanner || currentBanner.name) {
      return;
    }
    return (
      <div className="page">
        <div className="public-platform-page">
          <div className="content">
            <div className='banner'>
              <img src={currentBanner.src} />
            </div>
            <div class="clearfix">
              <div className='title'>{currentBanner.name}</div>
                <div className='text'>
                  {currentBanner.describe}
                </div>
                <div className='qrcode'>
                  <p>查看详情，请关注公众号，查看【文章资讯】</p>
                  <div className='img-box'>
                    <img src='https://img.dreamstep.top/community/qrcode_for_gh_41d638333ec8_430.jpg' onClick={this.handSubmit} />
                  </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  (state) => ({
    currentBanner: state.home.currentBanner,
  }),
)(PublicPlatform);
