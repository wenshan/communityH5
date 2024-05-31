import { defineConfig } from 'umi';

export default defineConfig({
  publicPath: '/',
  define: {
    'process.env': {
      NODE_ENV: 'dev'
    }
  }
});
