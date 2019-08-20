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
}
