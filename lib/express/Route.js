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
	return Route
}

/** Message */
const SUCCESS = 'Loaded'
const NOT_FOUND = 'This router path not loaded.'

/**
  * Define initial route to run api 
  * and default route
  * @param {*} apiRoute api route /api
  * @param {*} webRoute web route /
  */
const Route = (api, web) => {
	try {
		if (api && web) {
			app.use('/api', api)
			app.use('/', web)
			Utils.successMessage(`Router: ${SUCCESS}`)
		} else {
			Utils.infoMessage(`Router info: ${NOT_FOUND}`)
		}
	} catch (error) {
		Utils.errorMessage(`Router error: ${error.stack}`)
	}
}
