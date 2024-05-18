import React, { Component } from 'react';
import { connect } from 'umi';
import { Empty, Dialog, Modal } from 'antd-mobile';

import './index.less';

class WishList extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  delUser=({id, is_checkSignature})=>{
    const _self = this;
    if (is_checkSignature) {
      Modal.alert({
        title: '当前的意愿已审核',
        content: '审核后意愿不能删除，如果想删除重新申报意愿，请先联系群主退回审核，才能操作删除。',
        showCloseButton: true,
      })
    } else {
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
  }

  renderHtml =() => {
    const html = [];
    const { communityUser, userinfo} =this.props;
    const { name, mobile } = userinfo;
    if (communityUser && communityUser.length) {
      communityUser.map((item, idx)=>{
        const { areas, build, unit, room, is_submitConfirmation, id, contractPath, createdAt, owner, feedback, is_submitContractUnwilling, propertyType, is_checkSignature } = item;
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
        if (areas && build && unit && room) {
          html.push(
            <>
              <div className='info'>
                <>
                  <h3>翠苑三区C区原拆原建意愿申请</h3>
                  <div className='status box'><label>申请状态:</label><span>{label}</span></div>
                  <div className='room box'><label>房号:</label><span>{areas}-{build}幢-{unit}单元-{room}室</span></div>
                  <div className='room box'><label>产权类型:</label><span>{propertyType > 1? '企业房': '个人房'}</span></div>
                  <div className='owner box'><label>是否拥有产权:</label><span>{owner? '是': '否/未知'}</span></div>
                  <div className='certification box'><label>姓名:</label><span>{name}</span></div>
                  <div className='mobile box'><label>联系手机:</label><span>{mobile}</span></div>
                  {is_submitConfirmation?(<div className='signature box'><label>电子签:</label><span>{is_checkSignature? '已审核 ': '审核中...'} </span></div>):''}
                  <div className='feedback box'><label>宝贵的建议:</label><span>{feedback? (<p>{feedback}</p>) : '无' }</span></div>
                  {is_submitConfirmation?(<div className='pdf box'><label>意愿申请文件:</label><span>{contractPath ? (<a href={contractPath} target='_blank'>点击查看</a>): '生成申请PDF文件失败，请删除重试'}</span></div>):''}
                  <div className='date box'><label>日期:</label><span>{createdAt}</span></div>
                  <div className='footer-box'>
                    <span className={`${is_checkSignature ? 'checked': 'default'}`}onClick={()=>{this.delUser({id, is_checkSignature})}}>删除重新意愿申请</span>
                  </div>
                </>
              </div>
            </>
          );
        } else {
          html[0] = (<span className='no-data'><Empty></Empty></span>);
        }
      });
    } else {
      html.push(<span className='no-data'><Empty></Empty></span>);
    }

    return html;
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'common/getUserInfo',
    });
    this.props.dispatch({
      type: 'common/getCommunityUserInfo',
    });
  }

  render() {
    const { name, mobile } = this.props.userinfo;
    const { areas, build, unit, room, is_submitConfirmation, id, contractPath, createdAt, owner, feedback, is_submitContractUnwilling, propertyType} = this.props.communityUser;
    return (
      <div className="page">
        <div className="wish-list">
          <div className='header'>
            <h2>我申请的意愿</h2>
          </div>
          <div className='content'>
            {this.renderHtml()}
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
