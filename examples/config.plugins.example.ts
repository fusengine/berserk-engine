import { BerserkConfig } from '@fusengine/berserk-engine';

/**
 * Complete Plugin-Based Authentication Configuration Example
 * Demonstrates all available auth plugins and features
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

	// Database (required for auth)
	database: {
		type: 'postgresql',
		host: process.env.DB_HOST || 'localhost',
		port: parseInt(process.env.DB_PORT || '5432'),
		database: process.env.DB_NAME || 'berserk_plugins',
		username: process.env.DB_USER || 'postgres',
		password: process.env.DB_PASSWORD || 'password',
	},

	// ==================================================================
	// PLUGIN-BASED AUTHENTICATION SYSTEM
	// ==================================================================
	auth: {
		enabled: true,
		secret: process.env.AUTH_SECRET || 'your-super-secret-key-change-in-production-min-32-chars',

		// Base URL for OAuth callbacks
		baseUrl: process.env.BASE_URL || 'http://localhost:3000',

		// Session configuration
		session: {
			expiresIn: '7d', // 7 days
			cookieName: 'auth_token',
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
		},

		// Email/Password authentication
		emailPassword: {
			enabled: true,
			minPasswordLength: 8,
			requireEmailVerification: false, // Set to true to require email verification
		},

		// ==================================================================
		// OAUTH PROVIDERS - Just set to true and configure env variables!
		// ==================================================================
		providers: {
			// Google OAuth
			// Required env: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
			// Get from: https://console.cloud.google.com/
			google: true,

			// GitHub OAuth
			// Required env: GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET
			// Get from: https://github.com/settings/developers
			github: true,

			// Facebook OAuth (with custom config example)
			// Required env: FACEBOOK_CLIENT_ID, FACEBOOK_CLIENT_SECRET
			// Get from: https://developers.facebook.com/
			facebook: {
				clientId: process.env.FACEBOOK_CLIENT_ID || '',
				clientSecret: process.env.FACEBOOK_CLIENT_SECRET || '',
				scope: ['email', 'public_profile'],
				enabled: !!process.env.FACEBOOK_CLIENT_ID, // Only enable if configured
			},

			// Discord OAuth
			// Required env: DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET
			// Get from: https://discord.com/developers/applications
			discord: !!process.env.DISCORD_CLIENT_ID, // Boolean: enable only if env set

			// Twitter OAuth
			// Required env: TWITTER_CLIENT_ID, TWITTER_CLIENT_SECRET
			twitter: false, // Explicitly disabled

			// Microsoft OAuth
			microsoft: false,

			// Apple OAuth
			apple: false,

			// LinkedIn OAuth
			linkedin: false,
		},

		// ==================================================================
		// TWO-FACTOR AUTHENTICATION (2FA)
		// ==================================================================
		twoFactor: {
			enabled: true,
			methods: ['totp'], // TOTP (Google Authenticator, Authy)
			// methods: ['totp', 'sms', 'email'], // Multiple methods
			required: false, // Optional for users, not mandatory
			issuer: 'Berserk Engine', // Displayed in authenticator apps
		},

		// ==================================================================
		// MAGIC LINKS (Passwordless Authentication)
		// ==================================================================
		magicLink: {
			enabled: true,
			expiresIn: '15m', // Magic links expire in 15 minutes
			sendEmail: async (email, link) => {
				// Your email sending logic here
				console.log(`📧 Send magic link to ${email}:`);
				console.log(`   ${link}`);
				console.log('   (Implement with nodemailer, sendgrid, etc.)');
			},
		},

		// ==================================================================
		// EMAIL VERIFICATION
		// ==================================================================
		emailVerification: {
			enabled: true,
			expiresIn: '24h', // Verification links expire in 24 hours
			required: false, // Set to true to block unverified users
			sendEmail: async (email, token) => {
				// Your email sending logic here
				console.log(`📧 Send verification to ${email}:`);
				console.log(`   Token: ${token}`);
				console.log('   (Implement with nodemailer, sendgrid, etc.)');
			},
		},

		// ==================================================================
		// PASSKEYS / WEBAUTHN (Future)
		// ==================================================================
		passkey: {
			enabled: false, // Coming soon
			rpName: 'Berserk Engine',
			rpId: 'localhost', // Your domain
		},

		// ==================================================================
		// ADVANCED FEATURES
		// ==================================================================

		// Account Linking - Link multiple OAuth accounts to one user
		accountLinking: true,

		// Multi-Session - Allow multiple active sessions per user
		multiSession: true,

		// Rate Limiting for auth endpoints
		rateLimit: {
			enabled: true,
			maxAttempts: 5, // Max login attempts
			windowMs: 15 * 60 * 1000, // 15 minutes
		},
	},

	// ==================================================================
	// ROLE-BASED ACCESS CONTROL (RBAC)
	// ==================================================================
	rbac: {
		enabled: true,
		defaultRole: 'USER',
		// customRoles: ['EDITOR', 'VIEWER'], // Add custom roles if needed
	},

	cookieParserSecretKey: process.env.COOKIE_SECRET || 'cookie-secret-key',

	sessionOption: {
		secret: process.env.SESSION_SECRET || 'session-secret-key',
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

/**
 * ENVIRONMENT VARIABLES REQUIRED:
 *
 * # Database
 * DB_HOST=localhost
 * DB_PORT=5432
 * DB_NAME=berserk_plugins
 * DB_USER=postgres
 * DB_PASSWORD=password
 *
 * # Auth
 * AUTH_SECRET=your-super-secret-key-min-32-chars
 * COOKIE_SECRET=cookie-secret
 * SESSION_SECRET=session-secret
 * BASE_URL=http://localhost:3000
 *
 * # OAuth Providers (set only the ones you want to use)
 * GOOGLE_CLIENT_ID=your-google-client-id
 * GOOGLE_CLIENT_SECRET=your-google-client-secret
 *
 * GITHUB_CLIENT_ID=your-github-client-id
 * GITHUB_CLIENT_SECRET=your-github-client-secret
 *
 * FACEBOOK_CLIENT_ID=your-facebook-client-id
 * FACEBOOK_CLIENT_SECRET=your-facebook-client-secret
 *
 * DISCORD_CLIENT_ID=your-discord-client-id
 * DISCORD_CLIENT_SECRET=your-discord-client-secret
 *
 * # Server
 * NODE_ENV=development
 * PORT=3000
 */
