import { BerserkConfig } from '@fusengine/berserk-engine';

/**
 * Example configuration for MongoDB database (new format)
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

	// New unified database configuration for MongoDB
	database: {
		type: 'mongodb',
		host: 'localhost',
		port: 27017,
		database: 'myapp',
		username: 'admin', // Optional
		password: 'password', // Optional
		options: 'retryWrites=true&w=majority',
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
