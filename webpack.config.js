const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const webpack = require('webpack');

module.exports = {
  mode: 'development', // Explicitly set the mode
  entry: './src/index.js', // Entry point for your app
  output: {
    path: path.resolve(__dirname, 'dist'), // Output directory
    filename: 'bundle.js', // Output file name
    publicPath: '/', // Ensure proper URL resolution for SPA
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/, // Handle JS/JSX files
        exclude: /node_modules/, // Exclude node_modules
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/i, // Handle CSS files
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(gif|svg|jpg|png)$/i, // Handle image files
        type: 'asset/resource', // Webpack 5 assets
        generator: {
          filename: 'assets/images/[path][name][ext]', // Output image paths
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'], // Resolve these extensions
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html', // HTML template
    }),
    new Dotenv({
      path: './.env', // Load environment variables from .env
      systemvars: true, // Include system environment variables
    }),
    new webpack.HotModuleReplacementPlugin(), // Enable HMR
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'), // Serve files from dist
    },
    compress: true, // Enable gzip compression
    port: 9000, // Port for dev server
    historyApiFallback: true, // Support SPA routing
    hot: true, // Enable Hot Module Replacement
    watchFiles: ['src/**/*'], // Watch for changes in src directory
  },
};
