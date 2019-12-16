'use strict'

/** define var to use dynamic  to access app*/
let app
let Utils

/** Express Port 
 * @param _app define app express
 * @param _utils Define utils var
 */
module.exports = (_app, _utils) => {
	app = _app
	Utils = _utils

	// Return Port
	return Port
}

/** Message */
const MESSAGE_DEFAULT = 'Default Port to'
const MESSAGE_CHANGE = 'You have change the port for'
const MESSAGE_ALREADY_USE = 'Other server use this port'
const MESSAGE_PORT_CUSTOM = 'New custom port listen is'

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
					Utils.infoMessage(`Port: ${MESSAGE_CHANGE} ${userPort}`)
				})
				.on('error', err => {
					if (err.code === 'EADDRINUSE') {
						// port is currently in use
						Utils.errorMessage(`Warning: ${MESSAGE_ALREADY_USE} ${userPort}`)
						// increment port
						let newPort = ++userPort
						// new port increment is ok
						app.listen(newPort, (req, res) => {
							Utils.infoMessage(`Port: ${MESSAGE_PORT_CUSTOM} ${newPort}`)
						})
					}
				})
		} else {
			app
				.listen(defPort, (req, res) => {
					Utils.successMessage(`Port: ${MESSAGE_DEFAULT} ${defPort}`)
				})
				.on('error', err => {
					if (err.code === 'EADDRINUSE') {
						// port is currently in use
						Utils.errorMessage(`Warning: ${MESSAGE_ALREADY_USE}${defPort}`)
						// increment port
						let newPort = ++defPort
						// new port increment is ok
						app.listen(newPort, (req, res) => {
							Utils.infoMessage(`Port: ${MESSAGE_PORT_CUSTOM} ${newPort}`)
						})
					}
				})
		}
	} catch (error) {
		Utils.errorMessage(`Port Error: ${error.stack}`)
	}
}
