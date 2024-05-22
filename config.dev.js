import { defineConfig } from 'umi';

export default defineConfig({
  title: '西子翠苑',
  publicPath: '/',
  define: {
    'process.env': {
      NODE_ENV: 'dev'
    }
  }
});
