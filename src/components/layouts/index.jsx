import React from 'react';
import Footer from '../Footer';

import './index.less';

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
