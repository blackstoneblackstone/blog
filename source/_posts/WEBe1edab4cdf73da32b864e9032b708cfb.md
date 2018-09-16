
  title: 基于webpack 的 vue 多页架构
  tags: 
    - Code
  categories: 
    - Code
  comments: true
  count: 12
  date: 2018/6/13
  ---
  > 使用vue构建单页应用已经是稀松平常的事情了，但是当你遇到类似活动类需求时，每个活动相对独立，当活动达到30各以上时，长时间的构建过程会拖慢整个开发周期，而且也是不必要的。因此多页架构应运而生。

## 脚手架
github地址：`git@github.com:lihongbin100/any-page-demo.git`

## 目录结构
> page下包含多个目录，每个目录对应一个项目，都要包含main.js入口文件和app.vue主组件。

![](https://github.com/lihongbin100/any-page-demo/blob/master/doc/1528857278826.jpg?raw=true)

## 配置说明

> 多页架构最重要的就是webpack的多target配置，webpack的配置可以接收一个配置数组，从而一次性对多个项目分别打包。

- 但是如何配置需要打包哪个项目呢？

> package.json文件里有pages参数，该参数可以配置page目录下的任意一个或者多个项目，配置了哪个项目，就会打包哪个项目，注意项目名称要跟目录名相同，这样不论是上线，还是本地开发，都不需要整个项目部署，而是用到哪个就打包哪个。
```
{
  "name": "any-page-demo",
  "version": "1.0.0",
  "description": "多页面架构demo",
  "main": "app.js",
  "pages": "page1,page2",
  "scripts": {
    "update": "npm --registry=https://registry.npm.taobao.org install -E --unsafe-perm",
    "init": "npm --registry=https://registry.npm.taobao.org install -E --unsafe-perm",
    "release": "npm run clean && webpack --env=prod",
    "test": "rm -rf ./dist && webpack --env=test",
    "dev": "export NODE_ENV=development && node app.js",
    "clean": "rm -rf ./output",
    "lint": "eslint --fix 'src/**/*.vue' 'src/**/*.js'"
  },
  "pre-commit": [
    "lint"
  ],
  ------省略
}
```
- 打包的核心在于`webpack.config.js`中配置。最重要的就是下面生成webpack的配置数组。
```
process.env.npm_package_pages.split(",").forEach(
    (page) => {
      configs.push(merge(common(page), currentConfig(page)))
    }
  )
```

webpack.config.js
```
const merge = require('webpack-merge')
const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
var common = (page) => {
  return {
    entry: {
      vendor: [
        'vue',
        'cookies-js',
        'form-urlencoded',
      ],
      main: `src/page/${page}/main.js`
    },
    -------省略
}

module.exports = function (env) {
  let currentConfig = {}
  if (env == "dev") {
    currentConfig = devConfig
  }
  if (env == "test") {
    currentConfig = testConfig
  }
  if (env == "prod") {
    currentConfig = propConfig
  }
  const configs = [] //重点在这
  process.env.npm_package_pages.split(",").forEach(
    (page) => {
      configs.push(merge(common(page), currentConfig(page)))
    }
  )
  return configs
}
```
