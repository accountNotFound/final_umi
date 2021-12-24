
export default {
  'ROOT': {
    component: '../pages/index.jsx',
    children: {
      'overview': {
        component: '../pages/overview/index.jsx',
        children: {}
      },
      'search': {
        component: '../pages/search/index.jsx',
        children: {
          '*': {
            component: '../pages/search/$id/index.jsx',
            children: {}
          }
        }
      },
      'monitor': {
        component: '../pages/monitor/index.jsx',
        children: {}
      }
    }
  }
};