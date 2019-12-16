'user strict'
const morganApp = require('morgan')

/** define var to use dynamic  to access app*/
let app
let Utils

/** Express Port 
 * @param _app define app express
 * @param _utils Define utils var
 */
module.exports = (_app, _utils) => {
	app = _app
	Utils = _utils

	// Return Port
	return Morgan
}

/**
 * Morgan
 * @param {String} paramMorgan this param morgan to view url request
 */
const Morgan = paramMorgan => {
	if (paramMorgan) {
		app.use(morganApp(paramMorgan))

		if (Utils.ENV() === 'development' || Utils.ENV() === 'test') {
			Utils.successMessage(`Morgan: ${paramMorgan}`)
		}
	} else {
		const mode = 'dev'
		app.use(morganApp(mode))
		if (Utils.ENV() === 'development' || Utils.ENV() === 'test') {
			Utils.successMessage(`Morgan: ${mode}`)
		}
	}
}
