const colors = require('colors')
const logSymbols = require('log-symbols')

/** Express Module */
const { Port, Header } = require('./express')

/**
 * berserkEngine
 * @param {String} configPath link to config if you want custom your configuration
 */
const berserkEngine = configPath => {
	console.log(colors.blue.bold(`${logSymbols.success} Express: Loaded`))

	if (configPath) {
		/** got read file to config path */
		const { port, header } = require(`${configPath}`)

		/** view array header config */
		if (header) headerObj = Object.values(header)

		/**  Header Request*/
		header ? Header(...headerObj) : Header()

		/** Port App*/
		port ? Port(port) : Port()
	} else {
		Header()
		Port()
	}
}

module.exports = berserkEngine
