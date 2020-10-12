var path = require('path');

module.exports = {
  mode: 'development',
  devtool: 'source-map',
  entry: require.resolve('./entry.js'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'dist.js'
  }
};
