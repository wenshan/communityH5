import React, { Component } from 'react';
import ICP from '@/components/Icp';
import WxShare from '@/utils/wxShare';

import './index.less';

class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    /** 分享 -- start */
    const initShare = new WxShare({
      friend_title: '原拆原建项目接入公众号上报数据规范',
      friend_content: '翠苑三区伙伴们，找不到具体组织，可以来这里，这里汇总翠苑三区A区、B区、C区、D区、E区、F区核心志愿者群主，后续信息都会通过各区群和公众号的方式同步给大家。',
      img_url: 'https://img.dreamstep.top/community/img/logo2.png',
      page_url: 'https://www.dreamstep.top/intentionData.html'
    });
    initShare.reset();
    /** 分享 -- end */
  }

  render() {
    return (
            <div className="page">
            <div className="data-page">
              <div class="topic-data">
                <div className='title'>原拆原建项目接入公众号上报数据规范</div>
                <div className='content'>
                  <ul>
                    <li>
                      <h3>人员要求：</h3>
                      <p>要求的人员必须是区域志愿者代表，并且在我们的《翠苑三区片区负责人》群内。现在发现好多群是原来的老群改成原拆原建全，群主也不是我们志愿者片区群里，会导致我们无法信息畅通。</p>
                    </li>
                    <li>
                      <h3>接入数据基础要求：</h3>
                      <p>1.数据以住户房号唯一性为准，接入的区域只要提供住户房号即可，例如：翠苑三区C区-28幢-1单元-701室</p>
                      <p>2.在现有的功能基础接入，3个工作日时间</p>
                      <p>3.数据表格模版：<a href="https://affiliate-traffic.oss-cn-hongkong.aliyuncs.com/community/Room_Number_Table_Template.xlsx" target='_blank'>点击下载</a></p>
                    </li>
                    <li>
                      <h3>上报后采集的数据获取：</h3>
                      <p>后续上报后采集的数据获取人员必须符合以上《人员要求》，必须签署一份数据获取协议，并且在所在区域微信群组内协议公示，协议的内容声明数据的用途和责任，并且告知区域群成员数据用途。</p>
                    </li>
                  </ul>

                </div>
              </div>
            </div>
          </div>
    );
  }
}

export default Map;
