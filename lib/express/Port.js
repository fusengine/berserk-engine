const { app } = require('../berserk')
const { errorMessage, infoMessage, successMessage } = require('../utils')

/**
 * @param {Number|String} userPort define port to user 
 */
module.exports = Port = userPort => {
	try {
		const defPort = 5000
		const portFunction = value => process.env.PORT || value

		if (userPort) {
			app.listen(portFunction(userPort), (req, res) => {
				infoMessage(`Port: you have change the port for ${userPort}`)
			})
		} else {
			app.listen(defPort, (req, res) => {
				successMessage(`Port: default port to ${defPort}`)
			})
		}
	} catch (error) {
		errorMessage(`Port Error: ${error.stack}`)
	}
}
