const colors = require('colors')
const logSymbols = require('log-symbols')

/**
 * berserkEngine
 * @param {String} configPath link to config if you want custom your configuration
 */
const berserkEngine = configPath => {
	console.log(colors.blue.bold(`${logSymbols.success} Express: Loaded`))

	if (configPath) {
		const { PORT } = require(`${configPath}`)
		if (PORT) {
			require('./express/index').Port(PORT)
		} else {
			require('./express/index').Port()
		}
	} else {
		require('./express/index').Port()
	}
}

module.exports = berserkEngine
