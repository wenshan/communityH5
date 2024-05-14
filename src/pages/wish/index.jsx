import React, { Component } from 'react';
import { connect } from 'umi';
import { Empty, Dialog } from 'antd-mobile';
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

  renderHtml =() => {
    const html = [];
    const { communityUser, userinfo} =this.props;
    const { name, mobile } = userinfo;
    if (communityUser && communityUser.length) {
      communityUser.map((item, idx)=>{
        const { areas, build, unit, room, is_submitConfirmation, id, contractPath, createdAt, owner, feedback, is_submitContractUnwilling, propertyType } = item;
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
                  <div className='status box'>申请状态: <span>{label}</span></div>
                  <div className='room box'>房号: <span>{areas}-{build}幢-{unit}单元-{room}室</span></div>
                  <div className='room box'>产权类型: <span>{propertyType > 1? '企业房': '个人房'}</span></div>
                  <div className='owner box'>是否拥有产权: <span>{owner? '是': '否/未知'}</span></div>
                  <div className='certification box'>姓名: <span>{name}</span></div>
                  <div className='mobile box'>联系手机: <span>{mobile}</span></div>
                  {is_submitConfirmation?(<div className='signature box'>电子签: <span>审核中...  </span></div>):''}
                  <div className='feedback box'>宝贵的建议: <span>{feedback? (<p>{feedback}</p>) : '无' }</span></div>
                  {is_submitConfirmation?(<div className='pdf box'>意愿申请文件: <span>{contractPath ? (<a href={contractPath} target='_blank'>点击查看</a>): '生成申请PDF文件失败，请删除重试'}</span></div>):''}
                  <div className='date box'>日期: <span>{createdAt}</span></div>
                  <div className='footer-box'>
                    <span onClick={()=>{this.delUser(id)}}>删除重新意愿申请</span>
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
