import React, { Component } from 'react';
import { connect } from 'umi';
import { TabBar, Badge, Space, Input, Button, Popup, Cascader, Toast, List } from 'antd-mobile';
import { List as VirtualizedList, AutoSizer } from 'react-virtualized'
import { CheckCircleOutline, CloseCircleOutline} from 'antd-mobile-icons'
import Signature from '../components/Signature';
import Footer from '@/components/Footer';
import cascaderOptionsFilter from '@/utils/roomDataFilter';

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
    if (value && value[0] && value[1] && value[2]) {
      const areas = value[0];
      const build = value[1];
      const unit = value[2];
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
        content: '请选择完整的房号',
      });
    }
  }
  rowRenderer = () => {
    const html = [];
    const { count, rows } = this.props.communityUserList;
    rows && rows.length && rows.map( (item,idx) => {
      html.push(
        <>
          <List.Item
          key={item.userid}
          prefix={<span>{item.areas}-{item.build}幢-{item.unit}单元-{item.room}室</span>}
          description={<span>已申请</span>}
          >
          时间: {item.createdAt}
          </List.Item>
        </>
      );
    });
    return html;
  }

  componentDidMount() {
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
            <h2>翠苑三区C区意愿申请列表</h2>
            <div className='filter'>
              <Button color='primary' fill='outline' size='small' onClick={this.handelCascaderStatus}>选择</Button>
              {areas && build && unit && (<span>{areas}-{build}幢-{unit}单元</span>)}
              <Cascader
                options={cascaderOptionsFilter}
                visible={isShowCascader}
                onClose={this.handelCascaderStatusClose}
                onConfirm={this.handelCascaderStatusOnConfirm}
              />
            </div>

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
