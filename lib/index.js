const colors = require('colors')
const logSymbols = require('log-symbols')

module.exports = berserkEngine = pathPort => {
	console.log(colors.blue.bold(`${logSymbols.success} Express: Loaded`))

	if (pathPort) {
		const { PORT } = require(`${pathPort}`)
		if (PORT) {
			require('./express/index').Port(PORT)
		} else {
			require('./express/index').Port()
		}
	} else {
		require('./express/index').Port()
	}
}
