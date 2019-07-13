const path = require('path');

module.exports = {
 entry: {
  'puzzle': path.join(__dirname, './src/index.ts'),
  'puzzle_debug': path.join(__dirname, './src/debug.ts')
 },
 mode: "production",
 output: {
  filename: "[name].min.js",
  path: path.join(__dirname, './dist'),
 },
 resolve: {
  extensions: [".ts", ".tsx", ".js"]
 },
 module: {
  rules: [
   {
    test: /\.tsx?$/,
    loader: "ts-loader"
   }
  ]
 },
};
