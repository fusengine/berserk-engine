'user strict'

const morganApp = require('morgan')
const { app, berserkUtils } = require('../berserk')

/**
 * Morgan
 * @param {String} paramMorgan this param morgan to view url request
 */
const morgan = paramMorgan => {
	if (paramMorgan) {
		app.use(morganApp(paramMorgan))

		if (berserkUtils.ENV() === 'development' || berserkUtils.ENV() === 'test') {
			berserkUtils.successMessage(`Morgan: ${paramMorgan}`)
		}
	} else {
		const mode = 'dev'
		app.use(morganApp(mode))
		if (berserkUtils.ENV() === 'development' || berserkUtils.ENV() === 'test') {
			berserkUtils.successMessage(`Morgan: ${mode}`)
		}
	}
}

module.exports = morgan
