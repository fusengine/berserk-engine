'use strict'
/** define var to use dynamic  to access app*/
let mongoose
let Utils

/** Express Port 
 * @param _mongoose define mongoose 
 * @param _utils Define utils var
 */
module.exports = (_mongoose, _utils) => {
	mongoose = _mongoose
	Utils = _utils

	// Return Const
	return MongoDb
}

/**
 * @param {String} server server mongo
 * @param {String} user user mongo
 * @param {String} password password mongo
 * @param {String} host host mongo
 * @param {Number} port port mongo
 * @param {String} dbname dbname mongo
 * @param {String} options retryWrites default true
 * @param {Boolean} newUrlParser NewUrlParser
 * @param {Boolean} useCreateIndex useCreateIndex
 * @param {Boolean} useFindAndModify useFindAndModify
 * @param {Number} tryReconnectMongo Try to reconnect mongo
 * @param {Number} intervalReconnectMongo interval to try reconnect
 * @param {Boolean} useUnifiedTopologyMongo  default true
 */
const MongoDb = async (
	server,
	user,
	password,
	host,
	port,
	dbname,
	options,
	newUrlParser,
	useUnifiedTopology,
	useCreateIndex,
	useFindAndModify,
	useUnifiedTopologyMongo = true
	// tryReconnectMongo,
	// intervalReconnectMongo
) => {
	try {
		const optionMongodb = {
			useNewUrlParser: newUrlParser,
			useUnifiedTopology: useUnifiedTopology,
			useCreateIndex: useCreateIndex,
			useFindAndModify: useFindAndModify,
			useUnifiedTopology: useUnifiedTopologyMongo,
			// reconnectTries: tryReconnectMongo,
			// reconnectInterval: intervalReconnectMongo,
		}

		if (user && password) {
			const serverLink = `${server}://${user}@${password}:${host}:${port}/${dbname}?${options}`
			await mongoose.connect(serverLink, optionMongodb)
			Utils.successMessage('MongoDb: connected with user and password.')
		} else {
			const serverLink = `${server}://${host}:${port}/${dbname}?${options}`
			await mongoose.connect(serverLink, optionMongodb)
			Utils.successMessage('MongoDb: connected without user and password.')
		}
	} catch (error) {
		Utils.errorMessage(`Mongo error: ${error.message}!`)
	}
}
