const path = require('path');
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const isProduction = process.env.NODE_ENV != "development";

module.exports = {
  entry: './src/lib/painter.ts',
  mode: isProduction ? "production" : "development",
  // target: "node",
  watch: !isProduction,
  devtool: false,
  module: {
    rules: [
      {
        test: /(?<!\.spec)\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js' ],
  },
  output: {
    filename: 'lib/painter.js',
    // see https://webpack.js.org/configuration/output/#module-definition-systems
    libraryTarget: "commonjs2",
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    isProduction && new CleanWebpackPlugin()
  ].filter(Boolean)
};
