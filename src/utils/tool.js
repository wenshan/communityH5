const Tool = {

  /**
   * 判断对象是否为空
   * @param obj
   * @return {boolean}
   */

  isEmptyObject(obj){
    let key;
    for (key in obj) {
      if (obj[key]){
        return false;
      }
    }
    return true;
  },

  /**
   * 前后去除空格
   * @param {string} s
   * @return {string}
   */
  trim(s) {
    return s.replace(/(^\s*)|(\s*$)/g, '');
  },

  /**
   * 字符串超出一定长度后替换为省略符，例如"..."
   * @param {string} str - 源字符串
   * @param {int} maxWidth - 超过的长度值
   * @param {string} replace - 用来替换的字符串
   * @return {string} 替换后的字符串
   * 中文 code 范围： U+4E00 - U+9FFFF
   */
  replaceExceedEnd(str, maxWidth = 12, replace = '...') {
    let width = 0;
    let index;

    for (let i = 0; i < (str && str.length); i++) {
      let code = str.charCodeAt(i);
      if (code >= 0x4e00 && code <= 0x9fff) {
        width += 2;
      } else {
        width += 1;
      }

      if (width > maxWidth) {
        index = i;
        break;
      }
    }

    if (index) {
      str = `${str.slice(0, index)}...`;
    }

    return str;
  },

  /**
   * 生产uuid方法
   * @return {string}
   */
  uuid() {
    const s = [];
    const hexDigits = '0123456789abcdef';
    for (let i = 0; i < 36; i++) {
      s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = '4'; // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = '-';

    const uuid = s.join('');
    return uuid;
  },

  /**
   * 对象转换成字符串，不带'?'，默认&分割
   * @class objectToString
   * @param {Object} object
   * @param {String} separator
   * @return {String}
   *
   */

  objectToString(object, separator) {
    if (!object) {
      return false;
    }
    const separa = separator || '&';
    let str = '';
    Object.keys(object).forEach((key, i) => {
      str += `${i === 0 ? '' : separa}${key}=${object[key]}`;
    });
    return str;
  },

  checkPhone(phone) {
    if (!/^1[34578]\d{9}$/.test(phone)) {
      return false;
    }
    return true;
  },

  /*
  * 格式价格
  */
  formatPrice(price, type = 2) {

    if (typeof price !== 'number' || Number.isNaN(price)) {
      return '￥0.00';
    }

    // 价格先取整数在计算
    let parseIntPrice = parseInt(price, 10);

    if (type === 0) {
      return `￥${Math.floor(parseIntPrice / 100)}`;
    }
    const num = parseIntPrice / 100;
    const f = Math.round(num * 100) / 100;
    let s = f.toString();
    let rs = s.indexOf('.');
    if (rs < 0) {
      rs = s.length;
      s += '.';
    }
    if (s.length <= rs + parseInt(type, 10)) {
      s += '00';
    }
    return `￥${s}`;
  },

  isWeiXin() {
    const ua = window.navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == 'micromessenger') {
      return true;
    }
    return false;
  },

  isMobile() {
    const u = navigator.userAgent;
    if (!!u.match(/AppleWebKit.*Mobile.*/) || u.indexOf('iPad') > -1) {
      return true;
    }
    return false;
  },

  /**
   * get search object from  query string, default to location search
   * @param search: string
   * @return search: object
   */
  getSearchObject(search) {
    search = search || window.location.search;
    const pairs = search.replace('?', '').split('&');
    const obj = {};
    for (let i = 0; i < pairs.length; i++) {
      const [key, value] = pairs[i].split('=');
      if (!obj[key]) {
        obj[key] = value;
      }
    }

    return obj;
  },

  /*
    format date for clothes detail
  */
  formatDete(val) {
    const date = new Date(val); // Mon Jul 16 2018 13:55:59 GMT+0800 (中国标准时间)
    const str = date.toLocaleString(); // "2018/7/16 下午1:55:59"
    const msString = String(date); // 'Mon Jul 16 2018 13:55:59 GMT+0800 (中国标准时间)'
    const subarr = str.split(' '); // ['2018/7/16','下午1:55:59']
    let substr = '';
    let substr1arr = subarr[0].split('/');
    substr1arr = substr1arr.map((item) => {
      if (item < 10) {
        item = `0${item}`;
      }
      return item;
    });
    const substr1 = substr1arr.join('-');
    const substr2 = msString.split(' ')[4];
    substr = `${substr1}   ${substr2}`;
    return substr;
  },
  // 判断是否是isIphoneX
  isIphoneX(){
    if (window.screen){
      return /iphone/gi.test(navigator.userAgent) && (screen.height == 812 && screen.width == 375);
    } else {
      return false;
    }
  },
};

export default Tool;
