const { defineConfig } = require('@vue/cli-service');
const path = require('path');

const { VantResolver } = require('unplugin-vue-components/resolvers');
const ComponentsPlugin = require('unplugin-vue-components/webpack');

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    plugins: [
      ComponentsPlugin({
        resolvers: [VantResolver()],
      }),
    ],
  },
  pluginOptions:{
    // 设置全局样式
    "style-resources-loader":{
        //指定是使用less
      preProcessor : "less",
      //指定路径（哪些less文件的内容作为全局）
      patterns:[
        path.join(__dirname,"./src/styles/variable.less")
      ]
    }
  },
  chainWebpack(config){
    // 配置svg的loader
    config.module.rules.delete("svg"); // 删除默认配置中处理svg
    config.module
      .rule('svg')
      .exclude.add(path.join(__dirname, './src/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(path.join(__dirname, './src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()
  }
})
