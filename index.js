'use strict'
/*!
 * Berserk-Engine
 * Copyright(c) 2019 Bruno Azoulay
 * Copyright(c) 2019 Fusengine
 * MIT Licensed
 */
const Utils = require('./lib/utils')
const config = require('./config')
const clear = require('clear')

/** Clear terminal */
clear()

/** Message */
Utils.successMessage(`Berserk: engine loaded mode ${Utils.ENV()} \n `)

if (Utils.ENV() === 'test') {
	module.exports = require('./lib/berserk').engine(config)
}
else {
	module.exports = require('./lib/berserk')
}
