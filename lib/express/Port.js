const logSymbols = require('log-symbols')
const colors = require('colors')

/** App express */
const app = require('./app')
const berserkParam = require('../params')

/**
 * Parameter file
 */
const { parameters: { portDefault, portFunction }, messages: { port } } = berserkParam

/**
 * @param {Number|String} userPort define port to user 
 */
module.exports = Port = userPort => {
	app.use(function(req, res, next) {
		res.header('X-powered-by', 'BERSERK, Fusengine')
		next()
	})

	try {
		if (userPort) {
			app.listen(portFunction(userPort), (req, res) => {
				console.log(
					colors.bgBlue.bold(`${logSymbols.success} Listen: ${port.defined} ${userPort}`)
				)
			})
		} else {
			app.listen(portDefault, (req, res) => {
				console.log(
					colors.blue.bold(`${logSymbols.success} Listen: ${port.default} ${portDefault}`)
				)
			})
		}
	} catch (error) {
		console.error(colors.red.bold(`${logSymbols.warning} ${error.stack}`))
	}
}
