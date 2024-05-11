import React, { Component } from 'react';
import { connect, Link } from 'umi';
import { TabBar, Badge, Space, Input, Button, Popup, Cascader, Toast, Checkbox, TextArea, Collapse } from 'antd-mobile';
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
      isShowFeedback: false,
      cascaderOptions,
    };
  }

  handelCertificationShowButton=() => {
    this.setState({
      isShowCertification: true,
    });
  }
  handelMaskCertificationPopup = () => {
    this.setState({
      isShowCertification: false,
      isShowSignature: false,
      isShowCascader: false,
      isShowMobile: false,
      isShowFeedback: false,
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
  handelMobileShowButton=() => {
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

  handelSignatureShowButton=() => {
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
  handelCascaderShowButton = () => {
    this.setState({
      isShowCascader: true,
    });
  }
  handelFeedbackStatusButton = () => {
    this.setState({
      isShowFeedback: true,
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
      this.setState({
        isShowCascader: false
      });
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
  handelOwnerStatus =(val)=> {
    const { communityUser } = this.props;
    const newCommunityUser = Object.assign({}, communityUser, { is_owner: val});
    this.props.dispatch({
      type: 'common/update',
      payload: { communityUser: newCommunityUser }
    });
  }

  handelTextAreaChange=(val)=>{
    const { communityUser } = this.props;
    const newCommunityUser = Object.assign({}, communityUser, { feedback: val});
    this.props.dispatch({
      type: 'common/update',
      payload: { communityUser: newCommunityUser }
    });
  }
  handelFeedbackButtonSubmit =() => {
    const { feedback } = this.props.communityUser;
    if (feedback) {
      this.setState({
        isShowFeedback: false,
      });
      this.props.dispatch({
        type: 'common/saveFeedback',
        payload: { feedback }
      });
    }
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
    const { isShowCertification, isShowSignature, isShowCascader,isShowMobile, isShowFeedback, cascaderOptions } = this.state;
    const { communityUser, userinfo } = this.props;
    const { is_certification, name, idcard, mobile, is_checkMobile } = userinfo;
    const { signatureFile, areas, build, unit, room, is_submitConfirmation, smsCode, is_owner, feedback} = communityUser;
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
            <div className="room box-warp">
              <div className="title"><span className='required'>*</span>选择房号 {(areas && build && unit && room)? (<CheckCircleOutline color='#76c6b8' style={{ fontSize: 21 }}/>): (<CloseCircleOutline color='#999' style={{ fontSize: 21 }} />)}<div className='operate'>{is_submitConfirmation ? '' : (<Button color='primary' fill='outline' size='small' onClick={this.handelCascaderShowButton}>选择</Button>)}</div></div>
              <div className="content">
                {(areas && build && unit && room) && (<div><span>{areas}-{build}幢-{unit}单元-{room}室</span></div>)}
                <Cascader
                  options={cascaderOptions}
                  visible={isShowCascader}
                  onClose={this.handelMaskCertificationPopup}
                  onConfirm={this.handelCascaderStatusOnConfirm}
                />
              </div>
            </div>
            <div className="certification box-warp">
              <div className="title"><span className='required'>*</span>实名认证 {is_certification? (<CheckCircleOutline color='#76c6b8' style={{ fontSize: 21 }}/>): (<CloseCircleOutline color='#999' style={{ fontSize: 21 }} />)}<div className='operate'>{is_certification? '':(<Button color='primary' fill='outline' size='small' onClick={this.handelCertificationShowButton}>请进行实名认证</Button>)}</div></div>
              <div className="content">
                {name && idcard && is_certification && (<> 姓名：<span className='tx'>{name} </span>
                身份证号码：<span className='tx'>{idcard}</span> </>)}
                <Popup className="popup" visible={isShowCertification} onMaskClick={this.handelMaskCertificationPopup} title="实名认证" onClose={this.handelMaskCertificationPopup} showCloseButton
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
            <div className='contact-info box-warp'>
              <div className="title"><span className='required'>*</span>联系方式验证 {is_checkMobile? (<CheckCircleOutline color='#76c6b8' style={{ fontSize: 21 }}/>): (<CloseCircleOutline color='#999' style={{ fontSize: 21 }} />)}<div className='operate'>{is_checkMobile? '':(<Button color='primary' fill='outline' size='small' onClick={this.handelMobileShowButton}>请进行联系方式验证</Button>)}</div></div>
              <div className="content">
                {mobile && is_checkMobile && (<>手机号码：<span className='tx'>{mobile} </span></>)}
                <Popup className="popup" visible={isShowMobile} onMaskClick={this.handelMaskCertificationPopup} title="联系方式验证" onClose={this.handelMaskCertificationPopup} showCloseButton
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
            <div className="signature box-warp">
              <div className="title"><span className='required'>*</span>电子签名 {signatureFile? (<CheckCircleOutline color='#76c6b8' style={{ fontSize: 21 }}/>): (<CloseCircleOutline color='#999' style={{ fontSize: 21 }} />)}<div className='operate'>{is_submitConfirmation? '':(<Button color='primary' fill='outline' size='small' onClick={this.handelSignatureShowButton}>请电子签名</Button>)}</div></div>
              <div className="content">
                {signatureFile && (<div className='signature-img'><img src={signatureFile} /></div>)}
                <Popup className="popup" visible={isShowSignature} onMaskClick={this.handelMaskCertificationPopup} title="电子签名" onClose={this.handelMaskCertificationPopup} showCloseButton
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
            <div className="owner box-warp">
              <div className='title'><span className='required'></span>确认产权人信息</div>
              <div className='content'>
                <Checkbox checked={is_owner} disabled={is_submitConfirmation} onChange={this.handelOwnerStatus}>是否是产权所有人</Checkbox>
              </div>
            </div>
            <div className="feedback box-warp">
              <div className='title'><span className='required'></span>建议&妙想 <div className='operate'>{!is_submitConfirmation && (<Button color='primary' fill='outline' size='small' onClick={this.handelFeedbackStatusButton}>输入</Button>)}</div></div>
              <div className='content'>
                <div>
                  <TextArea value={feedback} disabled></TextArea>
                </div>
                <Popup className="popup" visible={isShowFeedback} onMaskClick={this.handelMaskCertificationPopup} title="电子签名" onClose={this.handelMaskCertificationPopup} showCloseButton
                              bodyStyle={{
                                borderTopLeftRadius: '8px',
                                borderTopRightRadius: '8px',
                                minHeight: '60vh',
                              }}>
                  <>
                    <div className="from">
                      <div className="item">
                        <Space>
                          <p>共商共助，携手共建美好家园</p>
                        </Space>
                        <TextArea value={feedback} onChange={this.handelTextAreaChange} placeholder="最大输入250个字符" showCount maxLength={250} rows={8}></TextArea>
                      </div>
                      <div className="item button">
                        <Button block color='primary' size='middle' onClick={this.handelFeedbackButtonSubmit}>保存建议</Button>
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
          <div className='process-description'>
            <div className='title'>流程说明</div>
            <div className='content'>
              <div className='text'>
                <img src="https://img.dreamstep.top/community/img/process-description.png" />
              </div>
            </div>
          </div>
          <div class="topic-statement">
            <div className='title'>声明</div>
            <div className='content'>
              <div className='text'>
                <ul>
                  <li>
                    <h5>1. 数据安全和个人隐私</h5>
                    <div>
                      <p>- 我个人 和 暂时志愿者筹备小组 所有成员承诺在法律的基础上严格保护数据和用户隐私，即使项目失败及时销毁。</p>
                      <p>- 数据使用是方便推动共同愿景的执行和落地，并且数据使用过程中会公示在 暂时志愿者筹备小组 群并通过 暂时志愿者筹备小组 同意。</p>
                    </div>
                  </li>
                  <li>
                    <h5>2. 暂时志愿者筹备小组</h5>
                    <div>
                      <p>- 暂时志愿者筹备小组 由小区业主自发组建，组织和推动小区公共事务落地。</p>
                      <p>- 由于 翠苑区“老破小”等政府行为落后，要想有所改变向更好方式，暂时志愿者筹备小组 积极推动和起草两个事项《原拆原建项目》和《翠苑三区业主委员会》。</p>
                      <p>- 暂时志愿者筹备小组 在法律的基础上积极推进和起草《翠苑三区业主委员会》成立，业主委员会后 暂时志愿者筹备小组 自行解散。</p>
                      <p>- 暂时志愿者筹备小组 推动《原拆原建项目》需要收集大家的意愿，这也是此片文章的目的，希望广大业主积极参与，项目早日确定。</p>
                    </div>
                  </li>
                  <li>
                    <h5>3. 《西子翠苑》公众号 公益服务说明</h5>
                    <div>
                      <p>- 《西子翠苑》公众号为基础的，主旨是服务翠苑社区业主服务，信息互通，共商共助，携手共建美好家园。</p>
                      <p>- 《西子翠苑》公众号 所有权归 暂时志愿者筹备小组，正大事项由 暂时志愿者筹备小组确定。 </p>
                      <p>- 《西子翠苑》公众号 是非盈利性，日常运营和技术支持均有 暂时志愿者筹备小组 人员参与，云服务等等硬件成本需要后续广大业主募捐支持。 </p>
                    </div>
                  </li>
                </ul>
              </div>
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
