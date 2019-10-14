const engine = require('ejs-mate')
const logSymbols = require('log-symbols')
const colors = require('colors')
const path = require('path')

const { app } = require('./app')

/**
 * ViewEngine
 * this is define view file to html
 * @param {String} extensionConf define pug or ejs
 * @param {String} pathConf define view path
 */
const ViewEngine = (extensionConf, pathConf) => {
	try {
		if (pathConf) {
			app.set('views', path.join(__dirname, pathConf))
		} else {
			console.log('View: not path define!')
		}

		// Try if user add extension
		if (extensionConf) {
			// Define layout to pug
			if (extensionConf === 'pug') {
				app.set('view engine', extensionConf)
			}
			// Define layout to ejs
			if (extensionConf === 'ejs') {
				app.engine('ejs', engine)
				app.set('view engine', extensionConf)
			}
		} else {
			app.engine('ejs', extensionConf)
			app.set('view engine', 'ejs')
		}
	} catch (error) {
		console.error(colors.red.bold(`${logSymbols.warning} ${error.stack}`))
	}
}

module.exports = ViewEngine
