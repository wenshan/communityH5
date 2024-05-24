const API_DEV = 'http://127.0.0.1:7001/';
const API_PRO = 'https://www.limeetpet.com/';

// const API_DEV = 'https://www.dreamstep.top/';
// const API_PRO = 'https://www.dreamstep.top/';

const NODE_ENV = process.env.NODE_ENV;

const apiUrl = () => {
  let url;
  if (NODE_ENV === 'development') {
    url = API_DEV;
  } else {
    url = API_PRO;
  }
  return url;
};

/* eslint-enable no-undef */

module.exports = {
  TITLE: '翠苑三区',
  API_URL: apiUrl(),
  BASE_URL: 'http://localhost:8000/',
  IMG_URL: 'http://localhost:8000',
  HEADERS: {
    'Content-Type': 'application/json'
  },
  TIMEOUT: 12000, // api超时时间
  CONSOLE: false // 打开接口日志
};
