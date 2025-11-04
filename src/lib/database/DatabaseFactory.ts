import { DatabaseAdapter, DatabaseConfig } from './types';
import { PostgreSQLAdapter, MySQLAdapter, MongoDBAdapter } from './adapters';
import * as Utils from '../utils';

/**
 * Database Factory
 * Creates the appropriate database adapter based on configuration
 */
export class DatabaseFactory {
	/**
	 * Create a database adapter instance based on the configuration
	 * @param config Database configuration
	 * @returns DatabaseAdapter instance
	 */
	static createAdapter(config: DatabaseConfig): DatabaseAdapter {
		switch (config.type) {
			case 'postgresql':
				Utils.infoMessage('DatabaseFactory: Creating PostgreSQL adapter');
				return new PostgreSQLAdapter(config);

			case 'mysql':
				Utils.infoMessage('DatabaseFactory: Creating MySQL adapter');
				return new MySQLAdapter(config);

			case 'mongodb':
				Utils.infoMessage('DatabaseFactory: Creating MongoDB adapter');
				return new MongoDBAdapter(config);

			default:
				throw new Error(`Unsupported database type: ${(config as any).type}`);
		}
	}

	/**
	 * Create and connect to database in one step
	 * @param config Database configuration
	 * @returns Connected DatabaseAdapter instance
	 */
	static async createAndConnect(config: DatabaseConfig): Promise<DatabaseAdapter> {
		const adapter = this.createAdapter(config);
		await adapter.connect();
		return adapter;
	}
}
