import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { InputItem, Toast, Icon } from 'antd-mobile';
import CommonModal from '@/components/CommonModal';
import MButton from '@/components/MButton';

import './index.less';

/**
 * @inputType
 * digit: native,
 * money: virtual keyboard
 */
const inputType = 'digit';
const RESEND_TIME = 60;
let resendTime = RESEND_TIME;

class WithdrawModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      codeText: '获取验证码',
      validateError: '',
    };
  }

  initAmount = () => {
    const amount = Math.min(this.props.balance, this.props.maxWithdrawOnce);
    this.props.dispatch({
      type: 'account/update',
      payload: {
        amount,
      },
    });
  };

  initCode = () => {
    this.props.dispatch({
      type: 'account/update',
      payload: {
        code: null,
      },
    });
  };

  startWithdraw = () => {
    if (this.props.status === 1) {
      Toast.info(
        `账户资金异常已被冻结，请联系客服进行查询`,
        2,
        null,
        false,
      );
      return;
    }

    this.props
      .dispatch({
        type: 'account/queryUserOpenId',
      })
      .then((result) => {
        if (result.status === 'ok' && result.data && result.data.openId) {
          // 可以提现
          // this.initAmount();
          this.getUserData();

          this.props.dispatch({
            type: 'commonModal/update',
            payload: {
              name: 'withdraw',
              value: true,
            },
          });
          this.props.dispatch({
            type: 'account/update',
            payload: {
              amount: '',
              errorInfo: '',
              queryingWithdraw: false,
            },
          });
          this.setState({
            validateError: '',
          });
        } else {
          // 需要关注公众号
          this.props.dispatch({
            type: 'commonModal/update',
            payload: {
              name: 'officalAccount',
              value: true,
            },
          });
        }
      });
  };

  getOfficalAccountContent = () => {
    return (
      <div className="offical-account">
        <img alt="officalAccount" src="https://static-rs.msparis.com/wxleasemini_officalAccount.png" />
      </div>
    );
  }

  getWithdrawContent = () => {
    return (
      <div className="withdraw">
        <InputItem
          type={inputType}
          value={this.props.amount}
          placeholder=""
          clear
          onChange={this.updateAmount}
        />
        <div className="info">
          {
            // eslint-disable-next-line
            this.props.errorInfo ? (
              <span className="m-color">{this.props.errorInfo}</span>
            ) : this.props.withdrawInfo ? (
              <span>{this.props.withdrawInfo}</span>
            ) : (
              ''
            )
          }
        </div>
        <MButton
          mtype={this.props.amount > 0 ? '' : 'readonly'}
          onClick={this.withdraw}
        >
          提现
        </MButton>
      </div>
    );
  };

  getUserData() {
    if (!this.props.mobile) {
      this.props.dispatch({
        type: 'account/getUserData',
      });
    }
  }

  getValidateMobileContent = () => {
    const sendCode = () => {
      if (resendTime === RESEND_TIME) {
        this.props.dispatch({
          type: 'account/sendCode',
          payload: {
            mobile: this.props.mobile,
          },
        });

        this.setState({
          codeText: `${resendTime}s 后重发`,
        });

        const id = setInterval(() => {
          resendTime--;
          this.setState({
            codeText: `${resendTime}s 后重发`,
          });

          if (resendTime < 0) {
            clearInterval(id);
            this.setState({
              codeText: '重新获取',
            });

            resendTime = RESEND_TIME;
          }
        }, 1000);
      }
    };

    const normalizeCode = (value) => {
      if (!value || /^\d{1,4}$/.test(value)) {
        return value;
      }
      return this.props.code;
    };

    const updateCode = (value) => {
      value = normalizeCode(value);
      this.props.dispatch({
        type: 'account/update',
        payload: {
          code: value,
        },
      });

      this.setState({
        validateError: '',
      });
    };

    return (
      <div className="validate-mobile">
        <InputItem value={this.props.mobileDisplay} editable={false} />
        <div className="input-code">
          <InputItem
            placeholder="请输验证码"
            value={this.props.code}
            onChange={updateCode}
            clear
          />
        </div>
        <div className="send-code">
          <MButton mtype="outline nobase" size="small" onClick={sendCode}>
            {this.state.codeText}
          </MButton>
        </div>
        <div className="error m-color">{this.state.validateError}</div>
        <MButton
          mtype={
            this.props.code && this.props.code.length === 4 ? '' : 'readonly'
          }
          onClick={this.confirmWithdraw}
        >
          {
            this.props.queryingWithdraw ? (<Icon type="loading" size="xxs"></Icon>)
              : '确认提现'
          }
        </MButton>
      </div>
    );
  };

  confirmWithdraw = () => {
    if (this.props.queryingWithdraw) {
      return;
    }
    this.props
      .dispatch({
        type: 'account/confirmWithdraw',
        payload: {
          amount: this.props.amount,
        },
      }).then((result) => {
        if (!result) return;

        if (result.status === 'ok') {
          this.props.dispatch({
            type: 'commonModal/update',
            payload: {
              name: 'withdrawSuccess',
              value: true,
            },
          });
          this.props.dispatch({
            type: 'account/getAccount',
          });
          this.props.dispatch({
            type: 'commonModal/update',
            payload: {
              name: 'validateMobile',
              value: false,
            },
          });
        } else {
          this.setState({
            validateError: result.errorMsg,
          });
        }

        this.props.dispatch({
          type: 'account/update',
          payload: {
            queryingWithdraw: false,
          },
        });
      });
  };

  withdraw = () => {
    // error
    if (!this.props.amount) {
      // pass
    } else if (this.props.amount > this.props.balance) {
      this.props.dispatch({
        type: 'account/update',
        payload: {
          errorInfo: `金额不能超过可提现余额：${this.props.balance} 元`,
        },
      });
    } else {
      // success
      this.props.dispatch({
        type: 'commonModal/update',
        payload: {
          name: 'withdraw',
          value: false,
        },
      });
      this.props.dispatch({
        type: 'account/update',
        payload: {
          code: '',
        },
      });
      this.props.dispatch({
        type: 'commonModal/update',
        payload: {
          name: 'validateMobile',
          value: true,
        },
      });
    }
  };

  normalizeAmount = (v) => {
    if ((v || v === 0) && !/^(([1-9]\d*)|0)(\.\d{0,2}?)?$/.test(v)) {
      if (v === '.') {
        return '0.';
      }

      return this.props.amount;
    }

    return v;
  };

  updateAmount = (value) => {
    value = this.normalizeAmount(value);

    if (value > this.props.maxWithdrawOnce) {
      this.props.dispatch({
        type: 'account/update',
        payload: {
          errorInfo: `单次金额不能超过 ${this.props.maxWithdrawOnce}`,
        },
      });
    } else if (value > this.props.balance) {
      this.props.dispatch({
        type: 'account/update',
        payload: {
          errorInfo: `金额不能超过可提现余额：${this.props.balance}`,
        },
      });
    } else if (value && value >= 0 && value < this.props.minWithdrawOnce) {
      this.props.dispatch({
        type: 'account/update',
        payload: {
          errorInfo: `金额不能小于 ${this.props.minWithdrawOnce}`,
        },
      });
    } else {
      this.props.dispatch({
        type: 'account/update',
        payload: {
          errorInfo: '',
          amount: value,
        },
      });
    }
  };

  getWithdrawSuccessContent = (name) => {
    const close = () => {
      this.props.dispatch({
        type: 'commonModal/update',
        payload: {
          name,
          value: false,
        },
      });
    };
    return (
      <div className="withdraw-success">
        <Icon type="check-circle" size="lg" className="m-color" />
        <div className="title">提现成功</div>
        <div className="text">请于24小时内到「MSParis女神派」微信公众号对话框内领取现金红包！</div>
        <MButton mtype="outline" onClick={close}>
          我知道了
        </MButton>
      </div>
    );
  };

  render() {
    return (
      <div>
        <CommonModal
          name="withdraw"
          title="请输入提现金额（元）"
          content={this.getWithdrawContent}
          onClick={this.startWithdraw}
        >
          <MButton mtype={this.props.status === 1
            ? 'readonly'
            : ''}
          >
            {
              this.props.queryingOpenId
                ? (<Icon type="loading" size="xxs"></Icon>)
                : '提现'
            }
          </MButton>
        </CommonModal>
        <CommonModal
          name="officalAccount"
          content={this.getOfficalAccountContent}
        >
          <span></span>
        </CommonModal>
        <CommonModal
          name="validateMobile"
          content={this.getValidateMobileContent}
          {...this.state}
        >
          <span></span>
        </CommonModal>
        <CommonModal
          name="withdrawSuccess"
          content={this.getWithdrawSuccessContent}
        >
          <span></span>
        </CommonModal>
      </div>
    );
  }
}

const mapStateToProps = ({ account }) => ({
  ...account,
});

export default connect(mapStateToProps)(WithdrawModal);
