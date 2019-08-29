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
				assets,
			} = require(`${configPath}`)

			/** mongo configuration */
			if (mongoConfig) mongoConfigObj = Object.values(mongoConfig)
			MongoDb(...mongoConfigObj)

			/** if have variable to option files */
			if (viewExtension) viewExtension
			if (header) headerObj = Object.values(header)
			if (assets) assetsObj = Object.values(assets)
			if (urlEncoded) urlEncoded
			if (morganOption) morganOption

			/* if module berser have option to config file */
			ViewEngine(viewExtension, viewPath)
			urlEncoded ? Urlencoded(urlEncoded) : Urlencoded()
			StaticFiles(...assetsObj)
			header ? Header(...headerObj) : Header()
			morganOption ? Morgan(morganOption) : Morgan()
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
