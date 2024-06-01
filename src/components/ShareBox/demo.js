import React, { Component } from 'react';
import { Toast, Button, Space, InputItem, Picker, Modal, Icon } from 'antd-mobile';
import ShareBox from './index';

class Demo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false
    };
  }

  share = () => {
    this.setState({
      visible: true
    });
  };

  shareClose = () => {
    this.setState({
      visible: false
    });
  };

  render() {
    let data = {
      type: 'app_message', // timeline 朋友圈 app_message 分享好友
      title: '2018最佳女神派对年度盘点', // 分享标题
      desc: '成为女神派会员，网红展、美酒趴、最时尚课程等超大福利，等你来拿！',
      link: 'http://activity.msparis.com/meeting.html',
      imgUrl: 'https://static-rs.msparis.com/meeting_01.jpg',
      group_type: 1 // 安卓专用
    };
    return (
      <div>
        <Button onClick={this.share}>分享</Button>
        <ShareBox platform='wrap' visible={this.state.visible} shareData={data} onClose={this.shareClose} />
      </div>
    );
  }
}

export default Demo;
