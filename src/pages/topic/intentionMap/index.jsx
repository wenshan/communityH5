import React, { Component } from 'react';
import { connect } from 'umi';
import { TabBar, Badge, Space, Grid, List, Toast } from 'antd-mobile';
import { routerRedux } from 'dva/router';
import WxShare from '@/utils/wxShare';

import './index.less';

const Item = List.Item;
const Brief = Item.Brief;

class IntentionData extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  gotoPage = (val) => {
    if (val){
      this.props.dispatch(routerRedux.push(val));
    }
  }

  componentDidMount() {
    /** 分享 -- start */
    const initShare = new WxShare({
      friend_title: '翠苑三区原拆原建项目各区群落汇总',
      friend_content: '翠苑三区伙伴们，找不到具体组织，可以来这里，这里汇总翠苑三区A区、B区、C区、D区、E区、F区核心志愿者群主，后续信息都会通过各区群和公众号的方式同步给大家。',
      img_url: 'https://img.dreamstep.top/community/img/qun_2048.png',
      page_url: 'https://www.dreamstep.top/intentionMap.html'
    });
    initShare.reset();
    /** 分享 -- end */
  }

  render() {
    return (
      <div className="page">
        <div className="map-page">
          <div class="topic-map">
            <div className='title'>翠苑三区原拆原建项目各区群落汇总</div>
            <div className='content'>
              <img src='https://img.dreamstep.top/community/img/qun_2048.png' />
            </div>
          </div>
        </div>

      </div>
    );
  }
}

export default IntentionData;
