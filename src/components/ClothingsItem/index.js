import React, { Component } from 'react';
import { Space, Tag } from 'antd-mobile';
import { router } from 'dva';
const { Link } = router;
import tool from '@/utils/tool';
import './index.less';

const together = (can_use_dots = 6, user_card_type) => (
  <Link to={{ pathname: '/index.html' }}>
    <div className='collect'>
      {can_use_dots > 0 || user_card_type === 'vip' ? (
        <div>
          <i className='iconfont icon-add' />
          去凑单
        </div>
      ) : (
        <p>
          <i className='iconfont icon-add' />
          付费添加美衣
          <br />
          <span>￥ 20.00</span>
        </p>
      )}
    </div>
    <Space />
  </Link>
);

const balance = (price) => (
  <div>
    <Space />
    <p className='balance'>
      加衣：
      <span className='price'>{tool.formatPrice(price.pay_dots_price)}</span>
    </p>
    <p className='balance'>
      合计：
      <span className='price'>{tool.formatPrice(price.total)}</span>
    </p>
    <Space size='xl' />
    <Space size='xl' />
  </div>
);

class ClothingsItem extends Component {
  render() {
    return (
      <div className='ClothingsItem-page'>
        <Space />
        <hr />
        {this.props.clothing.map((item) => (
          <div
            key={item.plan_item_id}
            onClick={() => {
              this.props.history.push(`/detail.html?id=${item.product_id}`);
            }}
          >
            <Space />
            <div className='clothing'>
              {!this.props.is_valid &&
              !item.is_valid && (
                <div className='hint-icon-box'>
                  <div className='hint-icon'>已失效</div>
                </div>
              )}
              <div className='shop-img'>
                <img src={`${item.images}!w750`} alt='' />
              </div>
              <div className='content'>
                {/* <Tag small style={{ background: '#555' }}>年卡</Tag> */}
                {item.type === 2 && (
                  <Tag small style={{ background: '#D87182' }}>
                    VIP
                  </Tag>
                )}
                <p className='title'>{item.brand}</p>
                <p className='info'>{item.name}</p>
                <p className='size'>{`${item.spu} | ${item.specification || item.specification_name}`}</p>
              </div>
              <div className='edit'>
                {item.is_pay && (
                  <p className='add-price'>
                    <i className='iconfont icon-add' />
                    {tool.formatPrice(item.product_price)}
                  </p>
                )}
                {this.props.isCard && (
                  <i
                    className='iconfont icon-delete'
                    onClick={(e) => {
                      this.props.deleteClothing(e, item.plan_item_id);
                    }}
                  />
                )}
              </div>
            </div>
            <Space />
            <hr />
          </div>
        ))}
        {this.props.user_version == 2 &&
          this.props.isCard &&
          this.props.clothing.length < 6 &&
          together(this.props.can_use_dots, this.props.user_card_type)}
        {this.props.isCard &&
          this.props.clothing.length < 5 &&
          together(this.props.can_use_dots, this.props.user_card_type)}
        {this.props.isCard &&
          this.props.clothing.length < 4 &&
          together(this.props.can_use_dots, this.props.user_card_type)}
        {this.props.isCard &&
          this.props.clothing.length < 3 &&
          together(this.props.can_use_dots, this.props.user_card_type)}
        {this.props.isCard &&
          this.props.clothing.length < 2 &&
          together(this.props.can_use_dots, this.props.user_card_type)}
        {this.props.isCard &&
          this.props.clothing.length < 1 &&
          together(this.props.can_use_dots, this.props.user_card_type)}

        {this.props.isCard && balance(this.props.price)}
      </div>
    );
  }
}

export default ClothingsItem;
