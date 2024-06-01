import { Link } from 'umi';
import React from 'react';
import { Button, ErrorBlock } from 'antd-mobile';
import { history } from 'umi';

export default function IndexPage() {
  const backClick = () => {
    history.push('/');
  };
  return (
    <div>
      <ErrorBlock
        status="default"
        style={{
          '--image-height': '150px',
        }}
        description={<span>页面丢失了</span>}
      >
        <Button color="primary" onClick={backClick}>
          返回主页
        </Button>
      </ErrorBlock>
    </div>
  );
}
