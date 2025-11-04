import { PrismaClient } from '@prisma/client';
import { DatabaseAdapter, MySQLConfig } from '../types';
import * as Utils from '../../utils';

/**
 * MySQL Database Adapter using Prisma
 */
export class MySQLAdapter implements DatabaseAdapter {
	private client: PrismaClient | null = null;
	private config: MySQLConfig;
	private connected: boolean = false;

	constructor(config: MySQLConfig) {
		this.config = config;
	}

	/**
	 * Build MySQL connection URL
	 */
	private buildConnectionUrl(): string {
		const { username, password, host, port, database, charset } = this.config;
		const auth = username && password ? `${username}:${password}@` : '';
		const baseUrl = `mysql://${auth}${host}:${port}/${database}`;

		const params: string[] = [];
		if (charset) params.push(`charset=${charset}`);

		return params.length > 0 ? `${baseUrl}?${params.join('&')}` : baseUrl;
	}

	/**
	 * Connect to MySQL database
	 */
	async connect(): Promise<void> {
		try {
			const connectionUrl = this.buildConnectionUrl();

			this.client = new PrismaClient({
				datasources: {
					db: {
						url: connectionUrl,
					},
				},
				log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
			});

			// Test the connection
			await this.client.$connect();
			this.connected = true;

			Utils.successMessage(
				`MySQL: Connected to ${this.config.host}:${this.config.port}/${this.config.database}`
			);
		} catch (error) {
			this.connected = false;
			const errorMessage = error instanceof Error ? error.message : 'Unknown error';
			Utils.errorMessage(`MySQL connection error: ${errorMessage}`);
			throw error;
		}
	}

	/**
	 * Disconnect from MySQL database
	 */
	async disconnect(): Promise<void> {
		try {
			if (this.client) {
				await this.client.$disconnect();
				this.connected = false;
				Utils.infoMessage('MySQL: Disconnected');
			}
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'Unknown error';
			Utils.errorMessage(`MySQL disconnect error: ${errorMessage}`);
			throw error;
		}
	}

	/**
	 * Check if connected
	 */
	isConnected(): boolean {
		return this.connected;
	}

	/**
	 * Get Prisma client instance
	 */
	getClient(): PrismaClient | null {
		return this.client;
	}
}
