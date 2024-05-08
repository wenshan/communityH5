import React from 'react';
import wx from 'weixin-js-sdk'
import Footer from '../Footer';

import './index.less';

window.wx = wx;

export default function (props) {
  if (props.location.pathname === '/login') {
    return <div>{props.children}</div>;
  }

  return (
    <>
      {props.children}
      <div>
        <Footer></Footer>
      </div>
    </>
  );
}
