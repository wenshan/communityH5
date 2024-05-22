import { defineConfig } from 'umi';
const path = require('path');
const isDev = process.env.NODE_ENV === 'development';
export default defineConfig({
  title: '西子翠苑',
  nodeModulesTransform: {
    type: 'none'
  },
  // base: '/docs/',
  publicPath: isDev ? '/' : 'https://img.dreamstep.top/community/dist/',
  // publicPath: '/',
  // publicPath: 'https://img.dreamstep.top/community/dist/',
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
          path: '/',
          component: '@/pages/home/index.jsx'
        },
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
          name: '我的意愿',
          path: '/wish.html',
          component: '@/pages/wish/index.jsx'
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
          name: '群落',
          path: '/intentionMap.html',
          component: '@/pages/topic/intentionMap/index.jsx'
        },
        {
          name: '数据格式',
          path: '/intentionData.html',
          component: '@/pages/topic/intentionData/index.jsx'
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
  },
  chunks: [ 'echarts', 'vendors', 'antd', 'umi' ],
  chainWebpack(memo) {
    memo.optimization.splitChunks({
      chunks: 'all', //async异步代码分割 initial同步代码分割 all同步异步分割都开启
      automaticNameDelimiter: '.',
      name: true,
      minSize: 30000, // 引入的文件大于30kb才进行分割
      //maxSize: 50000, // 50kb，尝试将大于50kb的文件拆分成n个50kb的文件
      minChunks: 1, // 模块至少使用次数
      // maxAsyncRequests: 5,    // 同时加载的模块数量最多是5个，只分割出同时引入的前5个文件
      // maxInitialRequests: 3,  // 首页加载的时候引入的文件最多3个
      // name: true,             // 缓存组里面的filename生效，覆盖默认命名
      cacheGroups: {
        styles: {
          // 对样式文件进行单独拆包处理
          name: 'styles',
          test: /.(css|less)$/,
          chunks: 'async',
          minChunks: 1,
          minSize: 0,
          priority: 4, // 设置一个较高的 priority
          reuseExistingChunk: true
        },
        echarts: {
          name: 'echarts',
          test: /[\/]node_modules[\/](echarts)[\/]/,
          priority: -9,
          enforce: true
        },
        antd: {
          name: 'antd',
          test: /[\/]node_modules[\/](@ant-design|antd|antd-mobile)[\/]/,
          priority: -10,
          enforce: true
        },
        vendors: {
          name: 'vendors',
          test: /[\/]node_modules[\/]/,
          priority: -11,
          enforce: true
        }
      }
    });
  }
});
