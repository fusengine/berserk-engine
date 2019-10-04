const cookieParser = require('cookie-parser')

/** Express and param module */
const app = require('./app')
const berserkParam = require('../params').parameters

/**
 * CookieParser
 * @param {String} secretCookie define signed cookie application
 * @param {String} optionCookie define option cookie application
 */
const CookieParser = (secretCookie, optionCookie) => {
	const { secret, option } = berserkParam.cookie

	if (secretCookie && optionCookie) {
		app.use(cookieParser(secretCookie, optionCookie))
	} else {
		app.use(cookieParser(secret, option))
	}
}

module.exports = CookieParser
