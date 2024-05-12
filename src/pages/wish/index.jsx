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
    Dialog.confirm({
      content: '确认删除',
      title: '确认',
      cancelText: '取消',
      confirmText: '确认',
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
    const { name, mobile } = this.props.userinfo;
    const { areas, build, unit, room, is_submitConfirmation, id, contractPath, createdAt, owner, feedback, is_submitContractUnwilling} = this.props.communityUser;
    return (
      <div className="page">
        <div className="wish-list">
          <div className='header'>
            <h2>我申请的意愿</h2>
          </div>
          <div className='content'>

            <div className='info'>
            {is_submitConfirmation || is_submitContractUnwilling ? (<>
              <h3>翠苑三区C区原拆原建意愿申请</h3>
              <div className='status box'>申请状态: <span>{is_submitConfirmation?'同意原拆原建意愿的申请':'不同意原拆原建意愿申请'}</span></div>
              <div className='room box'>房号: <span>{areas}-{build}幢-{unit}单元-{room}室</span></div>
              <div className='owner box'>是否拥有产权: <span>{owner? '是': '否/未知'}</span></div>
              <div className='certification box'>实名: <span></span>{name}</div>
              <div className='mobile box'>联系手机: <span>{mobile}</span></div>
              {is_submitConfirmation?(<div className='signature box'>电子签: <span>审核中...  </span></div>):''}
              <div className='feedback box'>建议&妙想: <span>{feedback? (<p>{feedback}</p>) : '无' }</span></div>
              {is_submitConfirmation?(<div className='pdf box'>意愿申请文件: <span>{contractPath ? (<a href={contractPath} target='_blank'>点击查看</a>): '生成申请PDF文件失败，请删除重试'}</span></div>):''}
              <div className='date box'>日期: <span>{createdAt}</span></div>
              <div className='footer-box'>
                <span onClick={()=>{this.delUser(id)}}>删除重新意愿申请</span>
              </div>
              </>) : (<span className='no-data'>无数据</span>)}
            </div>
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
