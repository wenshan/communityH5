import React, { Component } from 'react';
import { connect, Link } from 'umi';
import { TabBar, Badge, Space, Input, Button, Popup, Cascader, Toast } from 'antd-mobile';
import { CheckCircleOutline, CloseCircleOutline, RightOutline} from 'antd-mobile-icons'
import Signature from '../components/Signature';
import cascaderOptions from '@/utils/roomData';
import WxShare from '@/utils/wxShare';

import './index.less';

class Intention extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowCertification: false,
      isShowSignature: false,
      isShowCascader: false,
      isShowMobile: false,
      cascaderOptions,
    };
  }

  handelCertificationButton=() => {
    this.setState({
      isShowCertification: true,
    });
  }
  handelMaskCertification = () => {
    this.setState({
      isShowCertification: false,
      isShowSignature: false,
      isShowCascader: false,
      isShowMobile: false,
    });
  }
  handelCertificationName = (val) => {
    const { communityUser, userinfo } = this.props;
    const newUserinfo = Object.assign({}, userinfo, { name: val});
    const newCommunityUser = Object.assign({}, communityUser, { name: val});
    this.props.dispatch({
      type: 'common/update',
      payload: { communityUser: newCommunityUser,  userinfo: newUserinfo}
    });
  }
  handelMobileButton=() => {
    this.setState({
      isShowMobile: true,
    });
  }
  handelCertificationMobile = (val) => {
    const { communityUser, userinfo } = this.props;
    const newUserinfo = Object.assign({}, userinfo, { mobile: val});
    const newCommunityUser = Object.assign({}, communityUser, { mobile: val});
    this.props.dispatch({
      type: 'common/update',
      payload: { communityUser: newCommunityUser, userinfo: newUserinfo }
    });
  }
  handelMobileSmsCode= (val) => {
    const { communityUser } = this.props;
    const newCommunityUser = Object.assign({}, communityUser, { smsCode: val});
    this.props.dispatch({
      type: 'common/update',
      payload: { communityUser: newCommunityUser }
    });
  }
  handelMobileSendSmsCode= () => {
    const { communityUser } = this.props;
    const { mobile } = communityUser;
    if (mobile) {
      this.props.dispatch({
        type: 'common/communitySendSms',
        payload: { mobile }
      });
    } else {
      Toast.show({
        icon: 'fail',
        content: '请输入正确的手机号',
      });
    }
  }
  handelMobileButtonSubmit = () => {
    const { mobile, smsCode } = this.props.communityUser;
    if (mobile && smsCode) {
      if (mobile.length == 11 ) {
        this.setState({
          isShowMobile: false,
        });
        this.props.dispatch({
          type: 'common/mobileCertification',
          payload: { mobile, smsCode }
        });
      } else {
        Toast.show({
          icon: 'fail',
          content: '手机号码异常',
        });
      }
    } else {
      Toast.show({
        icon: 'fail',
        content: '请输入手机号和验证码'
      });
    }
  }
  handelCertificationIdcard = (val) => {
    const { communityUser, userinfo } = this.props;
    const newUserinfo = Object.assign({}, userinfo, { idcard: val});
    const newCommunityUser = Object.assign({}, communityUser, { idcard: val});
    this.props.dispatch({
      type: 'common/update',
      payload: { communityUser: newCommunityUser, userinfo: newUserinfo }
    });
  }
  handelCertificationButtonSubmit = () => {
    const { communityUser } = this.props;
    const { name, idcard } = communityUser;
    if (communityUser && communityUser.name && communityUser.idcard) {
      this.setState({
        isShowCertification: false,
      });
      this.props.dispatch({
        type: 'common/userCertification',
        payload: { name, idcard }
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
    /** 分享 -- start */
    const initShare = new WxShare();
    initShare.reset({
      friend_title: '翠苑三区( C区1-14/19-28幢)原拆原建业主意向征集和倡议书',
      friend_content: '为统一征集意见，翠苑三区C区1-14/19-28幢已建立微信群，请各位业主加入微信群填写意见，共商共助，携手共建美好家园。',
      img_url: 'https://affiliate-traffic.oss-cn-hongkong.aliyuncs.com/community/banner/banner_intention.png',
      page_url: 'https://www.dreamstep.top/intention.html'
    });
    /** 分享 -- end */
    this.props.dispatch({
      type: 'common/getUserInfo'
    });
    this.props.dispatch({
      type: 'common/getCommunityUserInfo'
    });
  }


  render() {
    const { isShowCertification, isShowSignature, isShowCascader,isShowMobile, cascaderOptions } = this.state;
    const { communityUser, userinfo } = this.props;
    const { is_certification, name, idcard, mobile, is_checkMobile } = userinfo;
    const { signatureFile, areas, build, unit, room, is_submitConfirmation, smsCode,} = communityUser;
    return (
      <div className="page">
        <div className="intention-page">
          <div className="page-topic">
            <h1>翠苑三区( C区1-14/19-28幢)原拆原建业主意向征集和倡议书</h1>
            <img src="https://affiliate-traffic.oss-cn-hongkong.aliyuncs.com/community/banner/banner_intention.png" />
            <Space></Space>
            <p>各位小区业主(C区1-14/19-28幢):</p>
            <p>根据2024年4月，由浙江省住建厅、发改委、自然资源厅联合发布的《关于稳步推进城镇老旧小区自主更新试点工作的指导意见》文件精神，
              杭州多个老旧小区在做原拆原建有机更新调研。<span className='red'>业主同意率高的小区可以申报杭州市政府，由政府牵头结合业主意见建议编制具体的拆建方案。</span>
              目前，杭州市已经有浙工新村通过具体方案，进入到拆除重建的具体实施阶段;还有翠苑北二区完成了业主意向征集，进入到向市政府申请阶段。
              参考他们的改造成本，<span className='red'>翠苑三区业主在不扩面的情况下，出资一定金额就有望申报我们小区进行原拆原建，同时政府还会在建设期间给每户发放租房补贴。</span>
            </p>

            <p><span className='red'>为统一征集意见，翠苑三区C区1-14/19-28幢已建立微信群，请各位业主加入微信群填写意见，共商共助，携手共建美好家园。</span>
              各位业主不用担心，目前只是意愿登记不代表法律上的同意拆迁，大家统一意见后才会申报市政府，之后再综合业主们的各项要求出具体拆建方案。
            </p>
            <p><span className='red'>各位业主请关注公众号《西子翠苑》私信加群，共商小区建设大计。</span></p>
          </div>
          <div className="topic-action">
          <div className="room">
            <div className="title">选择房号 {(areas && build && unit && room)? (<CheckCircleOutline color='#76c6b8' style={{ fontSize: 21 }}/>): (<CloseCircleOutline color='#999' style={{ fontSize: 21 }} />)}<div className='operate'>{is_submitConfirmation ? '' : (<Button color='primary' fill='outline' size='small' onClick={this.handelCascaderStatus}>选择</Button>)}</div></div>
            <div className="content">
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
            <div className="title">实名认证 {is_certification? (<CheckCircleOutline color='#76c6b8' style={{ fontSize: 21 }}/>): (<CloseCircleOutline color='#999' style={{ fontSize: 21 }} />)}<div className='operate'>{is_certification? '':(<Button color='primary' fill='outline' size='small' onClick={this.handelCertificationButton}>请进行实名认证</Button>)}</div></div>
            <div className="content">
              {name && idcard && is_certification && (<> 姓名：<span className='tx'>{name} </span>
              身份证号码：<span className='tx'>{idcard}</span> </>)}
              <Popup className="popup" visible={isShowCertification} onMaskClick={this.handelMaskCertification} title="实名认证" onClose={this.handelMaskCertification} showCloseButton
                            bodyStyle={{
                              borderTopLeftRadius: '8px',
                              borderTopRightRadius: '8px',
                              minHeight: '40vh',
                            }}>
                <>
                  <div className="from">
                    <div className="item">
                      <div className='label'>姓名:</div>
                      <div className='input'>
                        <Input
                          placeholder='请输入姓名'
                          value={name}
                          onChange={this.handelCertificationName}
                        />
                      </div>
                    </div>
                    <div className="item">
                      <div className='label'>身份证号码:</div>
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
          <div className='contact-info'>
          <div className="title">联系方式验证 {is_checkMobile? (<CheckCircleOutline color='#76c6b8' style={{ fontSize: 21 }}/>): (<CloseCircleOutline color='#999' style={{ fontSize: 21 }} />)}<div className='operate'>{is_checkMobile? '':(<Button color='primary' fill='outline' size='small' onClick={this.handelMobileButton}>请进行联系方式验证</Button>)}</div></div>
            <div className="content">
              {mobile && is_checkMobile && (<>手机号码：<span className='tx'>{mobile} </span></>)}
              <Popup className="popup" visible={isShowMobile} onMaskClick={this.handelMaskCertification} title="联系方式验证" onClose={this.handelMaskCertification} showCloseButton
                            bodyStyle={{
                              borderTopLeftRadius: '8px',
                              borderTopRightRadius: '8px',
                              minHeight: '40vh',
                            }}>
                <>
                  <div className="from">
                    <div className="item">
                      <div className='label'>手机号码:</div>
                      <div className='input'>
                        <Input
                          placeholder='手机号码'
                          value={mobile}
                          type="number"
                          onChange={this.handelCertificationMobile}
                        />
                      </div>
                    </div>
                    <div className="item">
                      <div className='label'>验证码:</div>
                      <div className='input-sms'>
                        <Input placeholder='请输入验证码' value={smsCode}  onChange={this.handelMobileSmsCode} clearable />  <Button color='primary' className="sms-send" fill='outline' size='small' onClick={this.handelMobileSendSmsCode}>发送验证码</Button>
                      </div>
                    </div>
                    <div className="item button">
                      <Button block color='primary' size='middle' onClick={this.handelMobileButtonSubmit}>提交手机号码验证</Button>
                    </div>
                  </div>
                </>
              </Popup>

            </div>
          </div>
          <div className="signature">
            <div className="title">电子签名 {signatureFile? (<CheckCircleOutline color='#76c6b8' style={{ fontSize: 21 }}/>): (<CloseCircleOutline color='#999' style={{ fontSize: 21 }} />)}<div className='operate'>{is_submitConfirmation? '':(<Button color='primary' fill='outline' size='small' onClick={this.handelSignatureButton}>请电子签名</Button>)}</div></div>
            <div className="content">
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
            <Button loading={this.props.communityUserSubmitLoading} disabled={is_submitConfirmation} block color='primary' size='large' onClick={this.handelSubmitContractPDF}>{is_submitConfirmation? (<>意向申请已提交</>): (<>确认同意提交意向申请</>)}</Button>
          </div>
          <div className="check-info">
              <Link to="/wish.html">点击查看已提交的申请 <RightOutline /></Link>
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
