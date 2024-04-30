const API_DEV = 'http://127.0.0.1:7001/';
const API_PRO = 'https://www.dreamstep.top/';

// const API_DEV = 'https://www.dreamstep.top/';
// const API_PRO = 'https://www.dreamstep.top/';

const DEV_ENV = process.env.DEV_ENV;

const apiUrl = () => {
  let url;
  if (DEV_ENV === 'dev') {
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
