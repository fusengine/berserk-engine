const morgan = require('morgan')
const logSymbols = require('log-symbols')
const colors = require('colors')

/** Express and param module */
const { app } = require('./app')
const berserkParam = require('../params').parameters

/**
 * Morgan
 * @param {String} paramMorgan this param morgan to view url request
 */
const Morgan = paramMorgan => {
	if (paramMorgan) {
		app.use(morgan(paramMorgan))

		if (process.env.NODE_ENV === 'development') {
			console.log(colors.cyan.bold(`${logSymbols.info} Morgan: ${paramMorgan}  `))
		}
	} else {
		app.use(morgan(berserkParam.morganOption))
		if (process.env.NODE_ENV === 'development') {
			console.log(
				colors.cyan.bold(`${logSymbols.info} Morgan: ${berserkParam.morganOption}  `)
			)
		}
	}
}

module.exports = Morgan
