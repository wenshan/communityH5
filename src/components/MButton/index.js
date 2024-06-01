import React from 'react';
import { Button } from 'antd-mobile';
import './index.less';

const MButton = (props) => {
  let cls = 'base ';
  if (props.disabled) {
    cls += ' disabled';
  }

  if (props.mtype) {
    cls += ` ${props.mtype}`;
  } else {
    cls += ' simple';
  }
  return (
    <span className="mbutton">
      <Button className={cls} {...props}>{props.children}</Button>
    </span>
  );
};

export default MButton;
