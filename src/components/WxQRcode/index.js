import React from 'react';
import { Modal } from 'antd-mobile';
import { connect } from 'dva';
import './index.less';

function closest(el, selector) {
  const matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;
  while (el) {
    if (matchesSelector.call(el, selector)) {
      return el;
    }
    el = el.parentElement;
  }
  return null;
}

class WxQRcode extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onClose = () => {
    if (this.props.submit) {
      this.props.submit();
    }
    this.props.dispatch({
      type: 'common/update',
      payload: {
        unionidModalStatus: false
      }
    });
  };
  handAfterClose = () => {
    const userinfo = this.props.userinfo;
    if (userinfo.openid) {
      if (!userinfo.unionid) {
        this.props.dispatch({
          type: 'common/getUserUnionID'
        });
      }
    }
  };

  onWrapTouchStart = (e) => {
    // fix touch to scroll background page on iOS
    if (!/iPhone|iPod|iPad/i.test(navigator.userAgent)) {
      return;
    }
    const pNode = closest(e.target, '.am-modal-content');
    if (!pNode) {
      e.preventDefault();
    }
  };
  handSubmit = () => {
    const userinfo = this.props.userinfo;
    // 关注后 拉取用户信息
    if (userinfo.openid) {
      if (!userinfo.unionid) {
        setTimeout(() => {
          this.props.dispatch({
            type: 'common/getUserUnionID'
          });
        }, 5000);
      }
    }

    if (this.props.submit) {
      this.props.submit();
    }
  };
  componentDidMount() {}

  render() {
    const { unionidModalStatus, userinfo } = this.props;
    const { access_token, openid } = userinfo;
    const isShowStatus = access_token && openid ? unionidModalStatus : false;
    return (
      <div className='wx-qrcode'>
        <Modal
          visible={isShowStatus}
          transparent
          maskClosable={true}
          onClose={this.onClose}
          title='扫码关注公众号'
          footer={[
            {
              text: 'Ok',
              onPress: () => {
                this.onClose();
              }
            }
          ]}
          wrapProps={{ onTouchStart: this.onWrapTouchStart }}
          afterClose={this.handAfterClose}
        >
          <div className='modal-content'>
            <div className='img-box'>
              <img
                src='https://affiliate-traffic.oss-cn-hongkong.aliyuncs.com/community/qrcode_for_gh_41d638333ec8_430.jpg'
                onClick={this.handSubmit}
              />
            </div>
            <div className='info'>
              <p>1. 长安图片扫码，关注《西子翠苑》公众号</p>
              <p>2. 关注公众号才能订阅翠苑相关信息</p>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userinfo: state.common.userinfo,
    unionidModalStatus: state.common.unionidModalStatus
  };
};
const mapDispatchToProps = (dispatch) => ({
  dispatch
});

export default connect(mapStateToProps, mapDispatchToProps)(WxQRcode);
