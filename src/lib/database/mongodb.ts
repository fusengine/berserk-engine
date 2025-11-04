import mongoose, { ConnectOptions } from 'mongoose';
import * as Utils from '../utils';

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
	server: string,
	user?: string,
	password?: string,
	host?: string,
	port?: string,
	dbname?: string,
	options?: string,
	_newUrlParser?: boolean,
	_useUnifiedTopology?: boolean,
	_useCreateIndex?: boolean,
	_useFindAndModify?: boolean,
	_useUnifiedTopologyMongo: boolean = true
): Promise<void> => {
	try {
		const optionMongodb: ConnectOptions = {};

		if (user && password) {
			const serverLink = `${server}://${user}:${password}@${host}:${port}/${dbname}?${options}`;
			await mongoose.connect(serverLink, optionMongodb);
			Utils.successMessage('MongoDb: connected with user and password.');
		} else {
			const serverLink = `${server}://${host}:${port}/${dbname}?${options}`;
			await mongoose.connect(serverLink, optionMongodb);
			Utils.successMessage('MongoDb: connected without user and password.');
		}
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : 'Unknown error';
		Utils.errorMessage(`Mongo error: ${errorMessage}!`);
	}
};

export default MongoDb;
