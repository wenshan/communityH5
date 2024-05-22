import React, { Component } from 'react';
import { connect, Link } from 'umi';
import { Space, Input, Button, Popup, Cascader, Toast, TextArea, Collapse, Radio } from 'antd-mobile';
import { CheckCircleOutline, CloseCircleOutline, RightOutline, AddOutline} from 'antd-mobile-icons'
import Signature from '../components/Signature';
import cascaderOptions from '@/utils/roomData';
import WxQRcode from '@/components/WxQRcode';
import ICP from '@/components/Icp';
import WxShare from '@/utils/wxShare';

import './index.less';

const initCommunityUser = {
  id: '',
  userid: '',
  roomid: '',
  name: '',
  contractId: '',
  contractPath: '',
  signatureFile: '',
  is_checkSignature: 0,
  is_submitConfirmation: 0,
  areas: '翠苑三区',
  build: 0,
  unit: 0,
  room: 0
};

class Intention extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowSignature: false,
      isShowCascader: false,
      isShowMobile: false,
      isShowFeedback: false,
      isShowName: false,
      cascaderOptions,
      actionIdx: 0,
      region: 'C',
    };
  }
  // 手风琴
  handelCollapseOnChange=(activeKey)=>{
    this.setState({
      actionIdx: activeKey
    });
  }
  handelMaskCertificationPopup = () => {
    this.setState({
      isShowSignature: false,
      isShowCascader: false,
      isShowMobile: false,
      isShowFeedback: false,
      isShowName: false
    });
  }
  handelNameInput = (val) => {
    const { userinfo } = this.props;
    const value = val? val.replace(/\s+/g, '') : '';
    const newUserinfo = Object.assign({}, userinfo, { name: value});
    this.props.dispatch({
      type: 'common/update',
      payload: { userinfo: newUserinfo}
    });

  }
  // 姓名
  handelNameButtonSubmit = () => {
    const { actionIdx} = this.state;
    const { name } = this.props.userinfo;
    if (name) {
      this.setState({
        isShowName: false,
      });
      this.props.dispatch({
        type: 'common/saveName',
        payload: { name, idx: actionIdx }
      });
    } else {
      Toast.show({
        icon: 'fail',
        content: '请填写姓名和身份证号码',
      });
    }
  }
  handelNameShowButton=()=>{
    this.setState({
      isShowName: true
    });
  }
  handelMobileShowButton=() => {
    this.setState({
      isShowMobile: true,
    });
  }
  handelCertificationMobile = (val) => {
    const { userinfo } = this.props;
    const value = val ? val.replace(/\s+/g, '') : '';
    const newUserinfo = Object.assign({}, userinfo, { mobile: value});
    this.props.dispatch({
      type: 'common/update',
      payload: { userinfo: newUserinfo }
    });
  }
  handelMobileSmsCode= (val) => {
    this.props.dispatch({
      type: 'common/update',
      payload: { smsCode: val }
    });
  }
  handelMobileSendSmsCode= () => {
    const { userinfo } = this.props;
    const { mobile } = userinfo;
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
    const { smsCode, userinfo } = this.props;
    const { mobile } = userinfo;
    if (!smsCode || smsCode.length !== 5) {
      Toast.show({
        icon: 'fail',
        content: '验证码错误',
      });
      return;
    }
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

  handelSignatureShowButton=() => {
    this.setState({
      isShowSignature: true,
    });
  }
  handelSignatureButtonSubmit =({dataURL}) => {
    const { actionIdx} = this.state;
    if (dataURL) {
      this.setState({
        isShowSignature: false,
      });
      this.props.dispatch({
        type: 'common/saveSignature',
        payload: { signatureFile: dataURL, idx: actionIdx }
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
  // 添加房号
  handelCascaderStatusOnConfirm = (value) => {
    if (value && value[0] && value[1] && value[2] && value[3]) {
      const areas = value[0];
      const build = value[1];
      const unit = value[2];
      const room = value[3];
      this.setState({
        isShowCascader: false
      });
      this.props.dispatch({
        type: 'common/createRoom',
        payload: { areas, build, unit, room, region: this.state.region }
      });
    } else {
      Toast.show({
        icon: 'fail',
        content: '请选择完整的房号',
      });
    }
  }
  handelOwnerStatus =({owner})=> {
    const { actionIdx} = this.state;
    this.props.dispatch({
      type: 'common/saveSuperStatus',
      payload: { owner, idx: actionIdx }
    });
  }
  handelPropertyTypeStatus=({propertyType})=> {
    const { actionIdx} = this.state;
    this.props.dispatch({
      type: 'common/saveSuperStatus',
      payload: {propertyType, idx: actionIdx}
    });
  }

  handelTextAreaChange=(val)=>{
    const { actionIdx } = this.state;
    const { communityUser } = this.props;
    const newCommunityUser = communityUser.concat([]);
    newCommunityUser[actionIdx] = Object.assign({}, communityUser[actionIdx], { feedback: val});
    this.props.dispatch({
      type: 'common/update',
      payload: { communityUser: newCommunityUser }
    });
  }
  handelFeedbackButtonSubmit =() => {
    const { actionIdx } = this.state;
    const { feedback } = this.props.communityUser[actionIdx];
    if (feedback) {
      this.setState({
        isShowFeedback: false,
      });
      this.props.dispatch({
        type: 'common/saveFeedback',
        payload: { feedback, idx: actionIdx }
      });
    }
  }
  // 同意意愿
  handelSubmitContractAgree =() => {
    const submitConfirmationAgree = 2; // 同意
    const { actionIdx } = this.state;
    const {name, is_checkMobile } = this.props.userinfo;
    const { signatureFile, areas, build, unit, room, owner, propertyType, submitConfirmation } = this.props.communityUser[actionIdx];
    if (!(areas && build && unit && room)){
      Toast.show({
        icon: 'fail',
        content: '请输入房间号',
      });
      return false;
    }
    if (!name){
      Toast.show({
        icon: 'fail',
        content: '请输入姓名',
      });
      return false;
    }
    if (!is_checkMobile){
      Toast.show({
        icon: 'fail',
        content: '请进行手机验证',
      });
      return false;
    }
    if (!signatureFile){
      Toast.show({
        icon: 'fail',
        content: '电子签名不能为空',
      });
      return false;
    }
    if (!propertyType){
      Toast.show({
        icon: 'fail',
        content: '请选择产权类型',
      });
      return false;
    }
    if (!owner){
      Toast.show({
        icon: 'fail',
        content: '请选择产权人信息',
      });
      return false;
    }
    if(!submitConfirmation !== 1) {
      this.props.dispatch({
        type: 'common/submitContractAgree',
        payload: { idx: actionIdx, submitConfirmation: submitConfirmationAgree}
      });
    } else {
      Toast.show({
        icon: 'fail',
        content: '已经提交不同意意愿申请',
      });
    }

  }
  // 不同意愿意
  handelSubmitUnwilling =()=>{
    const submitConfirmationUnwilling = 1; // 不同意
    const { actionIdx } = this.state;
    const { name, is_checkMobile } = this.props.userinfo;
    const {  areas, build, unit, room, submitConfirmation, owner, propertyType } = this.props.communityUser[actionIdx];
    if (!(areas && build && unit && room)){
      Toast.show({
        icon: 'fail',
        content: '请输入房间号',
      });
      return false;
    }
    if (!name){
      Toast.show({
        icon: 'fail',
        content: '请进行姓名',
      });
      return false;
    }
    if (!is_checkMobile){
      Toast.show({
        icon: 'fail',
        content: '请进行手机验证',
      });
      return false;
    }
    if (!propertyType){
      Toast.show({
        icon: 'fail',
        content: '请选择产权类型',
      });
      return false;
    }
    if (!owner){
      Toast.show({
        icon: 'fail',
        content: '请选择产权人信息',
      });
      return false;
    }
    if (submitConfirmation !== 2){
      this.props.dispatch({
        type: 'common/submitContractUnwilling',
        payload: { idx: actionIdx, submitConfirmation:  submitConfirmationUnwilling}
      });
    } else {
      Toast.show({
        icon: 'fail',
        content: '已经提交了同意意愿申请',
      });
    }
  }
  modalWxQRcodeStatus = () => {
    this.props.dispatch({
      type: 'common/update',
      payload: {
        unionidModalStatus: true
      }
    });
  }
  // html
  renderHtmlTopicAction = ()=>{
    const html = [];
    const { isShowSignature, isShowMobile, isShowFeedback, isShowName } = this.state;
    const { communityUser, userinfo, smsCode } = this.props;
    const { name, mobile, is_checkMobile } = userinfo;
    communityUser && communityUser.length && communityUser.map((item, idx)=>{
      const { signatureFile, areas, build, unit, room, submitConfirmation, owner, propertyType, feedback} = item;
      const submitButtonDisabledStatus = !!(submitConfirmation > 0);
      let label = '未申报';
      if (submitConfirmation == 2) {
        label = '意愿已申报';
      }
      if (submitConfirmation == 1) {
        label = '不同意意愿已提交';
      }
      if (submitConfirmation == 0) {
        label = '未申报';
      }
      if (areas && build && unit && room) {
        const title = `${areas}-${build}幢-${unit}单元-${room}室 - ${label}`
        html.push(
          <>
          <Collapse.Panel key={idx} title={title}>
            <div className='item' key={item.roomid}>
              {/** name start 2 */}
              <div className='box-warp clearfix'>
              <div className="title clearfix"><span className='required'>*</span> 姓名：{name? (<CheckCircleOutline color='#76c6b8' style={{ fontSize: 21 }}/>): (<CloseCircleOutline color='#999' style={{ fontSize: 21 }} />)}<div className='operate'>{(<Button color='primary' disabled={submitButtonDisabledStatus} fill='outline' size='small' onClick={this.handelNameShowButton}>输入</Button>)}</div></div>
                <div className="content clearfix">
                    {name && (<><span className='tx'>{name} </span></>)}
                    <Popup className="popup" visible={isShowName} onMaskClick={this.handelMaskCertificationPopup} title="姓名：" onClose={this.handelMaskCertificationPopup} showCloseButton
                                  bodyStyle={{
                                    borderTopLeftRadius: '8px',
                                    borderTopRightRadius: '8px',
                                    minHeight: '40vh',
                                  }}>
                      <>
                        <div className="from">
                          <div className="item">
                            <Space>
                              <p className='des'>请输入真实的姓名，方便我们尽快推进此项目进度！</p>
                            </Space>
                            <div className='label'>姓名:</div>
                            <div className='input'>
                              <Input
                                placeholder='请输入姓名'
                                value={name}
                                onChange={this.handelNameInput}
                              />
                            </div>
                          </div>
                          <div className="item button">
                            <Button block color='primary' size='middle' onClick={this.handelNameButtonSubmit}>保存</Button>
                          </div>
                        </div>
                      </>
                    </Popup>
                  </div>
              </div>
              {/** name end */}
              {/** mobile start 3 */}
              <div className='box-warp clearfix'>
                <div className="title clearfix"><span className='required'>*</span>联系方式验证 {is_checkMobile? (<CheckCircleOutline color='#76c6b8' style={{ fontSize: 21 }}/>): (<CloseCircleOutline color='#999' style={{ fontSize: 21 }} />)}<div className='operate'>{(<Button color='primary' disabled={is_checkMobile} fill='outline' size='small' onClick={this.handelMobileShowButton}>请进行手机验证</Button>)}</div></div>
                <div className="content clearfix">
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
              {/** mobile end */}
              {/** propertyType start 4 */}
              <div className='box-warp clearfix'>
                <div className='title clearfix'><span className='required'>*</span>产权类型  {propertyType? (<CheckCircleOutline color='#76c6b8' style={{ fontSize: 21 }}/>): (<CloseCircleOutline color='#999' style={{ fontSize: 21 }} />)}</div>
                <div className='content clearfix'>
                  <Space>
                    <Radio.Group value={String(propertyType)} disabled={submitButtonDisabledStatus}>
                      <Space direction='vertical'>
                        <Radio value='1' onClick={()=>{this.handelPropertyTypeStatus({propertyType:1})}}>个人住房</Radio>
                        <Radio value='2' onClick={()=>{this.handelPropertyTypeStatus({propertyType:2})}}>企业住房</Radio>
                      </Space>
                    </Radio.Group>
                  </Space>
                </div>
              </div>
              {/** propertyType end  */}
              {/** owner start 5 */}
              <div className='box-warp clearfix'>
                <div className='title clearfix'><span className='required'>*</span>产权人信息  {owner? (<CheckCircleOutline color='#76c6b8' style={{ fontSize: 21 }}/>): (<CloseCircleOutline color='#999' style={{ fontSize: 21 }} />)}</div>
                <div className='content clearfix'>
                  <Space>
                    <Radio.Group value={String(owner)} disabled={submitButtonDisabledStatus}>
                      <Space direction='vertical'>
                        <Radio value='1' onClick={()=>this.handelOwnerStatus({owner: 1})}>无产权</Radio>
                        <Radio value='2' onClick={()=>this.handelOwnerStatus({owner: 2})}>拥有产权{propertyType ==2 ? '（我是法人）': ''}</Radio>
                      </Space>
                    </Radio.Group>
                  </Space>
                </div>
              </div>
              {/** owner end */}
              {/** signature start 6 */}
              <div className='signature box-warp'>
                <div className="title clearfix"><span className='required'></span>电子签名 {signatureFile? (<CheckCircleOutline color='#76c6b8' style={{ fontSize: 21 }}/>): (<CloseCircleOutline color='#999' style={{ fontSize: 21 }} />)}<div className='operate'>{(<Button color='primary' disabled={submitButtonDisabledStatus} fill='outline' size='small' onClick={this.handelSignatureShowButton}>请电子签名</Button>)}</div></div>
                <div className="content clearfix">
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
                          <Signature index={idx} callbackSubmitDataURL={this.handelSignatureButtonSubmit} clearButton="true"></Signature>
                        </div>
                      </div>
                    </>
                  </Popup>
                </div>
              </div>
              {/** signature end */}
              {/** feedback start 7 */}
              <div className='box-warp clearfix'>
                <div className='title clearfix' onClick={this.handelFeedbackStatusButton}><span className='required'></span>宝贵的建议<span className='des'>（可随时更改）</span> {feedback? (<CheckCircleOutline color='#76c6b8' style={{ fontSize: 21 }}/>): (<CloseCircleOutline color='#999' style={{ fontSize: 21 }} />)} <div className='operate'><Button color='primary' fill='outline' size='small' onClick={this.handelFeedbackStatusButton}>输入</Button></div></div>
                <div className='content clearfix'>
                  <div className='textarea clearfix'>
                    <TextArea value={feedback} disabled></TextArea>
                  </div>
                  <Popup className="popup" visible={isShowFeedback} onMaskClick={this.handelMaskCertificationPopup} title="宝贵的建议" onClose={this.handelMaskCertificationPopup} showCloseButton
                                bodyStyle={{
                                  borderTopLeftRadius: '8px',
                                  borderTopRightRadius: '8px',
                                  minHeight: '60vh',
                                }}>
                    <>
                      <div className="from">
                        <div className="item">
                          <Space>
                            <p className='des'>共商共助，携手共建美好家园，请提供您宝贵的意见！</p>
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
              {/** feedback end */}
              {/** operate start 8 */}
              <div className='box-warp clearfix'>
                <div className='topic-operate clearfix'>
                  <div className="submit clearfix">
                    <Button className='left' loading={this.props.communityUserSubmitUnwillingLoading} disabled={submitButtonDisabledStatus} color='primary' fill='outline' size='middle' onClick={this.handelSubmitUnwilling}>{ submitConfirmation == 1? (<>不同意意愿申请已提交</>): (<>不同意意愿申请</>)}</Button>
                    <Button className='right' loading={this.props.communityUserSubmitLoading} disabled={submitButtonDisabledStatus} color='success' size='middle' onClick={this.handelSubmitContractAgree}>{submitConfirmation == 2 ? (<>意愿申请已提交</>): (<>同意意愿申请</>)}</Button>
                  </div>
                  <div className="check-info">
                      <Link to="/wish.html">点击查看已提交的申请 <RightOutline /></Link>
                  </div>
                </div>
              </div>
              {/** operate end */}
            </div>
            </Collapse.Panel>
          </>
        );
      }
    });
    return html;
  }
  handelSubmitAdd=()=>{
    this.setState({
      isShowCascader: true,
    });
  }

  componentDidMount() {
    /** 分享 -- start */
    const initShare = new WxShare();
    initShare.reset({
      friend_title: '翠苑三区( C区1-14/19-28幢)原拆原建业主意向征集和倡议书',
      friend_content: '为统一征集意见，翠苑三区C区1-14/19-28幢已建立微信群，请各位业主加入微信群填写意见，共商共助，携手共建美好家园。',
      img_url: 'https://img.dreamstep.top/community/banner/banner_intention.png',
      page_url: 'https://www.dreamstep.top/intention.html'
    });
    /** 分享 -- end */
    this.props.dispatch({
      type: 'common/getUserInfo'
    });
    this.props.dispatch({
      type: 'common/getCommunityUserInfo'
    });
    this.props.dispatch({
      type: 'common/update',
      payload: {
        unionidModalStatus: false
      }
    });
  }

  render() {
    const { isShowCascader, cascaderOptions, actionIdx } = this.state;
    return (
      <div className="page">
        <div className="intention-page">
          <div className="page-topic" key="page-topic">
            <h1>原拆原建业主意向征集和倡议书</h1>
            <p className='tx-center'>翠苑三区( C区1-14/19-28幢)</p>
            <Space></Space>
            <p>各位小区业主(C区1-14/19-28幢):</p>
            <p>根据2024年4月，由浙江省住建厅、发改委、自然资源厅联合发布的《关于稳步推进城镇老旧小区自主更新试点工作的指导意见》文件精神，<span className='red'>杭州众多历史悠久的小区正在做原拆原建自主意向更新调研工作。我们小区业主若能展现出强烈意愿，并得到大多业主支持，便有资格向杭州市政府申请原拆原建项目</span>，由政府牵头结合业主意见建议编制具体的拆建方案。目前，杭州市已经有浙工新村通过具体方案，进入到拆除重建的具体实施阶段。
            </p>

            <p>为尽快能启动申报工作，我们在此恳请各位业主扫码下方的二维码关注我们的微信公众号，在上面表达您的拆建意愿。这将有助于我们统一搜集大家的意向，并进行后续的整理工作。此次申报只是对全体业主意愿的调查，不具有任何法律效力，大家尽可放心申报。
            </p>
            <p>在此我们邀请各位业主一起为翠苑三区的自主更新献计献策，共商共助，携手共建美好家园。</p>
            <Space></Space>
            <p className='tx-right'>翠苑三区自主更新委员会(筹)</p>
            <p className='tx-right'>2024年5月15日</p>
            <div className="qrcode" onClick={this.modalWxQRcodeStatus}>点击关注公众号</div>
            <WxQRcode></WxQRcode>
          </div>
          <div className='other-user' key="other-user">
            <p><span className='title'>注意：</span></p>
            <p>1. 非翠苑三区( C区1-14/19-28幢)住户请不要在此提交申请，如果提交了请即时删除，其他区域正在接入中，详情情况咨询各区志愿者群主。</p>
            <p>2. 严禁提交和自身不相关的房产信息，占用他人房产信息。</p>
            <p>3. 意愿申请人，只限于本区域内住户（包含有产权、无产权、租客），期望小区会更好。</p>
            <Space></Space>
            <p className='tx-right'><Link to="/intentionMap.html">翠苑三区原拆原建项目各区群落汇总 <RightOutline /></Link></p>
            <p className='tx-right'><Link to="/intentionData.html">翠苑三区原拆原建项目接入公众号上报数据规范 <RightOutline /></Link></p>
            {/**
            <p>其他区域的接入请联系 翠苑三区自主更新委员会(筹) 周委员（可以在 翠苑三区便民服务群 寻找）</p>
            */}
          </div>
          <div className="topic-action" key="topic-action">
          <Collapse accordion={true} activeKey={actionIdx} onChange={this.handelCollapseOnChange}>
            {this.renderHtmlTopicAction()}
          </Collapse>
            <div className='action-add'>
                <div className="submit">
                  <Button block color='warning' size='large' onClick={this.handelSubmitAdd}><AddOutline />新增住房户号申请</Button>
                  <p>注：最多支持5套住房申报，如需更多请关注公众号私信管理员</p>
                  <Cascader
                    options={cascaderOptions}
                    visible={isShowCascader}
                    onClose={this.handelMaskCertificationPopup}
                    onConfirm={this.handelCascaderStatusOnConfirm}
                  />

                  <div className="check-info">
                    <Link to="/wish.html">点击查看已提交的申请 <RightOutline /></Link>
                  </div>
                </div>
            </div>
          </div>

          <div className="topic-statement" key="topic-statement">
            <div className='title'>声明</div>
            <div className='content'>
              <div className='text'>
                <ul>
                  <li>
                    <h5>1. 数据安全和个人隐私</h5>
                    <div>
                      <p>- 我个人(和珅) 和 翠苑三区自主更新委员会(筹) 所有成员承诺在法律的基础上严格保护数据和用户隐私，即使项目失败及时销毁。</p>
                      <p>- 数据使用是方便推动共同愿景的执行和落地，并且数据使用过程中会公示在 翠苑三区自主更新委员会(筹) 群并通过 翠苑三区自主更新委员会(筹) 同意。</p>
                      <p>- 数据访问安全 所有的数据都要经过网关的加密解密</p>
                    </div>
                  </li>
                  <li>
                    <h5>2. 翠苑三区自主更新委员会(筹)</h5>
                    <div>
                      <p>- 翠苑三区自主更新委员会(筹) 由小区业主自发组建，组织和推动小区公共事务落地。</p>
                      <p>- 由于 翠苑区“老破小”等政府行为落后，要想有所改变向更好方式，翠苑三区自主更新委员会(筹) 积极推动和起草两个事项《原拆原建项目》和《翠苑三区业主委员会》。</p>
                      <p>- 翠苑三区自主更新委员会(筹) 在法律的基础上积极推进和起草《翠苑三区业主委员会》成立，业主委员会后 翠苑三区自主更新委员会(筹) 自行解散。</p>
                      <p>- 翠苑三区自主更新委员会(筹) 推动《原拆原建项目》需要收集大家的意愿，这也是此片文章的目的，希望广大业主积极参与，项目早日确定。</p>
                    </div>
                  </li>
                  <li>
                    <h5>3. 《西子翠苑》公众号 公益服务说明</h5>
                    <div>
                      <p>- 《西子翠苑》公众号为基础的，主旨是服务翠苑社区业主服务，信息互通，共商共助，携手共建美好家园。</p>
                      <p>- 《西子翠苑》公众号 所有权归 翠苑三区自主更新委员会(筹)，正大事项由 翠苑三区自主更新委员会(筹) 确定。 </p>
                      <p>- 《西子翠苑》公众号 是非盈利性，日常运营和技术支持均有 翠苑三区自主更新委员会(筹) 人员参与，云服务等等硬件成本需要后续广大业主募捐支持。 </p>
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
    communityUserSubmitUnwillingLoading: state.common.communityUserSubmitUnwillingLoading,
    smsCode: state.common.smsCode,
  }),
)(Intention);
