import React from 'react';
import moment from 'moment';
import './index.less';

class Steps extends React.Component {
  constructor(props) {
    super(props);
    this.stepsRef = React.createRef();
  }

  componentDidMount() {
    this.drawLine();
  }

  getDOMCenter = (dom, container) => {
    const cRect = container.getBoundingClientRect();
    const rect = dom.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2 - cRect.top,
    };
  }

  getLinePoints = (container) => {
    const start = container.querySelector('.step:first-of-type .chart .circle');
    const end = container.querySelector('.step:last-of-type .chart .circle');
    const p1 = this.getDOMCenter(start, container);
    const p2 = this.getDOMCenter(end, container);
    const points = {
      start: p1,
      end: p2,
    };
    return points;
  }

  drawLine = () => {
    if (!this.props.steps || this.props.steps.length < 1) {
      return;
    }
    const container = this.stepsRef.current;
    const points = this.getLinePoints(container);

    const canvas = container.querySelector('.steps canvas');
    const ctx = canvas.getContext('2d');
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#AAAAAA';
    ctx.beginPath();
    // 加 8：和起点的圆圈保持距离，避免重合
    ctx.moveTo(points.start.x, points.start.y + 8);
    ctx.lineTo(points.end.x, points.end.y);
    ctx.closePath();
    ctx.stroke();
  }

  render() {
    return (
      <div className="steps" ref={this.stepsRef}>
        <canvas width="200px" height="1000px" />
        {
          (this.props.steps && this.props.steps.length > 0) ? (this.props.steps.map((item) => {
            return (
              <div className="step" key={item.text}>
                <div className="chart">
                  <div className="out-circle">
                    <div className="circle" />
                  </div>
                </div>
                <div className="info">
                  <div className="text">{item.text}</div>
                  <div className="date">{moment(item.date).format('YYYY-MM-DD HH:mm:ss')}</div>
                </div>
              </div>
            );
          })) : (
            <div className="empty">
              无详细信息
            </div>
          )
        }
      </div>
    );
  }
}

export default Steps;
