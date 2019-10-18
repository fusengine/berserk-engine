const morganApp = require('morgan')

const { app } = require('../berserk')
const { errorMessage, successMessage } = require('../utils')

/**
 * Morgan
 * @param {String} paramMorgan this param morgan to view url request
 */
module.exports = morgan = paramMorgan => {
	if (paramMorgan) {
		app.use(morganApp(paramMorgan))
		if (process.env.NODE_ENV === 'development') {
			successMessage(`Morgan:	${paramMorgan}`)
		}
	} else {
		app.use(morganApp('dev'))
		if (process.env.NODE_ENV === 'development') {
			successMessage(`Morgan:	dev`)
		}
	}
}
