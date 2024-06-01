import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './index.less';

class GoodsList extends Component {
  static propTypes ={
    list: PropTypes.array.isRequired,
  }

  gotoDetail = (e, id) => {
    e.stopPropagation();
    const url = `/detail.html?id=${id}`;
    // console.log(url);
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    this.props.history.push(url);
  }

  getTagText = (item) => {
    let limit_tag_text;
    // VIP和年卡同时存在 显示VIP年卡
    // 金卡与VIP同时存在 不显示VIP
    // 轻奢精选与季节限定同时存在 不显示季节限定
    if (item.limit_tag_ids && item.limit_tag_ids.length > 0) {
      let vipTag = ''; // vip卡
      let yearTag = ''; // 年卡
      let goldTag = ''; // 金卡
      let sVipTag = ''; // 轻奢精选
      let seasonTag = ''; // 季节限定
      item.limit_tag_ids.map((tag) => {
        switch (tag.id) {
          case 0:
            if (!goldTag) {
              vipTag = tag.name;
            }
            break;
          case 1:
            yearTag = tag.name;
            break;
          case 2:
            goldTag = tag.name;
            vipTag = '';
            break;
          case 3:
            sVipTag = tag.name;
            seasonTag = '';
            break;
          case 4:
            if (!sVipTag) {
              seasonTag = tag.name;
            }
            break;
          default:
            break;
        }
      });
      limit_tag_text = `${vipTag}${yearTag} ${goldTag} ${sVipTag} ${seasonTag}`;
    }
    return limit_tag_text;
  }

  render() {
    let list = JSON.parse(JSON.stringify(this.props.list));
    return (
      <div className="goods-list-container">
        {
        list.length > 0 ? (
          <div className="goods-ul">
            {
              list.map((item, index) => (
                <div key={index} className="goods-li" onClick={e => this.gotoDetail(e, item.id)}>
                  <div className="pos">
                    <div className="img-container">
                      <img src={item.cover_image ? `${item.cover_image}!w750` : 'http://static-r.msparis.com/uploads/d/1/d1ca37e902e5550ad2c82c721bc216ce.png'} alt="" />
                    </div>
                    {
                      item.mode_id == 3 && (item.enabled != 1 || item.sale_stock == 0) && (
                        <div className="sold-out">
                          <div className="sales-end">已售罄</div>
                        </div>
                      )
                    }
                    {
                      item.enabled && item.enabled != 0 && item.enabled != 1 && item.enabled != 2 && (
                        <div className="unable">
                          <div className="sales-end">下架</div>
                        </div>
                      )
                    }
                  </div>
                  <div className="zan-capsule">
                    {/* {item.type_id == 2 && item.mode_id == 1 && <div className="zan-capsule__left">VIP</div>}
                    {item.limit_tag && item.limit_tag != '' && <div className="zan-capsule__center">{item.limit_tag.slice(0, 2)}</div>} */}
                    {/* {item.market_price > 0 && (
                      <div className="zan-capsule__right">
                        参考价¥
                        {item.market_price / 100}
                      </div>
                    )} */}
                  </div>
                  <span className="dark">{item.brand}</span>
                  <span className="name">{item.name}</span>
                  {item.limit_tag_ids && item.limit_tag_ids.length > 0 && (
                    <span className="tags">{this.getTagText(item)}</span>
                  )}
                  {item.limit_tag_ids && item.limit_tag_ids.length > 0 && item.market_price > 0 && <span className="tags"> | </span>}
                  {item.market_price > 0 && (
                    <span className="tags">
                      参考价¥
                      {item.market_price / 100}
                    </span>
                  )}
                </div>
              ))
            }
          </div>
        ) : (
          <div />
        )
      }
      </div>
    );
  }
}

export default GoodsList;
