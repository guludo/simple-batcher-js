const path = require('path')

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'simple-batcher.js',
    library: {
      name: 'Batcher',
      type: 'umd',
    },
  },
}
