import mongoose, { ConnectOptions } from 'mongoose';
import { DatabaseAdapter, MongoDBConfig } from '../types';
import * as Utils from '../../utils';

/**
 * MongoDB Database Adapter using Mongoose (legacy support)
 */
export class MongoDBAdapter implements DatabaseAdapter {
	private config: MongoDBConfig;
	private connected: boolean = false;

	constructor(config: MongoDBConfig) {
		this.config = config;
	}

	/**
	 * Build MongoDB connection URL
	 */
	private buildConnectionUrl(): string {
		const {
			server = 'mongodb',
			username,
			password,
			host,
			port,
			database,
			options = 'retryWrites=true',
		} = this.config;

		if (username && password) {
			return `${server}://${username}:${password}@${host}:${port}/${database}?${options}`;
		}
		return `${server}://${host}:${port}/${database}?${options}`;
	}

	/**
	 * Connect to MongoDB database
	 */
	async connect(): Promise<void> {
		try {
			const connectionUrl = this.buildConnectionUrl();
			const options: ConnectOptions = {};

			await mongoose.connect(connectionUrl, options);
			this.connected = true;

			const auth = this.config.username && this.config.password ? 'with' : 'without';
			Utils.successMessage(`MongoDB: Connected ${auth} authentication to ${this.config.host}:${this.config.port}/${this.config.database}`);
		} catch (error) {
			this.connected = false;
			const errorMessage = error instanceof Error ? error.message : 'Unknown error';
			Utils.errorMessage(`MongoDB connection error: ${errorMessage}`);
			throw error;
		}
	}

	/**
	 * Disconnect from MongoDB database
	 */
	async disconnect(): Promise<void> {
		try {
			await mongoose.disconnect();
			this.connected = false;
			Utils.infoMessage('MongoDB: Disconnected');
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'Unknown error';
			Utils.errorMessage(`MongoDB disconnect error: ${errorMessage}`);
			throw error;
		}
	}

	/**
	 * Check if connected
	 */
	isConnected(): boolean {
		return this.connected && mongoose.connection.readyState === 1;
	}

	/**
	 * Get Mongoose connection instance
	 */
	getClient(): typeof mongoose {
		return mongoose;
	}
}
