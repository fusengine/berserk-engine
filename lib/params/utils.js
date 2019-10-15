const path = require('path')
const logSymbols = require('log-symbols')
const colors = require('colors')

/**
 * BerserkPathResolve
 * resolve path absolute
 * @param {String} pathFile return a root dir
 */
exports.BerserkPathResolve = BerserkPathResolve = pathFile => {
	if (pathFile) {
		return path.resolve('./', pathFile)
	} else {
		console.log('No path file define')
	}
}

/**
 * BerserkPathJoin
 * join path to directory
 * @param {String} joinPath join path
 */
exports.BerserkPathJoin = BerserkPath = joinPath => {
	if (joinPath) {
		return path.join(__dirname, joinPath)
	} else {
		console.log('No path join file define')
	}
}

/**
 * berserkPath
 * return a root dir
 * @param {String} filePath return a root dir
 */
exports.Path = Path = filePath => `../../../../../${filePath}`
