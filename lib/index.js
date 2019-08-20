const colors = require('colors')
const logSymbols = require('log-symbols')

/** Express Module */
const { Port, Header, Urlencoded, Morgan, Errors } = require('./express')

/**
 * berserkEngine
 * @param {String} configPath link to config if you want custom your configuration
 */
const berserkEngine = configPath => {
	console.log(colors.blue.bold(`${logSymbols.success} Express: Loaded`))

	if (configPath) {
		/** got read file to config path */
		const { port, header, urlEncoded, morganOption } = require(`${configPath}`)

		/** if have variable to option files */
		if (header) headerObj = Object.values(header)
		if (urlEncoded) urlEncoded
		if (morganOption) morganOption

		/* if module berser have option to config file */
		urlEncoded ? Urlencoded(urlEncoded) : Urlencoded()
		header ? Header(...headerObj) : Header()
		morganOption ? Morgan(morganOption) : Morgan()
		Errors()
		port ? Port(port) : Port()
	} else {
		Urlencoded()
		Header()
		Morgan()
		Errors()
		Port()
	}
}

module.exports = berserkEngine
