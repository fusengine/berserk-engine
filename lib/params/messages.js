/**
 * Message predefine to berserk engine
 */

module.exports = {
	/**
     * Port app message
     * @param {String} defined  defined message to host
     * @param {String} default  default message to host
     */
	port: {
		defined: 'User change port to',
		default: 'Default port to',
	},

	/**
     * mongoMessage  message
     * @param {String} connected  defined message 
     * @param {String} noConnected  default message 
     */
	mongoMessage: {
		connected: 'is connected on database',
		noConnected: 'is not connected on database',
	},
}
