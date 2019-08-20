module.exports = {
	port: '',

	/** Define Header Request */
	header: {
		origine: '*',
		headers: 'Origin, X-Requested-With, Content-Type, Accept, token-berserk',
		method: 'PUT, POST, GET, DELETE, OPTIONS',
		credentials: true,
	},

	/**
	 * @param {Boolean} urlencoded by default false
	 */
	urlEncoded: true,

	/**
	 * @param {String} morganOption
	 * option: dev, tiny, combined
	 * other option go to https://github.com/expressjs/morgan#readme
	 */
	morganOption: '',
}
