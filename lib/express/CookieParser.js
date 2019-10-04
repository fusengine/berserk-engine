const cookieParser = require('cookie-parser')

/** Express and param module */
const app = require('./app')
const berserkParam = require('../params').parameters

/**
 * CookieParser
 * @param {String} secretCookie define signed cookie application
 */
const CookieParser = secretCookie => {
	const { secretCookieKey } = berserkParam

	if (secretCookie) {
		app.use(cookieParser(secretCookie))
	} else {
		app.use(cookieParser(secretCookieKey))
	}
}

module.exports = CookieParser
