import React, { Component } from 'react';
import { connect } from 'umi';
import { TabBar, Badge, Space, Input, Button, Popup, Cascader, Toast, List, Dialog } from 'antd-mobile';
import { List as VirtualizedList, AutoSizer } from 'react-virtualized'
import { CheckCircleOutline, CloseCircleOutline} from 'antd-mobile-icons'

import './index.less';

class WishList extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  delUser=(id)=>{
    const _self = this;
    Dialog.alert({
      content: '确认删除',
      onConfirm: () => {
        _self.props.dispatch({
          type: 'common/delUser',
          payload: { id }
        });
      },
    })
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'common/getCommunityUserInfo',
    });
  }

  render() {
    const { name } = this.props.userinfo;
    const { areas, build, unit, room, signatureFile, id, contractPath} = this.props.communityUser;
    return (
      <div className="page">
        <div className="wish-list">
          <div className='header'>
            <h2>我申请的意愿</h2>
          </div>
          <div className='content'>
            <div className='info'>
              <h3>翠苑三区C区原拆原建意愿申请</h3>
              <div className='room'>房号: <span>{areas}-{build}幢-{unit}单元-{room}室</span></div>
              <div className='certification'>实名: {name}</div>
              <div className='signature'>电子签: 已认证 </div>
              <div className='pdf'>意愿申请文件: <a href={contractPath} target='_blank'>点击查看</a></div>
            </div>
          </div>
          <div className='footer-box'>
            <span onClick={()=>{this.delUser(id)}}>删除重新申请意愿</span>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  (state) => ({
    communityUser: state.common.communityUser,
    userinfo:  state.common.userinfo,
  }),
)(WishList);
