'use strict'

const colors = require('colors')
const logSymbols = require('log-symbols')
const bcrypt = require('bcrypt')

/**
 * Utils to berserk
 * @class Utils
 */

/**
 *view Env nodejs
 * @returns Return env
 */
exports.ENV = () => {
	return process.env.NODE_ENV
}

exports.modulesFile = files => {
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
exports.hashPassword = async (password, number) => {
	try {
		const salt = await bcrypt.genSalt(number)
		return await bcrypt.hash(password, salt)
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
exports.comparePassword = (password, userField) => {
	return bcrypt.compare(password, userField)
}

/**
 * guardian
 * this check if user authenticated
 * 
 * @param {*} req request
 * @param {*} res response
 * @param {*} next next execution
 * @param {String} path Redirect link after not authenticated
 */
// exports.guardian = (req, res, next, path) => {
// 	if (req) {
// 		next()
// 	} else {
// 		res.redirect(path)
// 	}
// }

/**
 * Define success messages
 * @param {string} message message text
 */
exports.successMessage = (message = '') => {
	const colorMessage = colors.blue.bold
	const symbolSuccess = logSymbols.success
	console.log(colorMessage(`${symbolSuccess} ${message}`))
}

/**
 * Define info messages
 * @param {string} message message text
 */
exports.infoMessage = (message = '') => {
	const colorMessage = colors.bgBlue.bold
	const symbolSuccess = logSymbols.info
	console.log(colorMessage(`${symbolSuccess} ${message}`))
}

/**
 * Define error Message
 * @param {string} message message text
 */
exports.errorMessage = (message = '') => {
	const colorMessage = colors.red.bold
	const symbolSuccess = logSymbols.warning
	console.log(colorMessage(`${symbolSuccess} ${message}`))
}
