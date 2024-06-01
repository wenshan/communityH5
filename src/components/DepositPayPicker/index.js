import React, { Component } from 'react';
import { connect } from 'dva';
import { Toast, Button, Space, InputItem, Picker, Modal, Icon } from 'antd-mobile';
import Store from 'store2';
import PropTypes from 'prop-types';
import { Tool } from '../../utils/index';
import './index.less';

class DepositPayPicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deposit_type: 'zhima',
      visible: false // modal 是否可见
    };
  }

  // 选择押金类型
  selectDepositType = (item) => {
    if (typeof this.props.callback == 'function' && item) {
      this.props.callback(item, false, 'close');
    }
  };

  onClose = () => {
    const depositList = this.props.deposit_list;
    let itemValue;
    depositList.map((item) => {
      if (item.deposit_type == this.state.deposit_type) {
        itemValue = item;
      }
    });

    this.setState(
      {
        visible: false
      },
      () => {
        if (typeof this.props.callback == 'function' && itemValue) {
          this.props.callback(itemValue, false, 'close');
        }
      }
    );
  };

  listHtmlRender = () => {
    const { deposit_list, deposit_type } = this.props;
    // console.log(deposit_type);
    const list = [];
    const html = '';

    deposit_list.map((item) => {
      let iconClass = `icon-${item.deposit_type}`;
      if (item.deposit_type == deposit_type) {
        list.push(
          <li
            onClick={() => {
              this.selectDepositType(item);
            }}
            className='list'
            key={item.deposit_type}
          >
            <span className={iconClass} />
            <div className='wrap-box'>
              <span className='title'>{item.title}</span>
              <span className='description'>{item.description}</span>
            </div>
            <span className='icon-state selected'>
              <Icon type='check-circle' size='sm' />
            </span>
          </li>
        );
      } else {
        list.push(
          <li
            onClick={() => {
              this.selectDepositType(item);
            }}
            className='list'
            key={item.deposit_type}
          >
            <span className={iconClass} />
            <div className='wrap-box'>
              <span className='title'>{item.title}</span>
              <span className='description'>{item.description}</span>
            </div>
            <span className='icon-state'>
              <Icon type='cross-circle' size='sm' />
            </span>
          </li>
        );
      }
    });
    return list;
  };

  componentWillReceiveProps(nextProps) {
    //  console.log(nextProps.deposit_type);
  }

  componentDidMount() {}

  render() {
    let visible = this.props.visible;
    if (this.props.deposit_list.length > 0) {
      visible = this.props.visible;
    } else {
      visible = false;
    }
    // console.log(this.props.deposit_type);
    return (
      <div className='deposi-pay-picker'>
        <Modal
          closable={true}
          popup={true}
          visible={visible}
          onClose={this.onClose}
          animationType='slide-up'
          className='deposi-pay'
          wrapClassName='deposi-pay'
        >
          <div className='deposi-pay-picker'>
            <div className='mian-tile'>
              <div className='label'>选择押金方式</div>
            </div>
            <ul>{this.listHtmlRender()}</ul>
          </div>
        </Modal>
      </div>
    );
  }
}

DepositPayPicker.defaultProps = {
  deposit_list: [
    {
      title: '芝麻信用免押',
      label: '芝麻信用免押',
      value: 'zhima',
      description: '信用分600分及以上，有机会免交会员使用押金',
      pic: 'http://static-t.msparis.com/deposit/zhima.png',
      is_default: 1,
      price: 10000,
      deposit_type: 'zhima'
    },
    {
      title: '现金押金￥100.00',
      label: '现金押金￥100.00',
      value: 'cash',
      description: '押金将在会员到期且归还租赁美衣后原路返还',
      pic: 'http://static-t.msparis.com/deposit/cash.png',
      deposit_type: 'cash',
      price: 10000,
      is_default: 0
    }
  ],
  deposit_type: 'zhima',
  deposit_title: '芝麻信用免押',
  card_deposit: 10000,
  is_defered: 0, // 1 后置 0 不后置
  visible: false
};

DepositPayPicker.propTypes = {
  deposit_list: PropTypes.array,
  deposit_type: PropTypes.string,
  deposit_title: PropTypes.string,
  is_defered: PropTypes.number,
  card_deposit: PropTypes.number,
  visible: PropTypes.bool
};

export default DepositPayPicker;
