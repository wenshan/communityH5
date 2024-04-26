import React, { Component } from 'react';
import './index.less';

class Commentbar extends Component {
  render() {
    const activeArr = [];
    const len = this.props.progress.length;
    for (let i = 0; i < len; i++) {
      activeArr.push(i);
    }
    const arr = [];
    for (let j = 0; j < (5 - len); j++) {
      arr.push(j);
    }
    return (
      <div className="comment-bar">
        {
          activeArr.map((item, index) => (
            <i className="iconfont icon-star active" key={index} />
          ))
        }
        {
          arr.map((item, index) => (
            <i className="iconfont icon-star" key={index} />
          ))
        }
      </div>
    );
  }
}

export default Commentbar;
