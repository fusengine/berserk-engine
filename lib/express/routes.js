const { app } = require('../berserk')
const { errorMessage, successMessage, infoMessage } = require('../utils')

/**
  * Define initial route to run api 
  * and default route
  * @param {*} apiRoute api route /api
  * @param {*} webRoute web route /
  */
module.exports = routes = (apiRoute, webRoute) => {
	try {
		if (apiRoute && webRoute) {
			app.use('/api', require(apiRoute))
			app.use('/web', require(webRoute))
			successMessage('Router:	loaded')
		} else {
			infoMessage('Router info: this router path not loaded.')
		}
	} catch (error) {
		errorMessage(`Router error: ${error.stack}`)
	}
}
