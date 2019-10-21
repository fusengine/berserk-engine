const { app } = require('../berserk')
const { errorMessage, infoMessage, successMessage } = require('../utils')

/**
 * @param {Number|String} userPort define port to user 
 */
module.exports = Port = userPort => {
	try {
		let defPort = 5000
		const portFunction = value => process.env.PORT || value

		if (userPort) {
			app
				.listen(portFunction(userPort), (req, res) => {
					infoMessage(`Port: you have change the port for ${userPort}`)
				})
				.on('error', err => {
					if (err.code === 'EADDRINUSE') {
						// port is currently in use
						errorMessage(`Warning: Other server use custom port ${userPort}`)
						// increment port
						let newPort = ++userPort
						// new port increment is ok
						app.listen(newPort, (req, res) => {
							infoMessage(`Port: New custom port listen is  ${newPort}`)
						})
					}
				})
		} else {
			app
				.listen(defPort, (req, res) => {
					successMessage(`Port: default port to ${defPort}`)
				})
				.on('error', err => {
					if (err.code === 'EADDRINUSE') {
						// port is currently in use
						errorMessage(`Warning: Other server use port ${defPort}`)
						// increment port
						let newPort = ++defPort
						// new port increment is ok
						app.listen(newPort, (req, res) => {
							infoMessage(`Port: New port listen is  ${newPort}`)
						})
					}
				})
		}
	} catch (error) {
		errorMessage(`Port Error: ${error.stack}`)
	}
}
