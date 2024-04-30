import React, { Component } from 'react';
import { connect } from 'umi';
import { TabBar, Badge, Space, Input, Button, Popup } from 'antd-mobile';
import { CheckCircleOutline } from 'antd-mobile-icons'
import Signature from '../components/Signature';
import Footer from '@/components/Footer';

import 'rmc-dialog/assets/index.css';
import './index.less';

class Intention extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowCertification: false,
      isShowSignature: false,
      certification: {
        name: '',
        idcard: '',
        is_certification: false,
        signatureFile: '',
      },
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
    const { certification } = this.state;
    const newCertification = Object.assign({}, certification, { name: val});
    this.setState({
      certification: newCertification
    });
  }
  handelCertificationIdcard = (val) => {
    const { certification } = this.state;
    const newCertification = Object.assign({}, certification, { idcard: val});
    this.setState({
      certification: newCertification
    });
  }
  handelCertificationButtonSubmit = () => {
    this.setState({
      isShowCertification: false,
    });
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
    const { certification } = this.state;
    const newCertification = Object.assign({}, certification, { signatureFile: dataURL});
    if (dataURL) {
      this.setState({
        isShowSignature: false,
        certification: newCertification
      });
    }
  }

  render() {
    const { isShowCertification, isShowSignature } = this.state;
    const { name, idcard, is_certification, signatureFile} = this.state.certification;
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
              各位业主请加微信群，共商小区建设大计
            </p>
            <p>加群</p>
          </div>
        </div>
        <div className="topic-action">
          <div className="room">
            <div className="title">选择房号</div>
            <div className="content">
              <span>选择区域：</span>
              <span>选择楼号：</span>
              <span>选择单元：</span>
            </div>
          </div>
          <div className="certification">
            <div className="title">实名认证 <CheckCircleOutline color='#76c6b8' style={{ fontSize: 21 }}/></div>
            <div className="content">
              {name && idcard ? (<> 姓名：<span className='tx'>{name} </span>
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
            <div className="title">电子签名</div>
            <div className="content">
            <Button color='primary' fill='outline' size='small' onClick={this.handelSignatureButton}>请电子签名</Button>
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
            <Button block color='primary' size='large'>确认同意提交意向申请</Button>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  (state) => ({
    home: state.home,
    swiperBanner: state.home.swiperBanner,
  }),
)(Intention);
