export default {
  routes: [
    {
      path: '/intention',
      component: '@/pages/topic/index'
    },
    {
      path: '/',
      component: '@/layouts/index',
      routes: [
        /*
        {
          name: '首页',
          path: '/index.html',
          component: '@pages/home/index.jsx'
        },
        */
        {
          name: '原拆原建意向收集',
          path: '/intention2',
          component: './topic/intention/index.jsx'
        },
        /*
        {
          name: '用户中心',
          path: '/user.html',
          component: '@/pages/user'
        },
        {
          name: '关于公司',
          path: '/about.html',
          component: '@/pages/about'
        },
        {
          name: '常见问题',
          path: '/help.html',
          component: '@/pages/help'
        }
        */
      ],
    },
  ],
};
