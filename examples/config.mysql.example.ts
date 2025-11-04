import { BerserkConfig } from '@fusengine/berserk-engine';

/**
 * Example configuration for MySQL database
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

	// New unified database configuration for MySQL
	database: {
		type: 'mysql',
		host: 'localhost',
		port: 3306,
		database: 'myapp',
		username: 'root',
		password: 'password',
		charset: 'utf8mb4', // Optional: Character set
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
