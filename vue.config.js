// 2024_10_25_動作確定, これが正しいWSのhttp通信
const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: [
    'vuetify'
  ],
  devServer: {
    host: '0.0.0.0',
    allowedHosts: 'all',
  }
})



// 2024_10_25_動作確定,WSのhttps通信
// const { defineConfig } = require('@vue/cli-service')
// const fs = require('fs')
// const path = require('path')
// module.exports = defineConfig({
//   transpileDependencies: [
//     'vuetify'
//   ],
//   devServer: {
//     host: '0.0.0.0',
//     allowedHosts: 'all',
//     https: {
//       key: fs.readFileSync(path.join(__dirname, 'server.key')),
//       cert: fs.readFileSync(path.join(__dirname, 'server.crt')),
//     },
//   }
// })