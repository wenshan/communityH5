import React, { Component } from 'react';
import QueryString from 'query-string';
import { Empty } from 'antd-mobile';
import Pdfh5 from "pdfh5";
import WxShare from '@/utils/wxShare';

import './pdfh5.css';
import './index.less';

class PDF extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contractPath: '',
    };
    this.pdfh5 = null;
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
    // 获取url 传参
    if (window.location && window.location.search) {
      const query = QueryString.parse(window.location.search);
      console.log(query);
      if (query && query.contractPath) {
        this.setState({
          contractPath: query.contractPath
        });
        //实例化
        this.pdfh5 = new Pdfh5("#pdf-warp", {
          pdfurl: query.contractPath,
          // cMapUrl:"https://unpkg.com/pdfjs-dist@3.8.162/cmaps/",
          // responseType: "blob" // blob arraybuffer
          });
        };
        //监听完成事件
        this.pdfh5.on("complete", function (status, msg, time) {
          console.log("状态：" + status + "，信息：" + msg + "，耗时：" + time + "毫秒，总页数：" + this.totalNum)
          //禁止手势缩放
          // this.pdfh5.zoomEnable(false);
        });
    }
  }

  render() {
    const { contractPath } = this.state;
    return (
        <div className="page">
          <div className="pdf-page">
            <div className='title'>
              <div><a href='contractPath' target='_blank'>下载当前的PDF意向协议文件</a></div>
            </div>
            <div className='content'>
              <div className='pdf-warp' id="pdf-warp"></div>
            </div>
          </div>
          </div>
    );
  }
}

export default PDF;
