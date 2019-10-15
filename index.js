/*!
 * berserEngine
 * Copyright(c) 2019 Bruno Azoulay
 * Copyright(c) 2019 Fusengine
 * MIT Licensed
 */

const path = require('path')
const configTest = path.resolve(__dirname, 'config.js')

console.log(process.env.NODE_ENV)

module.exports = require('./lib')
