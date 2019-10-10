/** Express and param module */
const app = require('./app')

/**
 * Powered
 * Define name application
 */
const PoweredBy = () => {
	app.use(function(req, res, next) {
		res.header('X-powered-by', 'Berserk, Fusengine')
		next()
	})
}

module.exports = PoweredBy
