/** 
 * Parameter
 * Defined default parameter to run berserk
 */

module.exports = {
	/** 
	 * portDefault
	 * @param {Number} portDefault Port to run host  
	 */
	portDefault: '5000',

	/**
	 * portFunction
	 * @param {Function} portFunction Function to define port user
	 */
	portFunction: value => process.env.PORT || value,

	/**
	 * header express
	 * @param {String} origine origine request
	 * @param {String} headers header request
	 * @param {String} method method to put post get delete options
	 * @param {Boolean} credentials true and false
	 */
	header: {
		origine: '*',
		headers: 'Origin, X-Requested-With, Content-Type, Accept, token',
		method: 'PUT, POST, GET, DELETE, OPTIONS',
		credentials: true,
	},

	/**
	 * urlencoded 
	 * @param {Boolean} encoded true by default
	 */
	encoded: false,

	/**
	 * morgan 
	 * @param {String} morganOption by default dev
	 */
	morganOption: 'dev',

	/**
	 * morgan 
	 * @param {String} api default route api
	 * @param {String} web default route web
	 */
	router: { api: '/api', web: '/' },

	/**
	 * secretCookieKey 
	 * @param {String} secretCookieKey default cookie secret key
	 */
	secretCookieKey: 'berserk-signed-cookie',
}
