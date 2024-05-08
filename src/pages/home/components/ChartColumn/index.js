import React, { Component } from 'react';
import ReactECharts from 'echarts-for-react';
import './index.less';

class ChartColumn extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  getOption = () => {
    return {
      xAxis: {
        type: 'category',
        data: [ '1', '2', '3', '4', '5', '6', '7' ]
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: [ 120, 200, 150, 80, 70, 110, 130 ],
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
