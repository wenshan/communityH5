import React, { Component } from 'react';
import { Modal } from 'antd-mobile';
import CouponItemDialog from '../CouponItemDialog';
import './index.less';

const couponDetail = (item) => {
  if (item.use_limit > 0 && item.discount_max_price > 0) {
    return (
      <div className="subtitle">
        满
        {item.use_limit / 100}
        元使用
        <br />
        最高可减
        {item.discount_max_price / 100}
        元
      </div>
    );
  }
  if (item.use_limit > 0) {
    return (
      <div className="subtitle">
        满
        {item.use_limit / 100}
        元使用
      </div>
    );
  }
  if (item.discount_max_price > 0) {
    return (
      <div className="subtitle">
        最高可减
        {item.discount_max_price / 100}
        元
      </div>
    );
  }
  return (
    <div className="subtitle">
      满任意金额使用
    </div>
  );
};

class CouponItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      item: '',
      all_type: [{
        id: 2,
        name: '会员购买',
        method: 'buyCard',
      }, {
        id: 3,
        name: '会员续费',
        method: 'renewalCard',
      }, {
        id: 5,
        name: '礼服租赁',
        method: 'rentDress',
      }, {
        id: 6,
        name: '常服租赁',
        method: 'rentDaily',
      }, {
        id: 7,
        name: '常服购买',
        method: 'buyDaily',
      }, {
        id: 8,
        name: '常服续租',
        method: 'renewalDaily',
      }, {
        id: 11,
        name: '会员升级',
        method: 'upgradeCard',
      }, {
        id: 12,
        name: '新衣购买',
        method: 'mallSale',
      }],
      type: [],
    };
  }

  type() {
    if (this.state.item != '' && this.state.item.use_range && this.state.item.use_range.length > 0) {
      const res = [];
      Array.from(this.state.item.use_range).forEach((item) => {
        if (item == 1) {
          // res = this.state.all_type;
          res.push(this.state.all_type[0]);
          res.push(this.state.all_type[1]);
          res.push(this.state.all_type[3]);
          res.push(this.state.all_type[6]);
        } else {
          switch (item){
            case 2:
              res.push(this.state.all_type[0]);
              break;
            case 3:
              res.push(this.state.all_type[1]);
              break;
            // case 5:
            //   res.push(this.state.all_type[2]);
            //   break;
            case 6:
              res.push(this.state.all_type[3]);
              break;
            // case 7:
            //   res.push(this.state.all_type[4]);
            //   break;
            // case 8:
            //   res.push(this.state.all_type[5]);
            //   break;
            case 11:
              res.push(this.state.all_type[6]);
              break;
            // case 12:
            //   res.push(this.state.all_type[7]);
            //   break;
            default:
              break;
          }
        }
      });
      return res;
    }
    return [];
  }

  onClose = key => () => {
    this.setState({
      [key]: false,
    });
  }


  chose = (props, item) => {
    if (!this.props.select && item.is_available !== 0 && item.is_use !== 1 && item.status !== 2) {
      this.setState({
        modal: true,
        item,
      });
      setTimeout(() => {
        this.setState({
          type: this.type(),
        });
      });
    } else if (props.chose && props.select) {
      props.chose(item);
    }
  };

  render() {
    return (
      <div className="CouponItem-page">
        <Modal
          visible={this.state.modal}
          wrapClassName="couponWrap"
          transparent
          onClose={this.onClose('modal')}
          wrapProps={{ onTouchStart: this.onWrapTouchStart }}
        >
          <CouponItemDialog range={this.state.item} type={this.state.type} onClose={this.onClose('modal')} />
        </Modal>
        {this.props.list.map((item, index) => (
          <div className="coupon-list" key={index} onClick={() => { this.chose(this.props, item); }}>
            {(item.is_available == 0 || item.is_use == 1 || item.status == 2) && (
              <img className="coupon-img" src="https://static-rs.msparis.com/uploads/f/6/f670d4c362d5599616bc49ca18e00e61.png" alt="" />
            )}
            {!(item.is_available == 0 || item.is_use == 1 || item.status == 2) && (
              <img className="coupon-img" src="https://static-rs.msparis.com/uploads/a/9/a919a01771dbf812acbd55f1fdb7826b.png" alt="" />
            )}
            {Number(item.id) === Number(this.props.couponId) && <img className="chose-img" src="http://static-r.msparis.com/uploads/f/c/fca7568bb2fc244975b3e25d08577293.png" alt="" />}
            {item.type === 1 && (
              <div className="left">
                <div className="title minux">
                  {Math.floor(item.discount / 100)}
                  {item.discount % 100 > 0 && (
                    <font className="sub">{`.${item.discount % 100}`}</font>
                  )}
                  <font className="sub">元</font>
                </div>
                <div className="subtitle">
                  满
                  {item.use_limit / 100}
                  元使用
                </div>
              </div>
            )}
            {item.type === 2 && (
              <div className="left">
                <div className="title minux">
                  {item.discount}
                  <font>%</font>
                </div>
                {couponDetail(item)}
              </div>
            )}
            {item.type === 3 && (
              <div className="left">
                <div className="title minux">
                  {Math.floor(item.discount / 100)}
                  {item.discount % 100 > 0 && (
                    <font className="sub">{`.${item.discount % 100}`}</font>
                  )}
                  <font>元</font>
                </div>
                <div className="subtitle">满任意金额使用</div>
              </div>
            )}
            {item.type === 4 && (
              <div className="left">
                <div className="title minux">
                  {item.discount}
                  <font>%</font>
                </div>
                {item.discount_max_price > 0 && (
                  <div className="subtitle">
                    {`最高可减${item.discount_max_price / 100}元`}
                  </div>
                )}
                <div className="subtitle">满任意金额使用</div>
              </div>
            )}
            <div className="right">
              <div className="content">
                <div className="title">{item.name}</div>
                <div className="time">{`${item.from_date_show}-${item.to_date_show}`}</div>
              </div>
            </div>
            {!this.props.select && item.is_available === 0 && <div className="pull-right used">不可用</div>}
            {!this.props.select && item.is_use === 1 && <div className="pull-right used">已使用</div>}
            {!this.props.select && item.status === 2 && <div className="pull-right used">已过期</div>}
            {!this.props.select && item.is_available !== 0 && item.is_use !== 1 && item.status !== 2 && (
              <div className="pull-right">
                详情
                <i className="iconfont icon-more" />
              </div>
            )}
            {this.props.select && (item.is_available == 0 || item.is_use == 1 || item.status == 2) && (
              <div className="pull-right used">不可用</div>
            )}
            <div className="bottom ellipsis">
              {item.description}
            </div>
          </div>
        ))}
      </div>
    );
  }
}

export default CouponItem;
