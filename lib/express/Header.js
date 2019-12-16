'use strict'

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

	// Return Const
	return Headers
}

/**
 * Header
 * define response header berserk
 * @param {String} origine Access-Control-Allow-Origin
 * @param {String} headers Access-Control-Allow-Headers
 * @param {String} method Access-Control-Allow-Methods
 * @param {Boolean} credentials Access-Control-Allow-Credentials
 */
const Headers = (origine, headers, method, credentials) => {
	try {
		if (origine && headers && method && credentials) {
			/** Accept request header */
			app.use((req, res, next) => {
				res.header('Access-Control-Allow-Origin', origine)
				res.header('Access-Control-Allow-Headers', headers)
				res.header('Access-Control-Allow-Methods', method)
				res.header('Access-Control-Allow-Credentials', credentials)
				next()
			})

			if (Utils.ENV() === 'development' || Utils.ENV() === 'test') {
				Utils.successMessage(`Headers: loaded to config.js.`)
			}
		} else {
			/** Accept request header */
			app.use((req, res, next) => {
				res.header('Access-Control-Allow-Origin', '*')
				res.header(
					'Access-Control-Allow-Headers',
					'Origin, X-Requested-With, Content-Type, Accept, token'
				)
				res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS')
				res.header('Access-Control-Allow-Credentials', true)
				next()
			})
		}
	} catch (error) {
		Utils.errorMessage(`Headers error: ${error.stack}`)
	}
}
