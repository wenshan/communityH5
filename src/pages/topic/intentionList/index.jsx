import React, { Component } from 'react';
import { connect } from 'umi';
import { Empty, Button, Cascader, Toast } from 'antd-mobile';
import cascaderOptionsFilter from '@/utils/roomDataFilter';
import ICP from '@/components/Icp';
import WxShare from '@/utils/wxShare';

import 'rmc-dialog/assets/index.css';
import './index.less';

class intentionList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowCascader: false,
      cascaderOptionsFilter,
      region: 'C'
    };
  }

  handelCascaderStatusClose= ()=>{
    this.setState({
      isShowCascader: false
    });
  }
  handelCascaderStatus = () => {
    this.setState({
      isShowCascader: true
    });
  }
  handelCascaderStatusOnConfirm=(value)=>{
    const { communityUserFilter } = this.props;
    if (value && value[0]) {
      const areas = value[0];
      const region = null;
      const build = value[1] || null;
      const unit = value[2] || null;
      const newCommunityUserFilter = Object.assign({}, communityUserFilter, { areas, region, build, unit});
      this.props.dispatch({
        type: 'common/update',
        payload: { communityUserFilter: newCommunityUserFilter }
      });
      this.props.dispatch({
        type: 'common/getUserList',
        payload: { areas, region, build, unit }
      });
    } else {
      Toast.show({
        icon: 'fail',
        content: '请选择区域',
      });
    }
  }
  rowRenderer = () => {
    const html = [];
    const { rows } = this.props.communityUserList;
    if (rows && rows.length) {
      rows.map( (item, idx) => {
        const { areas, build, unit, room, submitConfirmation, owner, propertyType, feedback, is_submitContractUnwilling} = item;
        if (areas && build && unit && room ) {
          let label = (<span className='tx-cfa541c'><i className="iconfont icon-cry">&#xe839;</i>未申报</span>);
          if (submitConfirmation > 0) {
            if (submitConfirmation === 2) {
              label = (<span className='tx-c7cb305'><i className="iconfont icon-good">&#xe83c;</i>意愿已申报</span>);
            } else {
              label = (<span className='tx-cfa541c'><i className="iconfont icon-bad">&#xe838;</i>未申报</span>);
            }
          } else {
            label = (<span className='tx-cfa541c'><i className="iconfont icon-cry">&#xe839;</i>未申报</span>);
          }

          const nameLabel = item.name ? `${item.name.substring(0,1)}${item.name.length > 2? '** ':'* '}` : '***'
          html.push(
            <li key={`${item.userid}_${item.roomid}`}>
              <div className='title'>{item.areas}-{item.build}幢-{item.unit}单元-{item.room}室 <span className='status'>{label}</span></div>
                <div className='main'>
                  <div className='item'><span className='label' key="ren">用户ID:</span><span className='value'>{item.userid}</span></div>
                  <div className='item'><span className='label' key="ren">姓名:</span><span className='value'>{nameLabel}</span></div>
                </div>
                <div className='main'>
                  <div className='item' style={{width: '80%'}}><span className='label' key="time">时间:</span><span className='value'>{item.createdAt}</span></div>
                </div>

            </li>
          );
        }
      });
    } else {
      html.push(<span className='no-data'><Empty></Empty></span>);
    }
    return html;
  }

  componentDidMount() {
    /** 分享 -- start */
    const initShare = new WxShare();
    initShare.reset();
    /** 分享 -- end */
    this.props.dispatch({
      type: 'common/getUserList',
      payload: { areas: '翠苑三区', region: this.state.region, build: null, unit: null }
    });
  }

  render() {
    const { cascaderOptionsFilter, isShowCascader } = this.state;
    const { count } = this.props.communityUserList;
    const { areas, build, unit } = this.props.communityUserFilter;
    const  { intentionListGetUserListLoading } = this.props;
    return (
      <div className="page">
        <div className="intention-list">
          <div className='header'>
            <h2>意愿申报查询列表</h2>
            <div className='filter'>
              <Button loading={intentionListGetUserListLoading} color='primary' fill='outline' size='small' onClick={this.handelCascaderStatus}>筛选</Button>
              {areas && (<span className='tx'>
                {areas}
                {areas && build?(<>-{build}幢</>): ''}
                {areas && build && unit? (<>-{unit}单元</>): ''}
                </span>)}
              <Cascader
                options={cascaderOptionsFilter}
                visible={isShowCascader}
                onClose={this.handelCascaderStatusClose}
                onConfirm={this.handelCascaderStatusOnConfirm}
              />
            </div>
            <div className='des'><p><span className='title'>注意：</span>如果您的房号已经被提交申请或是房号已经被占用，请私信公众号，注明原由，会第一时间跟进。</p></div>

          </div>
          <div className='content'>
            <div className='count'> 查询数据 <span>{count}</span> 条</div>
            <div className='list'>
              <ul>
                {this.rowRenderer()}
              </ul>
            </div>
          </div>
          <div className='footer'></div>
        </div>
      </div>
    );
  }
}

export default connect(
  (state) => ({
    communityUserFilter: state.common.communityUserFilter,
    communityUserList:  state.common.communityUserList,
    intentionListGetUserListLoading: state.common.intentionListGetUserListLoading,
  }),
)(intentionList);
