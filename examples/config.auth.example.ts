import { BerserkConfig } from '@fusengine/berserk-engine';

/**
 * Example configuration with Authentication and RBAC
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

	// Database configuration (PostgreSQL recommended for auth)
	database: {
		type: 'postgresql',
		host: process.env.DB_HOST || 'localhost',
		port: parseInt(process.env.DB_PORT || '5432'),
		database: process.env.DB_NAME || 'berserk_auth',
		username: process.env.DB_USER || 'postgres',
		password: process.env.DB_PASSWORD || 'password',
	},

	// Authentication configuration
	auth: {
		enabled: true,
		secret: process.env.AUTH_SECRET || 'your-super-secret-key-change-in-production',
		session: {
			expiresIn: '7d', // 7 days
			cookieName: 'auth_token',
			secure: process.env.NODE_ENV === 'production', // HTTPS only in production
		},
		emailVerification: {
			enabled: false, // Set to true to require email verification
			expiresIn: '24h',
		},
	},

	// RBAC configuration
	rbac: {
		enabled: true,
		defaultRole: 'USER',
	},

	// Cookie parser secret
	cookieParserSecretKey: process.env.COOKIE_SECRET || 'berserk-cookie-secret',

	sessionOption: {
		secret: process.env.SESSION_SECRET || 'berserk-session-secret',
		resave: false,
		saveUninitialized: false,
		cookie: {
			path: '/',
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
		},
	},
};

export default config;
