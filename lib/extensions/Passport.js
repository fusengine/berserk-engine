const passport = require('passport')
const { app } = require('../express/app')

const { BerserkPathJoin, Path } = require('../params/utils')

/**
 * Passport 
 * define option passport to auth user
 * @param {Function} PassportOptions file to option function to authenticate user
 */
const Passport = PassportOptions => {
	/** init passport */
	app.use(passport.initialize())
	app.use(passport.session())

	/** method to Serialize user  */

	if (PassportOptions) {
		// const InitPassportFunc = BerserkPathJoin(Path(PassportOptions))
		// require(InitPassportFunc)
		PassportOptions
	} else {
		console.log('Passport: dont have passport file.')
	}
}

module.exports = Passport
