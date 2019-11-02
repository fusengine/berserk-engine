'use strict'

const { app, berserkUtils } = require('../berserk')

/**
 * Header
 * define response header berserk
 * @param {String} origine Access-Control-Allow-Origin
 * @param {String} headers Access-Control-Allow-Headers
 * @param {String} method Access-Control-Allow-Methods
 * @param {Boolean} credentials Access-Control-Allow-Credentials
 */
const headers = (origine, headers, method, credentials) => {
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

			if (berserkUtils.ENV() === 'development' || berserkUtils.ENV() === 'test') {
				berserkUtils.successMessage(`Headers: loaded to config.js.`)
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
		berserkUtils.errorMessage(`Headers error: ${error.stack}`)
	}
}

module.exports = headers
