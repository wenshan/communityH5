/**
 * 全局layout
 * 按目前架构划分，初步断定需要传
    1、downloadshow： 控制是否显示app下载bar
    2、platform：控制对应不同平台显示不同的header or layout & footer
 *
 */
import React, { Component } from 'react';
import Download from '@/components/DownLoadApp';
import LayoutFooter from '@/components/Footer';
import './index.less';

class Layout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shouldShowDownloadBar: false,
    };
  }

  componentDidMount() {
    if (this.props.downloadshow && this.props.platform !== 'app' && this.props.platform !== 'zhima' && this.props.platform !== 'jd' && this.props.platform !== 'tx') {
      this.setState({
        shouldShowDownloadBar: this.props.downloadshow,
      });
    }
  }

  render() {
    return (
      <div id="main">
        {
          this.state.shouldShowDownloadBar ? <Download /> : ''
        }

        <div className="mainbody">
          {this.props.children}
        </div>

        <LayoutFooter />
      </div>
    );
  }
}

export default Layout;
