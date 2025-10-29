const { defineConfig } = require("@vue/cli-service");
const MonacoEditorWebpackPlugin = require("monaco-editor-webpack-plugin");
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')
const path = require("path");
module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
  },
  // chainWebpack(config){
  //   config.plugin(new MonacoEditorWebpackPlugin({}))
  // },
  // configureWebpack: {
  //   plugins: [
  //     new MonacoWebpackPlugin()
  //   ]
  // },
});
