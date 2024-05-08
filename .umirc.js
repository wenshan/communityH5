import { defineConfig } from 'umi';
const path = require('path');

export default defineConfig({
  nodeModulesTransform: {
    type: 'none'
  },
  // base: '/docs/',
  // publicPath: '/static/',
  hash: true,
  antd: { mobile: false },
  // history: {
  //   type: 'hash',
  // },
  routes: [
    {
      path: '/',
      component: '@/components/layouts/index',
      routes: [
        {
          name: '首页',
          path: '/index.html',
          component: '@/pages/home/index.jsx'
        },
        {
          name: '原拆原建意向收集',
          path: '/intention.html',
          component: '@/pages/topic/intention/index.jsx'
        },
        {
          name: '原拆原建意向列表',
          path: '/intentionList.html',
          component: '@/pages/topic/intentionList/index.jsx'
        },
        {
          name: '用户中心',
          path: '/user.html',
          component: '@/pages/user'
        },
        {
          name: '关于翠苑社区',
          path: '/about.html',
          component: '@/pages/about'
        },
        {
          name: '常见问题',
          path: '/help.html',
          component: '@/pages/help'
        },
        {
          name: '闲置易物',
          path: '/mall.html',
          component: '@/pages/mall'
        }
      ]
    }
  ],
  fastRefresh: {},
  extraPostCSSPlugins: [
    require('postcss-px-to-viewport')({
      unitToConvert: 'px', // 默认值`px`，需要转换的单位
      viewportWidth: 750, //视窗的宽度，对应的是我们设计稿的宽度
      viewportHeight: 750, // 视窗的高度，根据750设备的宽度来指定，一般指定1334，也可以不配置
      unitPrecision: 3, //指定`px`转换为视窗单位值的小数位数，默认是5(很多时候无法整除)
      viewportUnit: 'vw', //指定需要转换成的视窗单位，建议使用vw
      fontViewportUnit: 'vw', //指定字体需要转换成的视窗单位，默认vw;
      selectorBlackList: [ '.ignore' ], //指定不转换为视窗单位的类
      minPixelValue: 1, // 小于或等于`1px`不转换为视窗单位
      mediaQuery: false, // 允许在媒体查询中转换`px`，默认false
      exclude: [ /node_modules/ ] //如果是regexp, 忽略全部匹配文件;如果是数组array, 忽略指定文件.
    })
  ],
  alias: {
    components: path.resolve(__dirname, 'src/components'),
    utils: path.resolve(__dirname, 'src/utils'),
    services: path.resolve(__dirname, 'src/services'),
    models: path.resolve(__dirname, 'src/models'),
    images: path.resolve(__dirname, 'src/assets')
  }
});
