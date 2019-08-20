const logSymbols = require('log-symbols')
const colors = require('colors')

const app = require('./app')
const parameters = require('../params').parameters

/** Parameter config */
const { header: { origine, headers, method, credentials } } = parameters

/**
 * Header
 * define response header berserk
 * @param {String} origineConfig Access-Control-Allow-Origin
 * @param {String} headersConfig Access-Control-Allow-Headers
 * @param {String} methodConfig Access-Control-Allow-Methods
 * @param {Boolean} credentialsConfig Access-Control-Allow-Credentials
 */
const Header = (origineConfig, headersConfig, methodConfig, credentialsConfig) => {
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
				console.log(
					colors.cyan.bold(
						`${logSymbols.info} Headers Express conf: \n Origine: ${origineConfig} \n Headers: ${headersConfig} \n Methods: ${methodConfig} \n Credentials: ${credentialsConfig} `
					)
				)
			}
		} else {
			/** Accept request header */
			app.use((req, res, next) => {
				res.header('Access-Control-Allow-Origin', origine)
				res.header('Access-Control-Allow-Headers', headers)
				res.header('Access-Control-Allow-Methods', method)
				res.header('Access-Control-Allow-Credentials', credentials)
				next()
			})
		}
	} catch (error) {
		console.error(colors.red.bold(`${logSymbols.warning} ${error.stack}`))
	}
}

module.exports = Header
