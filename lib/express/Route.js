const logSymbols = require('log-symbols')
const colors = require('colors')

const { app } = require('./app')
const berserkParam = require('../params').parameters.router

/**
  * Define initial route to run api 
  * and default route
  * @param {*} apiRoute api route /api
  * @param {*} webRoute web route /
  */
const Route = (apiRoute, webRoute) => {
	try {
		if (apiRoute && webRoute) {
			app.use(berserkParam.api, require(apiRoute))
			app.use(berserkParam.web, require(webRoute))
		}
	} catch (error) {
		console.error(colors.red.bold(`${logSymbols.warning} ${error.stack}`))
	}
}

module.exports = Route
