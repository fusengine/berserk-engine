import { BerserkConfig } from '@fusengine/berserk-engine';

/**
 * Example configuration for PostgreSQL database
 */
const config: BerserkConfig = {
	portNumber: 3000,

	header: {
		origine: '*',
		headers: 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
		method: 'PUT, POST, GET, DELETE, OPTIONS',
		credentials: true,
	},

	encoded: true,
	morgan: 'dev',

	// New unified database configuration for PostgreSQL
	database: {
		type: 'postgresql',
		host: 'localhost',
		port: 5432,
		database: 'myapp',
		username: 'postgres',
		password: 'password',
		schema: 'public', // Optional: PostgreSQL schema
		ssl: false, // Optional: Enable SSL
		poolMin: 2, // Optional: Minimum pool size
		poolMax: 10, // Optional: Maximum pool size
	},

	sessionOption: {
		secret: 'your-secret-key',
		resave: false,
		saveUninitialized: true,
		cookie: {
			path: '/',
			httpOnly: true,
			secure: false, // Set to true in production with HTTPS
			maxAge: 60000,
		},
	},
};

export default config;
