# kagome

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

### 2024_08_16
WEBSocketsを使う時
1のterminalで　node server.jsでWebSockets起動
2のterminalで　npm run serve でApp.vue起動

### 2024_10_25
axiosでhttp,httpsを使う時
https terminal
node server.js側,  npm run start:https
Vue側              npm run serve -- --mode https
<!-- npm run start:https -->

http
node server.js側,  node server.js
Vue側,             npm run serve