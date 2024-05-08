// @ts-nocheck
import React from 'react';
import { ApplyPluginsType } from '/Users/hou/work/communityH5/node_modules/umi/node_modules/@umijs/runtime';
import * as umiExports from './umiExports';
import { plugin } from './plugin';

export function getRoutes() {
  const routes = [
  {
    "path": "/",
    "component": require('@/components/layouts/index').default,
    "routes": [
      {
        "name": "首页",
        "path": "/index.html",
        "component": require('@/pages/home/index.jsx').default,
        "exact": true
      },
      {
        "name": "原拆原建意向收集",
        "path": "/intention.html",
        "component": require('@/pages/topic/intention/index.jsx').default,
        "exact": true
      },
      {
        "name": "原拆原建意向列表",
        "path": "/intentionList.html",
        "component": require('@/pages/topic/intentionList/index.jsx').default,
        "exact": true
      },
      {
        "name": "我的意愿",
        "path": "/wish.html",
        "component": require('@/pages/wish/index.jsx').default,
        "exact": true
      },
      {
        "name": "用户中心",
        "path": "/user.html",
        "component": require('@/pages/user').default,
        "exact": true
      },
      {
        "name": "关于翠苑社区",
        "path": "/about.html",
        "component": require('@/pages/about').default,
        "exact": true
      },
      {
        "name": "常见问题",
        "path": "/help.html",
        "component": require('@/pages/help').default,
        "exact": true
      },
      {
        "name": "闲置易物",
        "path": "/mall.html",
        "component": require('@/pages/mall').default,
        "exact": true
      }
    ]
  }
];

  // allow user to extend routes
  plugin.applyPlugins({
    key: 'patchRoutes',
    type: ApplyPluginsType.event,
    args: { routes },
  });

  return routes;
}
