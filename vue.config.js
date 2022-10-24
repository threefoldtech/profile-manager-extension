// eslint-disable-next-line import/no-extraneous-dependencies
const webpack = require("webpack");
const { defineConfig } = require("@vue/cli-service");

module.exports = defineConfig({
  transpileDependencies: ["vuetify"],
  configureWebpack: {
    resolve: {
      fallback: {
        stream: require.resolve("stream-browserify"),
        buffer: require.resolve("buffer"),
      },
    },
    plugins: [
      new webpack.ProvidePlugin({
        Buffer: ["buffer", "Buffer"],
      }),
    ],
  },
});
