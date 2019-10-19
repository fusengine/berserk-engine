const logSymbols = require('log-symbols')
const colors = require('colors')

/**
 * node env
 */
exports.develop = process.env.NODE_ENV

/**
 * modulesFile
 * automatically import files into berserk
 * @param  {...any} files 
 */
exports.modulesFile = (...files) => {
	for (let i = 0; i < files.length; i++) {
		files[i]
	}
}

/**
 * successMessage
 * Define success messages
 * @param {*} msg message variable
 */
exports.successMessage = msg => {
	const colorMessage = colors.blue.bold
	const symbolSuccess = logSymbols.success
	console.log(colorMessage(`${symbolSuccess} ${msg}`))
}

/**
 * infoMessage
 * Define info messages
 * @param {*} msg message variable
 */
exports.infoMessage = msg => {
	const colorMessage = colors.bgBlue.bold
	const symbolSuccess = logSymbols.info
	console.log(colorMessage(`${symbolSuccess} ${msg}`))
}

/**
 * errorMessage
 * Define error messages
 * @param {*} msg message variable
 */
exports.errorMessage = msg => {
	const colorMessage = colors.red.bold
	const symbolSuccess = logSymbols.warning
	console.log(colorMessage(`${symbolSuccess} ${msg}`))
}
