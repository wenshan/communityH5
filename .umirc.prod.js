import { defineConfig } from 'umi';

export default defineConfig({
  title: '西子翠苑生活服务',
  publicPath: 'https://img.dreamstep.top/community/dist/',
  define: {
    'process.env': {
      NODE_ENV: 'prod'
    }
  }
});
