import React, { Component } from 'react';
import { Toast } from 'antd-mobile';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import {
  userCard,
  confirmUpgrade,
  cardUserCard,
} from '@/pages/couponList/service';
import './index.less';

class CouponItemDialog extends Component {
  couponDetail(range) {
    if (range.use_limit > 0 && range.discount_max_price > 0) {
      return (
        <div className="price-text">
          {`满${range.use_limit / 100}元使用`}
          <br />
          {`最高可减${range.discount_max_price / 100}元`}
        </div>
      );
    }
    if (range.use_limit > 0) {
      return (
        <div className="price-text">{`满${range.use_limit / 100}元使用`}</div>
      );
    }
    if (range.discount_max_price > 0) {
      return (
        <div className="price-text">{`最高可减${range.discount_max_price / 100}元`}</div>
      );
    }
    return (
      <div className="price-text">满任意金额使用</div>
    );
  }

  async goUse(item) {
    switch (item.method) {
      case 'buyCard':
      case 'renewalCard':
      case 'upgradeCard': {
        const rs = await userCard();
        let rsdata = rs;
        if (rsdata.status == 'ok') {
          let hascard = false;
          rsdata.data.rows.map((item) => {
            if (item.is_pay === 1) {
              hascard = true;
            }
          });
          let data = rsdata.data.rows[0];
          if (hascard) {
            if (item.method == 'buyCard') {
              Toast.info('您已是会员，请使用续费优惠券');
            } else if (item.method == 'renewalCard') {
              // tips.toast('前往会员续费页面')
              this.props.dispatch(routerRedux.push('/member.html'));
            } else if (item.method == 'upgradeCard') {
              if (data.can_upgrade != 1) {
                Toast.info('您已是VIP会员，无需升级');
              } else {
                const res = await confirmUpgrade(data.id);
                let resdata = res;
                if (resdata.status == 'ok') {
                  let data = resdata.data;
                  data['confirm_type'] = 'card_upgrade';
                  // tips.toast('前往card_confirm页');
                  this.props.dispatch(routerRedux.push('/member.html'));
                }
              }
            }
          } else {
            if (item.method == 'buyCard') {
              // tips.toast('前往开通会员页');
              this.props.dispatch(routerRedux.push('/member.html'));
            } else if (item.method == 'renewalCard' || item.method == 'upgradeCard') {
              Toast.info('您不是会员，请使用购卡优惠券');
            }
          }
        }
        break;
      }
      case 'rentDress':
        Toast.info('前往礼服日租页面');
        break;
      case 'rentDaily': {
        const res = await cardUserCard();
        let resdata = res;
        if (resdata.status == 'ok') {
          this.props.dispatch(routerRedux.push('/index.html'));
        }
        break;
      }
      case 'buyDaily':
        Toast.info('前往我的订单列表，购买页面');
        break;
      case 'renewalDaily':
        Toast.info('前往我的订单列表，续租页面');
        break;
      case 'mallSale':
        Toast.info('前往买新衣页面');
        break;
      default:
        break;
    }
  }

  render() {
    const { range, type = [], onClose } = this.props;
    return (
      <div className="CouponItemDialog-page">
        <div className="card-confirm-select">
          <div className="top-wrap">
            <i className="iconfont icon-close close" onClick={onClose} />
            {range.type == 1 && (
              <div className="price-wrap">
                <div className="price-num">
                  <div className="num">
                    {Math.floor(range.discount / 100)}
                    {range.discount % 100 > 0 && <span className="sub">{`.${range.discount % 100}`}</span>}
                    <span className="sub">元</span>
                  </div>
                </div>
                <div className="price-text">{`满${range.use_limit / 100}元使用`}</div>
              </div>
            )}
            {range.type == 2 && (
              <div className="price-wrap">
                <div className="price-num">
                  <div className="num">
                    {range.discount}
                    <span className="sub">%</span>
                  </div>
                </div>
                {this.couponDetail(range)}
              </div>
            )}
            {range.type == 3 && (
              <div className="price-wrap">
                <div className="price-num">
                  <div className="num">
                    {Math.floor(range.discount / 100)}
                    {range.discount % 100 > 0 && (
                      <font className="sub">
                        {`.${range.discount % 100}`}
                      </font>
                    )}
                    <font className="sub">元</font>
                  </div>
                </div>
                <div className="price-text">满任意金额使用</div>
              </div>
            )}
            {range.type == 4 && (
              <div className="price-wrap">
                <div className="price-num">
                  <div className="num">
                    {range.discount}
                    <font>%</font>
                  </div>
                  {range.discount_max_price > 0 && (
                    <div className="price-text">{`最高可减${range.discount_max_price / 100}元`}</div>
                  )}
                </div>
                <div className="price-text">满任意金额使用</div>
              </div>
            )}
            <div className="price-info">
              <div className="name">{range.name}</div>
              <div className="date">{`${range.from_date_show} - ${range.to_date_show}`}</div>
            </div>
          </div>
          <div className="bottom-wrap">
            <div className="description">
              {range.description || ''}
            </div>
            {type.length > 0 && <div className="title">适用范围：</div>}
            {type.length > 0 && (
              <div className="ul">
                {type.map((item, index) => (
                  <div className="li" key={index}>
                    <div>
                      <span>{item.name}</span>
                      <span onClick={() => { this.goUse(item); }} className="link">
                        去使用
                        <i className="iconfont icon-more"></i>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default connect()(CouponItemDialog);
