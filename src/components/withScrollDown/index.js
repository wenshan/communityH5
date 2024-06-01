import React from 'react';

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

const withScrollDown = (WrappedComponent, onScrollDown, continueEvent) => {
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.prevPos = 0;
      this.touchPos = 0;
      this.touchDown = false;
      this.container = window;
      this.target = document.body;
      this.onScrollDown = debounce(onScrollDown, 100);
    }

    onScrollToBottom = (event) => {
      // const curPos = body.scrollTop + body.clientHeight;
      const curPos = window.pageYOffset + this.target.offsetHeight;

      if ((curPos > this.prevPos || this.touchDown)
        && (curPos > this.target.scrollHeight - 1)) {
        if (continueEvent && continueEvent(this.props)) {
          this.prevPos = curPos;
          this.onScrollDown(this.props);
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
      const container = this.container;
      container.addEventListener('scroll', this.onScrollToBottom);
      container.addEventListener('touchmove', this.onTouchmove);
      container.addEventListener('touchstart', this.onTouchstart);
      container.addEventListener('touchend', this.onTouchend);
    }

    componetWillUnmount() {
      const container = this.container;
      container.removeEventListener('scroll', this.onScrollToBottom);
      container.removeEventListener('touchmove', this.onTouchmove);
      container.removeEventListener('touchstart', this.onTouchstart);
      container.removeEventListener('touchend', this.onTouchend);
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  };
};

export default withScrollDown;
