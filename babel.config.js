'use strict';

module.exports = {
  presets: [
    ['@babel/preset-env'],
    "minify"
  ],
  plugins: [
    '@babel/plugin-transform-modules-commonjs',
    '@babel/plugin-transform-object-assign',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-object-rest-spread'
  ]
};