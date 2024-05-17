import React, { Component } from 'react';
import { connect } from 'umi';
import { Empty, Button, Cascader, Toast } from 'antd-mobile';
import cascaderOptionsFilter from '@/utils/roomDataFilter';
import WxShare from '@/utils/wxShare';

import 'rmc-dialog/assets/index.css';
import './index.less';

class intentionList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowCascader: false,
      cascaderOptionsFilter,
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
      const build = value[1] || null;
      const unit = value[2] || null;
      const newCommunityUserFilter = Object.assign({}, communityUserFilter, { areas, build, unit});
      this.props.dispatch({
        type: 'common/update',
        payload: { communityUserFilter: newCommunityUserFilter }
      });
      this.props.dispatch({
        type: 'common/getUserList',
        payload: { areas, build, unit }
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
        const { areas, build, unit, room, is_submitConfirmation, owner, propertyType, feedback, is_submitContractUnwilling} = item;
        if (areas && build && unit && room ) {
          let label = (<span className='tx-cfa541c'><i class="iconfont icon-cry"></i>未申报</span>);
          if (is_submitConfirmation && !is_submitContractUnwilling) {
            label = (<span className='tx-c7cb305'><i class="iconfont icon-good"></i>意愿已申报</span>);
          }
          if (!is_submitConfirmation && is_submitContractUnwilling) {
            // label = '不同意意愿已提交';
            label = (<span className='tx-cfa541c'><i class="iconfont icon-bad"></i>未申报</span>);
          }
          if (!is_submitConfirmation && !is_submitContractUnwilling) {
            label = (<span className='tx-cfa541c'><i class="iconfont icon-cry"></i>未申报</span>);
          }
          const nameLabel = item.name ? `${item.name.substring(0,1)}${item.name.length > 2? '** ':'* '}` : '***'
          html.push(
            <li key={`${item.userid}_${item.roomid}`}>
              <div className='title'>{item.areas}-{item.build}幢-{item.unit}单元-{item.room}室 <span className='status'>{label}</span></div>
              <div className='main'>
                <p><span className='label' key="ren">上报人:</span>{nameLabel}</p>
                <p><span className='label' key="time">时间:</span>{item.createdAt}</p>
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
      payload: { areas: '翠苑三区C区', build: null, unit: null }
    });
  }

  render() {
    const { cascaderOptionsFilter, isShowCascader } = this.state;
    const { count } = this.props.communityUserList;
    const { areas, build, unit } = this.props.communityUserFilter;
    return (
      <div className="page">
        <div className="intention-list">
          <div className='header'>
            <h2>意愿申报查询列表</h2>
            <div className='filter'>
              <Button color='primary' fill='outline' size='small' onClick={this.handelCascaderStatus}>筛选</Button>
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
  }),
)(intentionList);
