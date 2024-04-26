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
