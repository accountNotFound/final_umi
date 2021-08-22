
// ref: https://umijs.org/config/
export default {
  treeShaking: true,
  // routes: [
  //   {
  //     path: '/',
  //     component: '../layouts',
  //     routes: [
  //       {
  //         path: '/', component: 'overview'
  //       },
  //       {
  //         path: 'overview', component: 'overview'
  //       },
  //       {
  //         path: 'search', component: 'search',
  //       },
  //       {
  //         path: 'monitor', component: 'monitor'
  //       },
  //     ]
  //   }
  // ],
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    ['umi-plugin-react', {
      antd: true,
      dva: false,
      dynamicImport: false,
      title: 'final_umi',
      dll: false,

      routes: {
        exclude: [
          /components\//,
        ],
      },
    }],
  ],
  proxy: {
    '/api': {
      target: 'http://127.0.0.1:8080',
      changeOrigin: true,
      pathRewrite: {
        '^/api': ''
      }
    }
  }
}
