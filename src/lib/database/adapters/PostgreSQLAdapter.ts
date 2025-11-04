import { PrismaClient } from '@prisma/client';
import { DatabaseAdapter, PostgreSQLConfig } from '../types';
import * as Utils from '../../utils';

/**
 * PostgreSQL Database Adapter using Prisma
 */
export class PostgreSQLAdapter implements DatabaseAdapter {
	private client: PrismaClient | null = null;
	private config: PostgreSQLConfig;
	private connected: boolean = false;

	constructor(config: PostgreSQLConfig) {
		this.config = config;
	}

	/**
	 * Build PostgreSQL connection URL
	 */
	private buildConnectionUrl(): string {
		const { username, password, host, port, database, schema, ssl } = this.config;
		const auth = username && password ? `${username}:${password}@` : '';
		const baseUrl = `postgresql://${auth}${host}:${port}/${database}`;

		const params: string[] = [];
		if (schema) params.push(`schema=${schema}`);
		if (ssl) params.push('sslmode=require');

		return params.length > 0 ? `${baseUrl}?${params.join('&')}` : baseUrl;
	}

	/**
	 * Connect to PostgreSQL database
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
				`PostgreSQL: Connected to ${this.config.host}:${this.config.port}/${this.config.database}`
			);
		} catch (error) {
			this.connected = false;
			const errorMessage = error instanceof Error ? error.message : 'Unknown error';
			Utils.errorMessage(`PostgreSQL connection error: ${errorMessage}`);
			throw error;
		}
	}

	/**
	 * Disconnect from PostgreSQL database
	 */
	async disconnect(): Promise<void> {
		try {
			if (this.client) {
				await this.client.$disconnect();
				this.connected = false;
				Utils.infoMessage('PostgreSQL: Disconnected');
			}
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'Unknown error';
			Utils.errorMessage(`PostgreSQL disconnect error: ${errorMessage}`);
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
