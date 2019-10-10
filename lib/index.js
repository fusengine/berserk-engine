const colors = require('colors')
const logSymbols = require('log-symbols')

/** Express Module */
const {
	Port,
	Header,
	Urlencoded,
	Morgan,
	Errors,
	Route,
	ViewEngine,
	StaticFiles,
	CookieParser,
	Session,
	PoweredBy,
} = require('./express')

const MongoDb = require('./database/mongodb/MongoDb')

/**
 * berserkEngine
 * @param {String} configPath link to config if you want custom your configuration
 */

/**
  * berserkEngine
  * @param {String} configPath Link config file
  * @param {String} apiPath define api route path
  * @param {String} webPath define web route path
  * @param {String} viewPAth define view  path
  */
module.exports = berserkEngine = (configPath, apiPath, webPath, viewPath) => {
	try {
		console.log(colors.blue.bold(`${logSymbols.success} Express: Loaded`))

		if (configPath) {
			const {
				port,
				header,
				urlEncoded,
				morganOption,
				mongoConfig,
				viewExtension,
				cookieParserSecretKey,
				assets,
				sessionOption,
			} = require(`${configPath}`)

			PoweredBy()
			/** mongo configuration */
			if (mongoConfig) mongoConfigObj = Object.values(mongoConfig)
			MongoDb(...mongoConfigObj)

			/** if have variable to option files */
			if (viewExtension) viewExtension
			ViewEngine(viewExtension, viewPath)

			if (urlEncoded) urlEncoded
			urlEncoded ? Urlencoded(urlEncoded) : Urlencoded()

			if (header) headerObj = Object.values(header)
			header ? Header(...headerObj) : Header()

			if (assets) assetsObj = Object.values(assets)
			StaticFiles(...assetsObj)

			if (morganOption) morganOption
			morganOption ? Morgan(morganOption) : Morgan()

			if (cookieParserSecretKey) cookieParserSecretKey
			cookieParserSecretKey ? CookieParser(cookieParserSecretKey) : CookieParser()

			if (sessionOption) sessionOption
			Session(sessionOption)

			Route(apiPath, webPath)

			Errors()

			port ? Port(port) : Port()
		} else {
			console.log(
				colors.yellow.bold(
					`${logSymbols.info} Config File: config file not found please create your file config and put this path.`
				)
			)
		}
	} catch (error) {
		console.error(colors.red.bold(`${logSymbols.warning} Engine ${error.stack}`))
	}
}
