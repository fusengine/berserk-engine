/*!
 * berserEngine
 * Copyright(c) 2019 Bruno Azoulay
 * Copyright(c) 2019 Fusengine
 * MIT Licensed
 */

const path = require('path')
const { app } = require('./lib/express/app')

/** Test */
// const configTest = path.resolve(__dirname, 'config.js')
// (configTest, '', '', '', '', [
// 	require('./lib/params/utils'),
// 	require('./config'),
// ])

console.log(process.env.NODE_ENV)

exports.app = app

module.exports = require('./lib')
