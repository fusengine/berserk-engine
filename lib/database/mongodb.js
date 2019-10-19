const mongoose = require('mongoose')
const { successMessage, errorMessage } = require('../utils')

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
 * 
 */
module.exports = mongoDb = async (
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
	tryReconnectMongo,
	intervalReconnectMongo
) => {
	try {
		if (user && password) {
			const serverLink = `${server}://${user}@${password}:${host}:${port}/${dbname}?${options}`

			await mongoose.connect(serverLink, {
				useNewUrlParser: newUrlParser,
				useUnifiedTopology: useUnifiedTopology,
				useCreateIndex: useCreateIndex,
				useFindAndModify: useFindAndModify,
				reconnectTries: tryReconnectMongo,
				reconnectInterval: intervalReconnectMongo,
			})

			successMessage('MongoDb: connected with user and password.')
		} else {
			const serverLink = `${server}://${host}:${port}/${dbname}?${options}`

			await mongoose.connect(serverLink, {
				useNewUrlParser: newUrlParser,
				useUnifiedTopology: useUnifiedTopology,
				useCreateIndex: useCreateIndex,
				useFindAndModify: useFindAndModify,
				reconnectTries: tryReconnectMongo,
				reconnectInterval: intervalReconnectMongo,
			})

			successMessage('MongoDb: connected without user and password.')
		}
	} catch (error) {
		errorMessage(`Mongo error: ${error.message}!`)
	}
}