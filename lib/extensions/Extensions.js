/**
 * Extensions
 * add custom extension files to required
 * @param  {...any} files Add files required
 */
const Extensions = (...files) => {
	if (files) {
		for (let i = 0; i < files.length; i++) {
			files[i]
		}
	} else {
		if (process.env.NODE_ENV === 'development') {
			console.log('Add extension: no file Loaded')
		}
	}
}

module.exports = Extensions
