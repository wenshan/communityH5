<div className='item' key={idx}>
{/** room start 1 */}
<div className='box-warp'>
  <div className="title"><span className='required'>*</span>选择房号 {(areas && build && unit && room)? (<CheckCircleOutline color='#76c6b8' style={{ fontSize: 21 }}/>): (<CloseCircleOutline color='#999' style={{ fontSize: 21 }} />)}<div className='operate'>{(<Button color='primary' disabled={submitButtonDisabledStatusAgree} fill='outline' size='small' onClick={this.handelCascaderShowButton}>选择</Button>)}</div></div>
  <div className="content">
    {!!(areas && build && unit && room) && (<div><span>{areas}-{build}幢-{unit}单元-{room}室</span></div>)}
    <Cascader
      options={cascaderOptions}
      visible={isShowCascader}
      onClose={this.handelMaskCertificationPopup}
      onConfirm={this.handelCascaderStatusOnConfirm}
    />
  </div>
</div>
{/** room end */}
{/** name start 2 */}
<div className='box-warp'>
<div className="title"><span className='required'>*</span> 姓名：{name? (<CheckCircleOutline color='#76c6b8' style={{ fontSize: 21 }}/>): (<CloseCircleOutline color='#999' style={{ fontSize: 21 }} />)}<div className='operate'>{(<Button color='primary' disabled={submitButtonDisabledStatusAgree} fill='outline' size='small' onClick={this.handelNameShowButton}>输入</Button>)}</div></div>
  <div className="content">
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
<div className='box-warp'>
  <div className="title"><span className='required'>*</span>联系方式验证 {is_checkMobile? (<CheckCircleOutline color='#76c6b8' style={{ fontSize: 21 }}/>): (<CloseCircleOutline color='#999' style={{ fontSize: 21 }} />)}<div className='operate'>{(<Button color='primary' disabled={submitButtonDisabledStatusAgree} fill='outline' size='small' onClick={this.handelMobileShowButton}>请进行联系方式验证</Button>)}</div></div>
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
{/** mobile end */}
{/** propertyType start 4 */}
<div className='box-warp'>
  <div className='title'><span className='required'>*</span>产权类型  {propertyType? (<CheckCircleOutline color='#76c6b8' style={{ fontSize: 21 }}/>): (<CloseCircleOutline color='#999' style={{ fontSize: 21 }} />)}</div>
  <div className='content'>
    <Space>
      <Radio.Group value={String(propertyType)} disabled={submitButtonDisabledStatusAgree} onChange={this.handelPropertyTypeStatus}>
        <Space direction='vertical'>
          <Radio value='1'>个人住房</Radio>
          <Radio value='2'>企业住房</Radio>
        </Space>
      </Radio.Group>
    </Space>
  </div>
</div>
{/** propertyType end  */}
{/** owner start 5 */}
<div className='box-warp'>
  <div className='title'><span className='required'>*</span>产权人信息  {owner? (<CheckCircleOutline color='#76c6b8' style={{ fontSize: 21 }}/>): (<CloseCircleOutline color='#999' style={{ fontSize: 21 }} />)}</div>
  <div className='content'>
    <Space>
      <Radio.Group value={String(owner)} disabled={submitButtonDisabledStatusAgree} onChange={this.handelOwnerStatus}>
        <Space direction='vertical'>
          <Radio value='1'>无产权</Radio>
          <Radio value='2'>拥有产权{propertyType ==2 ? '（我是法人）': ''}</Radio>
        </Space>
      </Radio.Group>
    </Space>
  </div>
</div>
{/** owner end */}
{/** signature start 6 */}
<div className='box-warp'>
  <div className="title"><span className='required'></span>电子签名 {signatureFile? (<CheckCircleOutline color='#76c6b8' style={{ fontSize: 21 }}/>): (<CloseCircleOutline color='#999' style={{ fontSize: 21 }} />)}<div className='operate'>{(<Button color='primary' disabled={submitButtonDisabledStatusAgree} fill='outline' size='small' onClick={this.handelSignatureShowButton}>请电子签名</Button>)}</div></div>
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
{/** signature end */}
{/** feedback start 7 */}
<div className='box-warp'>
  <div className='title'><span className='required'></span>宝贵的建议<span className='des'>（可随时更新）</span> {feedback? (<CheckCircleOutline color='#76c6b8' style={{ fontSize: 21 }}/>): (<CloseCircleOutline color='#999' style={{ fontSize: 21 }} />)} <div className='operate'>{!is_submitConfirmation && (<Button color='primary' fill='outline' size='small' onClick={this.handelFeedbackStatusButton}>输入</Button>)}</div></div>
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
<div className='box-warp'>
  <div className='topic-operate'>
    <div className="submit">
      <Button loading={this.props.communityUserSubmitLoading} disabled={submitButtonDisabledStatusAgree} block color='success' size='large' onClick={this.handelSubmitContractPDF}>{is_submitConfirmation? (<>同意意愿申请已提交</>): (<>确认同意提交意愿申请</>)}</Button>
    </div>
    <div className="submit">
      <Button loading={this.props.communityUserSubmitUnwillingLoading} disabled={submitButtonDisabledStatusUnwilling} block color='warning' size='large' onClick={this.handelSubmitUnwilling}>{is_submitContractUnwilling? (<>不同意意愿申请已提交</>): (<>不同意意愿申请</>)}</Button>
    </div>
    <div className="check-info">
        <Link to="/wish.html">点击查看已提交的申请 <RightOutline /></Link>
    </div>
  </div>
</div>
{/** operate end */}
</div>
