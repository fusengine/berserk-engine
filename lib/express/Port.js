'use strict'

const { app, berserkUtils } = require('../berserk')

/**
 * @param {Number|String} userPort define port to user 
 */
const Port = userPort => {
	try {
		let defPort = 5000
		const portFunction = value => process.env.PORT || value

		if (userPort) {
			app
				.listen(portFunction(userPort), (req, res) => {
					berserkUtils.infoMessage(`Port: you have change the port for ${userPort}`)
				})
				.on('error', err => {
					if (err.code === 'EADDRINUSE') {
						// port is currently in use
						berserkUtils.errorMessage(
							`Warning: Other server use custom port ${userPort}`
						)
						// increment port
						let newPort = ++userPort
						// new port increment is ok
						app.listen(newPort, (req, res) => {
							berserkUtils.infoMessage(`Port: New custom port listen is  ${newPort}`)
						})
					}
				})
		} else {
			app
				.listen(defPort, (req, res) => {
					berserkUtils.successMessage(`Port: default port to ${defPort}`)
				})
				.on('error', err => {
					if (err.code === 'EADDRINUSE') {
						// port is currently in use
						berserkUtils.errorMessage(`Warning: Other server use port ${defPort}`)
						// increment port
						let newPort = ++defPort
						// new port increment is ok
						app.listen(newPort, (req, res) => {
							berserkUtils.infoMessage(`Port: New port listen is  ${newPort}`)
						})
					}
				})
		}
	} catch (error) {
		berserkUtils.errorMessage(`Port Error: ${error.stack}`)
	}
}

module.exports = Port
