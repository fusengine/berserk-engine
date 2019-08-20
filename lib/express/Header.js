const logSymbols = require('log-symbols')
const colors = require('colors')

const app = require('./app')
const parameters = require('../params').parameters

/** Parameter config */
const { header: { origine, headers, method, credentials } } = parameters

/**
 * 
 * @param {String} origineConfig 
 * @param {String} headersConfig 
 * @param {String} methodConfig 
 * @param {Boolean} credentialsConfig 
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
