const colors = require('colors')
const logSymbols = require('log-symbols')

/** Express Module */
const { Port, Header, Urlencoded, Morgan, Errors, Route, ViewEngine } = require('./express')

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
const berserkEngine = (configPath, apiPath, webPath, viewPath) => {
	console.log(colors.blue.bold(`${logSymbols.success} Express: Loaded`))

	if (configPath) {
		/** got read file to config path */
		const { port, header, urlEncoded, morganOption, viewExtension } = require(`${configPath}`)

		/** if have variable to option files */
		if (viewExtension) viewExtension
		if (header) headerObj = Object.values(header)
		if (urlEncoded) urlEncoded
		if (morganOption) morganOption

		/* if module berser have option to config file */
		ViewEngine(viewExtension, viewPath)
		urlEncoded ? Urlencoded(urlEncoded) : Urlencoded()
		header ? Header(...headerObj) : Header()
		morganOption ? Morgan(morganOption) : Morgan()
		Route(apiPath, webPath)
		Errors()
		port ? Port(port) : Port()
	} else {
		ViewEngine()
		Urlencoded()
		Header()
		Morgan()
		Route()
		Errors()
		Port()
	}
}

module.exports = berserkEngine
