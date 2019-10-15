const passport = require('passport')
const { app } = require('../express/app')

/** init passport */

const Passport = (...PassportOptions) => {
	/** init passport */
	app.use(passport.initialize())
	app.use(passport.session())

	/** method to Serialize user  */

	PassportOptions
	console.log('hello')
}

module.exports = Passport
