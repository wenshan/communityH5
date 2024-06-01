import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd-mobile';
import { connect } from 'dva';

function closest(el, selector) {
  const matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;
  while (el) {
    if (matchesSelector.call(el, selector)) {
      return el;
    }
    el = el.parentElement;
  }
  return null;
}

class CommonModal extends React.Component {
  onClick = (e) => {
    if (this.props.onClick) {
      this.props.onClick(e);
    } else {
      this.showModal(this.props.name)(e);
    }
  }

  showModal = name => (e) => {
    this.props.dispatch({
      type: 'commonModal/update',
      payload: {
        name,
        value: true,
      },
    });
    e.preventDefault(); // 修复 Android 上点击穿透
  }

  onClose = name => () => {
    this.props.dispatch({
      type: 'commonModal/update',
      payload: {
        name,
        value: false,
      },
    });
  }

  onWrapTouchStart = (e) => {
    // fix touch to scroll background page on iOS
    if (!/iPhone|iPod|iPad/i.test(navigator.userAgent)) {
      return;
    }
    const pNode = closest(e.target, '.am-modal-content');
    if (!pNode) {
      e.preventDefault();
    }
  }

  getFooter = () => {
    if (this.props.footer) {
      return this.props.footer.map((item) => {
        return {
          text: item.text,
          onPress: () => {
            if (item.onPress) {
              item.onPress();
            }
            this.onClose(this.props.name)();
          },
        };
      });
    }

    if (this.props.confirmText) {
      return [{
        text: this.props.confirmText,
        onPress: () => { this.onClose(this.props.name)(); },
      }];
    }

    return [];
  }

  render() {
    const closable = this.props.closable === undefined
      ? true
      : this.props.closable;
    return (
      <div>
        <div onClick={this.onClick}>{this.props.children}</div>
        <Modal
          className={this.props.className}
          visible={this.props[this.props.name]}
          transparent
          maskClosable={false}
          onClose={this.onClose(this.props.name)}
          closable={closable}
          title={this.props.title}
          footer={this.getFooter()}
          wrapProps={{ onTouchStart: this.onWrapTouchStart }}
        >
          <div style={{ overflow: 'visible' }}>
            {this.props.content && this.props.content(this.props.name)}
          </div>
        </Modal>
      </div>
    );
  }
}

CommonModal.props = {
  name: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  // content: PropTypes.func.isRequired,
  confirmText: PropTypes.string,
  footer: PropTypes.array,
  onClick: PropTypes.func,
  className: PropTypes.string,
};

export default connect(({ commonModal, account }) => ({
  ...commonModal,
  ...account,
}))(CommonModal);
