import React from 'react';
import ReactDOM from 'react-dom';

// Ref: https://underscorejs.org/
// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
function debounce (func, wait, immediate) {
  let timeout,
    args,
    context,
    timestamp,
    result;

  const later = function () {
    const last = new Date().getTime() - timestamp;

    if (last < wait && last >= 0) {
      timeout = setTimeout(later, wait - last);
    } else {
      timeout = null;
      if (!immediate) {
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      }
    }
  };

  return function (..._args) {
    args = _args;
    context = this;
    timestamp = new Date().getTime();
    const callNow = immediate && !timeout;
    if (!timeout) timeout = setTimeout(later, wait);
    if (callNow) {
      result = func.apply(context, args);
      context = args = null;
    }

    return result;
  };
}

const withScrollToBottom = (WrappedComponent, config) => {
  const {
    onScrollToBottom,
    shouldEnd,
    container,
    target,
  } = config;

  return class extends React.Component {
    constructor(props) {
      super(props);
      this.prevPos = 0;
      this.touchPos = 0;
      this.touchDown = false;
      this.container = container || window;
      this.onScrollToBottom = debounce(onScrollToBottom, 100);
    }

    onScrollDown = (event) => {
      console.log('down');
      // const curPos = body.scrollTop + body.clientHeight;
      let curPos,
        scrollHeight;
      if (container === window) {
        curPos = window.pageYOffset + document.body.offsetHeight;
        scrollHeight = document.body.scrollHeight;
      } else {
        curPos = this.container.scrollTop + this.container.clientHeight;
        scrollHeight = this.container.scrollHeight;
      }

      if ((curPos > this.prevPos || this.touchDown)
        && (curPos > scrollHeight - 1)) {
        if (!shouldEnd || !shouldEnd(this.props)) {
          console.log('to bottom');
          this.prevPos = curPos;
          this.onScrollToBottom(this.props);
        }
      }
    }

    onTouchstart = (event) => {
      this.touchDown = false;
      this.touchStart = event.changedTouches[0].pageY;
    }

    onTouchend = (event) => {
      this.touchEnd = event.changedTouches[0].pageY;
      this.touchDown = this.touchEnd < this.touchStart;
    }

    onTouchmove = (event) => {
      const curTouchPos = event.touches[0].pageY;
      this.touchDown = curTouchPos < this.touchPos;
      this.touchPos = curTouchPos;
    }

    componentDidMount() {
      if (this.container === 'self') {
        this.container = ReactDOM.findDOMNode(this);
      }
      const container = this.container;
      container.addEventListener('scroll', this.onScrollDown);
      container.addEventListener('touchmove', this.onTouchmove);
      container.addEventListener('touchstart', this.onTouchstart);
      container.addEventListener('touchend', this.onTouchend);
    }

    componetWillUnmount() {
      const container = this.container;
      container.removeEventListener('scroll', this.onScrollDown);
      container.removeEventListener('touchmove', this.onTouchmove);
      container.removeEventListener('touchstart', this.onTouchstart);
      container.removeEventListener('touchend', this.onTouchend);
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  };
};

export default withScrollToBottom;
