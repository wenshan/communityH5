import { defineConfig } from 'umi';

export default defineConfig({
  title: '畅游AI智能大世界',
  publicPath: 'https://img.dreamstep.top/community/dist/',
  define: {
    'process.env': {
      NODE_ENV: 'prod'
    }
  }
});
