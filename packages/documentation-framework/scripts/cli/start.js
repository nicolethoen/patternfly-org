const WebpackDevServer = require('webpack-dev-server');
const webpack = require('webpack');
const clientConfig = require('../webpack/webpack.client.config');
const { generate } = require('./generate');
const { getConfig } = require('./helpers');
const { watchMD } = require('../md/parseMD');

function startWebpackDevServer(webpackConfig) {
  webpackConfig.devServer.static.publicPath = webpackConfig.output.publicPath;
  const { port } = webpackConfig.devServer;
  const compiler = webpack(webpackConfig);
  const server = new WebpackDevServer(webpackConfig.devServer, compiler);

  (async () => {
    await server.start();
    console.log(`Dev server is listening on port ${port}`);
  })();
}

async function start(options) {
  generate(options, true);
  const webpackClientConfig = await clientConfig(null, { mode: 'development', ...getConfig(options) });
  console.log('start webpack-dev-server');
  watchMD();
  startWebpackDevServer(webpackClientConfig);
}

module.exports = {
  start
};
