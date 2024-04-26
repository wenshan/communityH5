import React from 'react';

class Floatingclick extends React.Component {
  render() {
    const { config } = this.props;
    return (
      <div className="floating-clicks">
        {config && config.map(({ offset, size, onClick }, index) => {
          const [left, top] = offset;
          const [width, height] = size;
          const style = {
            position: 'absolute',
            left: `${left / 75}rem`,
            top: `${top / 75}rem`,
            width: `${width / 75}rem`,
            height: `${height / 75}rem`,
          };
          return (
            <div
              key={index}
              style={style}
              className="click"
              onClick={onClick}
            >
              <a></a>
            </div>
          );
        })}
      </div>
    );
  }
}

export default Floatingclick;
