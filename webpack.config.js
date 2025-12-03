const path = require('path');

module.exports = {
  entry: './src/index.js', // seu ponto de entrada
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  mode: 'development', // 'production' para build final
  module: {
    rules: [
      // Transpila JS/JSX, incluindo fast-png
      {
        test: /\.js$/,
        include: [
          path.resolve(__dirname, 'src'),
          path.resolve(__dirname, 'node_modules/fast-png')
        ],
        use: {
          loader: 'babel-loader'
        }
      },
      // Suporte a CSS
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      // Suporte a imagens e arquivos estáticos
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: 'asset/resource'
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'public')
    },
    port: 3000,
    hot: true,
    historyApiFallback: true
  }
};
