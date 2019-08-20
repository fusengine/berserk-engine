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
}
