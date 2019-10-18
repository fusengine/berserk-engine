const { app } = require('../berserk')
const { errorMessage, successMessage } = require('../utils')

/**
 * ViewEngine
 * this is define view file to html
 * @param {String} extensionConf define pug or ejs
 * @param {String} pathConf define view path
 */
module.exports = viewEngine = (extensionConf, pathConf) => {
	try {
		if (pathConf) {
			// app.set('views', path.join(__dirname, pathConf))
			app.set('views', BerserkPathJoin(Path(pathConf)))
		} else {
			successMessage('View: not path define!')
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
		errorMessage(`View Engine: ${error.stack}`)
	}
}
