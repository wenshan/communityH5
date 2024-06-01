import { defineConfig } from 'umi';

export default defineConfig({
  publicPath: 'https://img.dreamstep.top/community/dist/',
  define: {
    'process.env': {
      NODE_ENV: 'prod'
    }
  }
});
