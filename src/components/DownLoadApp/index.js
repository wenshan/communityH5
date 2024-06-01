import React, { Component } from 'react';
import { connect } from 'dva';
import cssModel from './index.less';
import config from '@/config/config';

class DownloadComp extends Component {
  render() {
    return (
      <div className={cssModel.download}>
        <img src={`${config.IMG_URL}/images/download.png`} alt="msparis_download" />
      </div>
    );
  }
}

const stateToProps = state => ({
  platform: state.app.platform,
});

export default connect(stateToProps)(DownloadComp);
