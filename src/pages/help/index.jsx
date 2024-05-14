import React, { Component } from 'react';
import { connect } from 'umi';
import { TabBar, Badge, Space, Grid, List, Toast } from 'antd-mobile';
import { routerRedux } from 'dva/router';
import WxShare from '@/utils/wxShare';

import './index.less';

const Item = List.Item;
const Brief = Item.Brief;

class Help extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  gotoPage = (val) => {
    if (val){
      this.props.dispatch(routerRedux.push(val));
    }
  }

  componentDidMount() {
    /** 分享 -- start */
    const initShare = new WxShare();
    initShare.reset();
    /** 分享 -- end */
  }

  render() {
    return (
      <div className="page">
        <div className="help-page">
          <div className='logo'>
            <img src='https://img.dreamstep.top/community/img/logo2.png' />
          </div>
          <div class="topic-statement">
            <div className='title'>声明</div>
            <div className='content'>
              <div className='text'>
                <ul>
                  <li>
                    <h5>1. 数据安全和个人隐私</h5>
                    <div>
                      <p>- 我个人 和 翠苑三区自主更新委员会(筹) 所有成员承诺在法律的基础上严格保护数据和用户隐私，即使项目失败及时销毁。</p>
                      <p>- 数据使用是方便推动共同愿景的执行和落地，并且数据使用过程中会公示在 翠苑三区自主更新委员会(筹) 群并通过 翠苑三区自主更新委员会(筹) 同意。</p>
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

export default Help;
