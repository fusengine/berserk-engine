'use strict'

const colors = require('colors')
const logSymbols = require('log-symbols')
const bcrypt = require('bcrypt')

/**
 * Utils to berserk
 * @class Utils
 */
class Utils {
	constructor() {
		this.env = process.env.NODE_ENV
	}

	/**
	 *view Env nodejs
	 * @returns Return env
	 */
	ENV() {
		return this.env
	}

	modulesFile(file) {
		for (let i = 0; i < files.length; i++) {
			files[i]
		}
	}

	/**
	 * Use bcrypt to hash password
	 *
	 * @param {String} password User password
	 * @param {Number} number number of hash
	 * @returns
	 */
	async hashPassword(password, number) {
		try {
			const salt = await bcrypt.genSalt(number)
			return bcrypt.hash(password, salt)
		} catch (error) {
			throw error
		}
	}

	/**
	 * Compare password field to user password database
	 *
	 * @param {String} password password database
	 * @param {String} userField password field
	 * @returns
	 */
	comparePassword(password, userField) {
		return bcrypt.compare(password, userField)
	}

	/**
	 * guardian
	 * this check if user authenticated
	 * 
	 * @param {*} req request
	 * @param {*} res response
	 * @param {*} next next execution
	 */
	guardian(req, res, next) {
		if (req.isAuthenticated()) {
			next()
		} else {
			res.redirect('/auth/signin')
		}
	}

	/**
	 * Define success messages
	 * @param {string} [message=''] message text
	 */
	successMessage(message = '') {
		const colorMessage = colors.blue.bold
		const symbolSuccess = logSymbols.success
		console.log(colorMessage(`${symbolSuccess} ${message}`))
	}

	/**
	 * Define info messages
	 * @param {string} [message=''] message text
	 */
	infoMessage(message = '') {
		const colorMessage = colors.bgBlue.bold
		const symbolSuccess = logSymbols.info
		console.log(colorMessage(`${symbolSuccess} ${message}`))
	}

	/**
	 * Define error Message
	 * @param {string} [message=''] message text
	 */
	errorMessage(message = '') {
		const colorMessage = colors.red.bold
		const symbolSuccess = logSymbols.warning
		console.log(colorMessage(`${symbolSuccess} ${message}`))
	}
}

module.exports = new Utils()

// /**
//  * node env
//  */
// exports.develop = process.env.NODE_ENV

// /**
//  * modulesFile
//  * automatically import files into berserk
//  * @param  {...any} files
//  */
// exports.modulesFile = (...files) => {
// 	for (let i = 0; i < files.length; i++) {
// 		files[i]
// 	}
// }

// /**
//  * successMessage
//  * Define success messages
//  * @param {*} msg message variable
//  */
// exports.successMessage = msg => {
// 	const colorMessage = colors.blue.bold
// 	const symbolSuccess = logSymbols.success
// 	console.log(colorMessage(`${symbolSuccess} ${msg}`))
// }

// /**
//  * infoMessage
//  * Define info messages
//  * @param {*} msg message variable
//  */
// exports.infoMessage = msg => {
// 	const colorMessage = colors.bgBlue.bold
// 	const symbolSuccess = logSymbols.info
// 	console.log(colorMessage(`${symbolSuccess} ${msg}`))
// }

// /**
//  * errorMessage
//  * Define error messages
//  * @param {*} msg message variable
//  */
// exports.errorMessage = msg => {
// 	const colorMessage = colors.red.bold
// 	const symbolSuccess = logSymbols.warning
// 	console.log(colorMessage(`${symbolSuccess} ${msg}`))
// }
