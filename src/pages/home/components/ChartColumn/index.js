import React, { Component } from 'react';
import ReactECharts from 'echarts-for-react';
import './index.less';

class ChartColumn extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  getOption = () => {
    const { value, days } = this.props.data;
    return {
      xAxis: {
        type: 'category',
        data: days
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: value,
          type: 'bar'
        }
      ]
    };
  };

  componentDidMount() {}

  render() {
    return (
      <div className='chart-column'>
        <ReactECharts option={this.getOption()} />
      </div>
    );
  }
}

export default ChartColumn;
