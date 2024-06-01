import React, { Component } from 'react';
import Swiper from 'swiper';
import './index.less';

class Banner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: props.swiperBanner
    };
  }

  componentDidMount() {
    this.swiper();
  }

  bannerClick = (val) => {
    this.props.callback(val);
  };

  swiper = () => {
    let isAutoplay = {
      disableOnInteraction: false
    };
    // console.log(this.state.list.length);
    if (this.state.list && this.state.list.length <= 1) {
      isAutoplay = false;
    }
    const swiper = new Swiper(this.swiperID, {
      pagination: {
        el: this.paginateID,
        clickable: true
      },
      loop: true,
      autoplay: isAutoplay,
      observer: true,
      on: {
        click: () => {
          let val = this.state.list[swiper.realIndex].value || '';
          console.log('====', val);
          this.bannerClick(val);
        }
      }
    });
  };

  render() {
    const listItems =
      this.state.list &&
      this.state.list.map((item) => {
        return (
          <div className='swiper-slide' key={item.id}>
            <img src={item.src} />
          </div>
        );
      });
    return (
      <div className='banner-swiper'>
        <section className='swiper-container' ref={(self) => (this.swiperID = self)}>
          <ul className='swiper-wrapper'>{listItems}</ul>
          <div className='swiper-pagination' ref={(self) => (this.paginateID = self)} />
        </section>
      </div>
    );
  }
}

export default Banner;
