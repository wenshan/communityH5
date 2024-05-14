import React, { Component } from 'react';
import { connect } from 'umi';
import { TabBar, Badge, Space, Empty, Button, Popup, Cascader, Toast, List } from 'antd-mobile';
import { List as VirtualizedList, AutoSizer } from 'react-virtualized'
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
          let label = '未申报';
          if (is_submitConfirmation && !is_submitContractUnwilling) {
            label = '意愿已申报';
          }
          if (!is_submitConfirmation && is_submitContractUnwilling) {
            label = '不同意意愿已提交';
          }
          if (!is_submitConfirmation && !is_submitContractUnwilling) {
            label = '未申报';
          }
          const nameLabel = item.name ? `${item.name.substring(0,1)}${item.name.length > 2? '** ':'* '}` : '***'
          html.push(
            <>
              <List.Item
              key={item.userid}
              prefix={<span>{item.areas}-{item.build}幢-{item.unit}单元-{item.room}室</span>}
              description={<span>{nameLabel} {label}</span>}
              >
              时间: {item.createdAt}
              </List.Item>
            </>
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
      payload: { areas: '翠苑三区', build: null, unit: null }
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
            <List>
              <AutoSizer disableHeight>
                {({ width }) => (
                  <VirtualizedList
                    rowCount={count}
                    rowRenderer={this.rowRenderer}
                    width={width}
                    height={480}
                    rowHeight={60}
                    overscanRowCount={10}
                  />
                )}
              </AutoSizer>
            </List>
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
