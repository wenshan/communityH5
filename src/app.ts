// 运行时配置文件，可以在这里扩展运行时的能力，比如修改路由、修改 render 方法等。
// 比如在微前端里动态修改渲染根节点：
// let isSubApp = false;
// export function modifyClientRenderOpts(memo) {
//   return {
//     ...memo,
//     rootElement: isSubApp ? 'sub-root' : memo.rootElement,
//   };
// }
// 修改路由。
//  比如在最前面添加一个 /foo 路由
// export function patchRoutes({ routes }) {
//   routes.unshift({
//     path: '/foo',
//     exact: true,
//     component: require('@/extraRoutes/foo').default,
//   });
// }
// onRouteChange({ routes, matchedRoutes, location, action })
// 在初始加载和路由切换时做一些事情。

// 比如用于做埋点统计，

// export function onRouteChange({ location, routes, action }) {
//   bacon(location.pathname);
// }
// 比如用于设置标题，

// export function onRouteChange({ matchedRoutes }) {
//   if (matchedRoutes.length) {
//     document.title = matchedRoutes[matchedRoutes.length - 1].route.title || '';
//   }
// }
