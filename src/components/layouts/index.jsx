import React from 'react';
import Footer from '../Footer';

import './index.less';

interface AppProps {
  value?: string;
}

export default function (props: any) {
  console.log('--------');
  console.log(props);
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
