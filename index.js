/*!
 * Berserk-Engine
 * Copyright(c) 2019 Bruno Azoulay
 * Copyright(c) 2019 Fusengine
 * MIT Licensed
 */
const { successMessage } = require('./lib/utils')

/** Message */
successMessage('Berserk: engine Loaded. \n')

module.exports = require('./lib/berserk').engine(require('./config'))
