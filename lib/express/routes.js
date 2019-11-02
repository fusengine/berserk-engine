'use strict'

const { app, berserkUtils } = require('../berserk')

/**
  * Define initial route to run api 
  * and default route
  * @param {*} apiRoute api route /api
  * @param {*} webRoute web route /
  */
const routes = (api, web) => {
	try {
		if (api && web) {
			app.use('/api', api)
			app.use('/', web)
			berserkUtils.successMessage('Router: loaded')
		} else {
			berserkUtils.infoMessage('Router info: this router path not loaded.')
		}
	} catch (error) {
		berserkUtils.errorMessage(`Router error: ${error.stack}`)
	}
}

module.exports = routes
