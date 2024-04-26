import React, { Component } from 'react';
import { connect } from 'dva';
import { Toast, Button, Space, InputItem, Picker, Modal, Icon } from 'antd-mobile';
import moment from 'moment';
import PropTypes from 'prop-types';
import appFunction from '@/utils/appFunction';
import { Tool } from '@/utils/index';
import WxShare from '@/utils/wxShare';
import wxRes from '@/utils/wxRequest';
import './index.less';

class ShareBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      makebox: false
    };
  }
  setupWebViewJavascriptBridge = (callback) => {
    if (window.WebViewJavascriptBridge) {
      return callback(window.WebViewJavascriptBridge);
    }
    if (window.WVJBCallbacks) {
      return window.WVJBCallbacks.push(callback);
    }
    window.WVJBCallbacks = [ callback ];
    let WVJBIframe = document.createElement('iframe');
    WVJBIframe.style.display = 'none';
    WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__';
    document.documentElement.appendChild(WVJBIframe);
    setTimeout(function() {
      document.documentElement.removeChild(WVJBIframe);
    }, 0);
  };

  share = ({ type }) => {
    let self = this;
    let shareData = Object.assign({}, this.props.shareData || {}, { type });

    if (this.props.platform == 'app') {
      setTimeout(() => {
        if (Tool.webViewType() == 'android') {
          if (window.Android && window.Android.getJavascriptData) {
            window.Android.getJavascriptData(JSON.stringify(shareData));
            self.onClose();
          }
        } else {
          this.setupWebViewJavascriptBridge(() => {
            window.WebViewJavascriptBridge.callHandler(
              'callAppFunction',
              {
                type: 'share',
                params: {
                  client: 'weixin',
                  params: {
                    type: shareData.type,
                    params: shareData
                  }
                }
              },
              function responseCallback(responseData) {
                console.log(responseData);
                self.onClose();
              }
            );
          });

          self.onClose();
        }
      }, 500);
    } else if (Tool.isWeiXin() && shareData && shareData.link) {
      wxRes.getWxConfig().then((res) => {
        let params = {
          page_url: shareData.link,
          friend_title: shareData.title,
          friend_content: shareData.desc,
          img_url: shareData.imgUrl
        };
        let resData = res.data;
        WxShare.init(resData, params);
        this.setState({
          makebox: true
        });
      });
    } else {
      this.setState({
        makebox: true
      });
    }
  };

  onClose = () => {
    this.setState(
      {
        makebox: false
      },
      () => {
        this.props.onClose();
      }
    );
  };

  closebox = () => {
    this.setState(
      {
        makebox: false
      },
      () => {
        this.props.onClose();
      }
    );
  };

  afterClose = () => {
    console.log('分享成功');
  };

  componentDidMount() {
    let shareData = this.props.shareData;
    document.title = shareData.title || '女神派';

    setTimeout((shareData) => {
      if (Tool.isWeiXin() && shareData && shareData.link) {
        wxRes.getWxConfig().then((res) => {
          let params = {
            page_url: shareData.link,
            friend_title: shareData.title,
            friend_content: shareData.desc,
            img_url: shareData.imgUrl
          };
          let resData = res.data;
          WxShare.init(resData, params);
        });
      }
    }, 500);
  }

  render() {
    const shareBoxShow = this.props.visible ? 'share-box' : 'share-box-hie';
    const makeboxWx = this.state.makebox ? 'make-box-wx' : 'make-box-hie';

    return (
      <div className={shareBoxShow} id='share-box'>
        <div className={makeboxWx} onClick={this.closebox} />
        <div className='make-shadow' onClick={this.closebox} />
        <div className='shadow' />
        <div className='list'>
          <ul>
            <li>
              <div className='haoyou' onClick={() => this.share({ type: 'app_message' })}>
                好友
              </div>
            </li>
            <li>
              <div className='pengyouquan' onClick={() => this.share({ type: 'timeline' })}>
                朋友圈
              </div>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

ShareBox.defaultProps = {
  shareData: {
    type: 'app_message', // timeline 朋友圈 app_message 分享好友
    title: '2018最佳女神派对年度盘点', // 分享标题
    desc: '成为女神派会员，网红展、美酒趴、最时尚课程等超大福利，等你来拿！',
    link: 'http://activity.msparis.com/meeting.html',
    imgUrl: 'https://static-rs.msparis.com/meeting_01.jpg',
    group_type: 1 // 安卓专用 邀请还有分享
  },
  platform: 'wap',
  visible: false
};

ShareBox.propTypes = {
  shareData: PropTypes.object,
  platform: PropTypes.string,
  visible: PropTypes.bool
};

export default ShareBox;
