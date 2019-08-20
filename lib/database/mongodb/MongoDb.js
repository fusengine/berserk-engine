const mongoose = require('mongoose')
const colors = require('colors')
const logSymbols = require('log-symbols')
const message = require('../../params').messages.mongoMessage

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
	useCreateIndex,
	useFindAndModify,
	tryReconnectMongo,
	intervalReconnectMongo
) => {
	try {
		if (user && password) {
			await mongoose.connect(
				`${server}://${user}@${password}:${host}:${port}/${dbname}?${options}`,
				{
					useNewUrlParser: newUrlParser,
					useCreateIndex: useCreateIndex,
					useFindAndModify: useFindAndModify,
					reconnectTries: tryReconnectMongo,
					reconnectInterval: intervalReconnectMongo,
				}
			)

			console.log(
				colors.cyan.bold(
					`${logSymbols.success} Mongodb: ${message.connected} with user and password`
				)
			)
		} else {
			await mongoose.connect(`${server}://${host}:${port}/${dbname}?${options}`, {
				useNewUrlParser: newUrlParser,
				useCreateIndex: useCreateIndex,
				useFindAndModify: useFindAndModify,
				reconnectTries: tryReconnectMongo,
				reconnectInterval: intervalReconnectMongo,
			})
			console.log(
				colors.cyan.bold(
					`${logSymbols.success} Mongodb: ${message.connected} with not user and not password`
				)
			)
		}
	} catch (error) {
		console.log(colors.yellow.bold(`${logSymbols.warning} ${error.message}`))
	}
}

module.exports = MongoDb
