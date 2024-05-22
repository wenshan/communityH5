import { defineConfig } from 'umi';

export default defineConfig({
  title: '西子翠苑',
  publicPath: 'https://img.dreamstep.top/community/dist/',
  define: {
    'process.env': {
      NODE_ENV: 'prod'
    }
  }
});
