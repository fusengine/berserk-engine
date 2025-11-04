/**
 * Database types supported by Berserk Engine
 */
export type DatabaseType = 'mongodb' | 'postgresql' | 'mysql';

/**
 * Base database configuration interface
 */
export interface BaseDatabaseConfig {
	type: DatabaseType;
	host: string;
	port: number | string;
	database: string;
	username?: string;
	password?: string;
}

/**
 * PostgreSQL specific configuration
 */
export interface PostgreSQLConfig extends BaseDatabaseConfig {
	type: 'postgresql';
	ssl?: boolean;
	schema?: string;
	poolMin?: number;
	poolMax?: number;
}

/**
 * MySQL specific configuration
 */
export interface MySQLConfig extends BaseDatabaseConfig {
	type: 'mysql';
	charset?: string;
	poolMin?: number;
	poolMax?: number;
}

/**
 * MongoDB specific configuration (legacy support)
 */
export interface MongoDBConfig extends BaseDatabaseConfig {
	type: 'mongodb';
	server?: string;
	user?: string;
	password?: string;
	dbname?: string;
	options?: string;
	newUrlParser?: boolean;
	useUnifiedTopology?: boolean;
	useCreateIndex?: boolean;
	useFindAndModify?: boolean;
	useUnifiedTopologyMongo?: boolean;
}

/**
 * Union type for all database configurations
 */
export type DatabaseConfig = PostgreSQLConfig | MySQLConfig | MongoDBConfig;

/**
 * Database adapter interface
 * All database adapters must implement this interface
 */
export interface DatabaseAdapter {
	/**
	 * Connect to the database
	 */
	connect(): Promise<void>;

	/**
	 * Disconnect from the database
	 */
	disconnect(): Promise<void>;

	/**
	 * Check if the database is connected
	 */
	isConnected(): boolean;

	/**
	 * Get the underlying client/connection
	 */
	getClient(): any;
}
