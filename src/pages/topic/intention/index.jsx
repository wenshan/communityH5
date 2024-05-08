import React, { Component } from 'react';
import { connect } from 'umi';
import { TabBar, Badge, Space, Input, Button, Popup, Cascader, Toast } from 'antd-mobile';
import { CheckCircleOutline, CloseCircleOutline} from 'antd-mobile-icons'
import Signature from '../components/Signature';
import Footer from '@/components/Footer';
import cascaderOptions from '@/utils/roomData';

import 'rmc-dialog/assets/index.css';
import './index.less';

class Intention extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowCertification: false,
      isShowSignature: false,
      isShowCascader: false,
      cascaderOptions,
    };
  }

  handelCertificationButton=() => {
    this.setState({
      isShowCertification: true,
    });
  }
  handelMaskCertification = () => {
    const { isShowCertification } = this.state;
    this.setState({
      isShowCertification: !isShowCertification,
    });
  }
  handelCertificationName = (val) => {
    const { communityUser } = this.props;
    const newCommunityUser = Object.assign({}, communityUser, { name: val});
    this.props.dispatch({
      type: 'common/update',
      payload: { communityUser: newCommunityUser }
    });
  }
  handelCertificationIdcard = (val) => {
    const { communityUser } = this.props;
    const newCommunityUser = Object.assign({}, communityUser, { idcard: val});
    this.props.dispatch({
      type: 'common/update',
      payload: { communityUser: newCommunityUser }
    });
  }
  handelCertificationButtonSubmit = () => {
    const { communityUser } = this.props;
    if (communityUser && communityUser.name && communityUser.idcard) {
      this.setState({
        isShowCertification: false,
      });
      this.props.dispatch({
        type: 'common/update',
        payload: { communityUser }
      });
      this.props.dispatch({
        type: 'common/userCertification',
        payload: { communityUser }
      });
    } else {
      Toast.show({
        icon: 'fail',
        content: '请填写姓名和身份证号码',
      });
    }

  }
  handelMaskSignature =() => {
    this.setState({
      isShowSignature: false,
    });
  }
  handelMaskSignature =() => {
    this.setState({
      isShowSignature: false,
    });
  }
  handelSignatureButton=() => {
    this.setState({
      isShowSignature: true,
    });
  }
  handelSignatureButtonSubmit =(dataURL) => {
    console.log('dataURL:', dataURL);
    const { communityUser } = this.props;
    const newCommunityUser = Object.assign({}, communityUser, { signatureFile: dataURL});
    if (dataURL) {
      this.setState({
        isShowSignature: false,
      });
      // 保存签名
      this.props.dispatch({
        type: 'common/update',
        payload: { communityUser: newCommunityUser }
      });
      this.props.dispatch({
        type: 'common/saveSignature',
        payload: { signatureFile: dataURL }
      });
    }
  }
  handelCascaderStatus = () => {
    const { isShowCascader } = this.state;
    this.setState({
      isShowCascader: !isShowCascader
    });
  }
  handelCascaderStatusClose = () => {
    this.setState({
      isShowCascader: false
    });
  }
  handelCascaderStatusOnConfirm = (value) => {
    console.log('value:', value);
    const { communityUser } = this.props;
    if (value && value[0] && value[1] && value[2] && value[3]) {
      const areas = value[0];
      const build = value[1];
      const unit = value[2];
      const room = value[3];
      const newCommunityUser = Object.assign({}, communityUser, { areas, build, unit, room});
      this.props.dispatch({
        type: 'common/update',
        payload: { communityUser: newCommunityUser }
      });
      this.props.dispatch({
        type: 'common/uploadRoomNum',
        payload: { areas, build, unit, room }
      });
    } else {
      Toast.show({
        icon: 'fail',
        content: '请选择完整的房号',
      });
    }
  }
  handelSubmitContractPDF =() => {
    this.props.dispatch({
      type: 'common/submitContractPDF'
    });
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'common/getUserInfo'
    });
    // getCommunityUserInfo
    this.props.dispatch({
      type: 'common/getCommunityUserInfo'
    });
  }


  render() {
    const { isShowCertification, isShowSignature, isShowCascader, cascaderOptions } = this.state;
    const { communityUser, userinfo } = this.props;
    const { is_certification } = userinfo;
    const { name, idcard, signatureFile, areas, build, unit, room, is_submitConfirmation} = communityUser;
    console.log(is_submitConfirmation);
    console.log(is_certification);
    return (
      <div className="page">
        <div className="intention-page">
          <div className="page-topic">
            <h1>翠苑三区( C区1-14/19-28幢)原拆原建业主意向征集和倡议书</h1>
            <img src="https://affiliate-traffic.oss-cn-hongkong.aliyuncs.com/community/banner/banner_intention.png" />
            <p>各位小区业主(C区1-14/19-28幢):</p>
            <p>根据2024年4月，由浙江省住建厅、发改委、自然资源厅联合发布的《关于稳步推进城镇老旧小区自主更新试点工作的指导意见》文件精神，
              杭州多个老旧小区在做原拆原建有机更新调研。业主同意率高的小区可以申报杭州市政府，由政府牵头结合业主意见建议编制具体的拆建方案。
              目前，杭州市已经有浙工新村通过具体方案，进入到拆除重建的具体实施阶段;还有翠苑北二区完成了业主意向征集，进入到向市政府申请阶段。
              参考他们的改造成本，翠苑三区业主在不扩面的情况下，出资7万多元就有望申报我们小区进行原拆原建，同时政府还会在建设期间给每户发放租房补贴。
            </p>

            <p>为统一征集意见，翠苑三区C区1-14/19-28幢已建立微信群，请各位业主加入微信群填写意见，共商共助，携手共建美好家园。
              各位业主不用担心，目前只是意愿登记不代表法律上的同意拆迁，大家统一意见后才会申报市政府，之后再综合业主们的各项要求出具体拆建方案。
            </p>
            <p>各位业主请关注公众号《西子翠苑》私信加群，共商小区建设大计。</p>
          </div>
          <div className="topic-action">
          <div className="room">
            <div className="title">选择房号 {(areas && build && unit && room)? (<CheckCircleOutline color='#76c6b8' style={{ fontSize: 21 }}/>): (<CloseCircleOutline color='#999' style={{ fontSize: 21 }} />)}</div>
            <div className="content">
              { is_submitConfirmation ? '' : (<Button color='primary' fill='outline' size='small' onClick={this.handelCascaderStatus}>选择</Button>)}
              <div>
                <span>{areas}-{build}幢-{unit}单元-{room}室</span>
              </div>
              <Cascader
                options={cascaderOptions}
                visible={isShowCascader}
                onClose={this.handelCascaderStatusClose}
                onConfirm={this.handelCascaderStatusOnConfirm}
              />
            </div>
          </div>
          <div className="certification">
            <div className="title">实名认证 {is_certification? (<CheckCircleOutline color='#76c6b8' style={{ fontSize: 21 }}/>): (<CloseCircleOutline color='#999' style={{ fontSize: 21 }} />)}</div>
            <div className="content">
              {name && idcard && is_certification? (<> 姓名：<span className='tx'>{name} </span>
              身份证号码：<span className='tx'>{idcard}</span> </>): (<Button color='primary' fill='outline' size='small' onClick={this.handelCertificationButton}>请进行实名认证</Button>)}
              <Popup className="popup" visible={isShowCertification} onMaskClick={this.handelMaskCertification} title="实名认证" onClose={this.handelMaskCertification} showCloseButton
                            bodyStyle={{
                              borderTopLeftRadius: '8px',
                              borderTopRightRadius: '8px',
                              minHeight: '40vh',
                            }}>
                <>
                  <div className="from">
                    <div className="item">
                      <div className='label'>姓名：</div>
                      <div className='input'>
                        <Input
                          placeholder='请输入姓名'
                          value={name}
                          onChange={this.handelCertificationName}
                        />
                      </div>
                    </div>
                    <div className="item">
                      <div className='label'>身份证号码：</div>
                      <div className='input'>
                        <Input
                          placeholder='请输入身份证号码'
                          value={idcard}
                          onChange={this.handelCertificationIdcard}
                        />
                      </div>
                    </div>
                    <div className="item button">
                      <Button block color='primary' size='middle' onClick={this.handelCertificationButtonSubmit}>提交实名认证</Button>
                    </div>
                  </div>
                </>
              </Popup>

            </div>
          </div>
          <div className="signature">
            <div className="title">电子签名 {signatureFile? (<CheckCircleOutline color='#76c6b8' style={{ fontSize: 21 }}/>): (<CloseCircleOutline color='#999' style={{ fontSize: 21 }} />)}</div>
            <div className="content">
            {is_submitConfirmation ? '' : (<Button color='primary' fill='outline' size='small' onClick={this.handelSignatureButton}>请电子签名</Button>)}
            <div className='signature-img'>
                <img src={signatureFile} />
            </div>
            <Popup className="popup" visible={isShowSignature} onMaskClick={this.handelMaskSignature} title="电子签名" onClose={this.handelMaskSignature} showCloseButton
                            bodyStyle={{
                              borderTopLeftRadius: '8px',
                              borderTopRightRadius: '8px',
                              minHeight: '60vh',
                            }}>
                <>
                  <div className="from">
                    <div className="item">
                      <Signature callbackSubmitDataURL={this.handelSignatureButtonSubmit} clearButton="true"></Signature>
                    </div>
                  </div>
                </>
              </Popup>
            </div>
          </div>
          <div className="submit">
            <Button loading={this.props.communityUserSubmitLoading} disabled={is_submitConfirmation} block color='primary' size='large' onClick={this.handelSubmitContractPDF}>确认同意提交意向申请</Button>
          </div>
          <div className="check-info">
              <span>点击查看已提交的申请</span>
          </div>
        </div>
        </div>
      </div>
    );
  }
}

export default connect(
  (state) => ({
    swiperBanner: state.home.swiperBanner,
    communityUser: state.common.communityUser,
    userinfo:  state.common.userinfo,
    communityUserSubmitLoading: state.common.communityUserSubmitLoading,
  }),
)(Intention);
