const path = require('path');
// @ts-ignore
var WebpackObfuscator = require('webpack-obfuscator');
var CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/game.js',
  output: {
    filename: 'game.js',
    path: path.resolve(__dirname, 'docs'),
  },

  // webpack plugins array
    plugins: [
        new WebpackObfuscator ({
            rotateStringArray: true
        }),
        new CopyPlugin({ 
            patterns: [
              { from: './assets/**/*' },
              { from: './css/**/*' },
              { from: './lib/**/*' },
              { from: './fonts/**/*' },
            ],
         }),
    ]
};