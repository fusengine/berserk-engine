const { app } = require('../berserk')
const { errorMessage, successMessage } = require('../utils')

/**
 * Header
 * define response header berserk
 * @param {String} origineConfig Access-Control-Allow-Origin
 * @param {String} headersConfig Access-Control-Allow-Headers
 * @param {String} methodConfig Access-Control-Allow-Methods
 * @param {Boolean} credentialsConfig Access-Control-Allow-Credentials
 */
module.exports = headers = (origineConfig, headersConfig, methodConfig, credentialsConfig) => {
	try {
		if (origineConfig && headersConfig && methodConfig && credentialsConfig) {
			/** Accept request header */
			app.use((req, res, next) => {
				res.header('Access-Control-Allow-Origin', origineConfig)
				res.header('Access-Control-Allow-Headers', headersConfig)
				res.header('Access-Control-Allow-Methods', methodConfig)
				res.header('Access-Control-Allow-Credentials', credentialsConfig)
				next()
			})

			if (process.env.NODE_ENV === 'development') {
				successMessage(`Headers:	loaded to config.js.`)
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
		errorMessage(`Headers error:	${error.stack}`)
	}
}
