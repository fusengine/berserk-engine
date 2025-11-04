/**
 * Berserk Engine Plugin-Based Authentication System
 *
 * This is a simplified documentation for the modular auth system.
 * Full implementation requires actual Better Auth integration.
 */

import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthService } from './AuthService';
import {
	BetterAuthConfig,
	OAuthProvider,
	OAuthProviderConfig,
	AuthPlugin,
} from './types';
import * as Utils from '../utils';

/**
 * Auth Engine - Manages plugins and routes
 */
export class AuthEngine {
	private authService: AuthService;
	private config: BetterAuthConfig;
	private plugins: Map<string, AuthPlugin> = new Map();
	private router: Router;

	constructor(prisma: PrismaClient, config: BetterAuthConfig) {
		this.config = config;
		this.authService = new AuthService(prisma, config);
		this.router = Router();
	}

	/**
	 * Initialize auth engine with all enabled plugins
	 */
	async initialize(): Promise<Router> {
		Utils.infoMessage('AuthEngine: Initializing...');

		// Register core authentication routes
		this.registerCoreRoutes();

		// Initialize OAuth providers if configured
		if (this.config.providers) {
			await this.initializeOAuthProviders();
		}

		// Initialize 2FA if enabled
		if (this.config.twoFactor?.enabled) {
			await this.initialize2FA();
		}

		// Initialize Magic Link if enabled
		if (this.config.magicLink?.enabled) {
			await this.initializeMagicLink();
		}

		Utils.successMessage(`AuthEngine: Initialized with ${this.plugins.size} plugins`);

		return this.router;
	}

	/**
	 * Register core authentication routes (email/password)
	 */
	private registerCoreRoutes(): void {
		// Register
		this.router.post('/register', async (req, res) => {
			const result = await this.authService.register(req.body);
			res.status(result.success ? 201 : 400).json(result);
		});

		// Login
		this.router.post('/login', async (req, res) => {
			const result = await this.authService.login(req.body);
			if (result.success && result.token) {
				const cookieName = this.config.session?.cookieName || 'auth_token';
				res.cookie(cookieName, result.token, {
					httpOnly: true,
					secure: this.config.session?.secure ?? process.env.NODE_ENV === 'production',
					maxAge: this.parseExpiresIn(this.config.session?.expiresIn || '7d'),
				});
			}
			res.json(result);
		});

		// Logout
		this.router.post('/logout', async (req, res) => {
			const token =
				req.cookies?.auth_token || req.headers.authorization?.replace('Bearer ', '');

			if (token) {
				await this.authService.logout(token);
				res.clearCookie('auth_token');
			}

			res.json({ success: true, message: 'Logged out successfully' });
		});

		Utils.successMessage('AuthEngine: Core routes registered');
	}

	/**
	 * Initialize OAuth providers
	 */
	private async initializeOAuthProviders(): Promise<void> {
		if (!this.config.providers) return;

		const providers = Object.entries(this.config.providers);

		for (const [name, providerConfig] of providers) {
			if (!providerConfig) continue;

			// Check if explicitly disabled
			if (typeof providerConfig === 'object' && providerConfig.enabled === false) {
				continue;
			}

			await this.registerOAuthProvider(name as OAuthProvider, providerConfig);
		}
	}

	/**
	 * Register a single OAuth provider
	 */
	private async registerOAuthProvider(
		provider: OAuthProvider,
		config: boolean | OAuthProviderConfig
	): Promise<void> {
		// NOTE: This is a placeholder implementation demonstrating the plugin architecture
		// Actual OAuth implementation would use arctic library here

		// Validate config exists
		if (config === true) {
			// Auto-detect from environment variables
			const envPrefix = provider.toUpperCase();
			const clientId = process.env[`${envPrefix}_CLIENT_ID`];
			const clientSecret = process.env[`${envPrefix}_CLIENT_SECRET`];

			if (!clientId || !clientSecret) {
				Utils.errorMessage(
					`AuthEngine: ${provider} OAuth config missing. Set ${envPrefix}_CLIENT_ID and ${envPrefix}_CLIENT_SECRET`
				);
				return;
			}
		} else if (config === false) {
			return; // Explicitly disabled
		}

		// Register routes for this provider
		// const baseUrl = this.config.baseUrl || `http://localhost:${process.env.PORT || 3000}`;
		// const callbackUrl = providerConfig.callbackUrl || `${baseUrl}/auth/${provider}/callback`;

		// OAuth initiate endpoint
		this.router.get(`/${provider}`, (_req, res) => {
			// This is a placeholder - actual implementation would use arctic or passport
			Utils.infoMessage(`AuthEngine: OAuth ${provider} initiated`);

			res.json({
				message: `OAuth ${provider} placeholder - integrate arctic or passport here`,
				redirectUrl: `https://oauth.${provider}.com/authorize`,
				note: 'This is a simplified implementation. Use arctic library for production.',
			});
		});

		// OAuth callback endpoint
		this.router.get(`/${provider}/callback`, async (_req, res) => {
			// This is a placeholder - actual implementation would handle OAuth callback
			Utils.infoMessage(`AuthEngine: OAuth ${provider} callback received`);

			res.json({
				message: `OAuth ${provider} callback placeholder`,
				note: 'Implement actual OAuth flow with arctic library',
			});
		});

		Utils.successMessage(`AuthEngine: OAuth provider '${provider}' registered`);
	}

	/**
	 * Initialize 2FA
	 */
	private async initialize2FA(): Promise<void> {
		if (!this.config.twoFactor) return;

		// Setup 2FA endpoint
		this.router.post('/2fa/setup', async (_req, res) => {
			Utils.infoMessage('AuthEngine: 2FA setup requested');

			res.json({
				message: '2FA setup placeholder',
				note: 'Implement TOTP with otpauth library',
			});
		});

		// Verify 2FA endpoint
		this.router.post('/2fa/verify', async (_req, res) => {
			Utils.infoMessage('AuthEngine: 2FA verification requested');

			res.json({
				message: '2FA verify placeholder',
				note: 'Implement TOTP verification',
			});
		});

		Utils.successMessage('AuthEngine: 2FA routes registered');
	}

	/**
	 * Initialize Magic Link
	 */
	private async initializeMagicLink(): Promise<void> {
		if (!this.config.magicLink) return;

		// Request magic link endpoint
		this.router.post('/magic-link/request', async (_req, res) => {
			Utils.infoMessage('AuthEngine: Magic link requested');

			res.json({
				message: 'Magic link placeholder',
				note: 'Implement magic link email sending',
			});
		});

		// Verify magic link endpoint
		this.router.get('/magic-link/verify', async (_req, res) => {
			Utils.infoMessage('AuthEngine: Magic link verification');

			res.json({
				message: 'Magic link verify placeholder',
				note: 'Implement token verification and auto-login',
			});
		});

		Utils.successMessage('AuthEngine: Magic Link routes registered');
	}

	/**
	 * Get auth service
	 */
	getAuthService(): AuthService {
		return this.authService;
	}

	/**
	 * Get router with all auth routes
	 */
	getRouter(): Router {
		return this.router;
	}

	/**
	 * Parse expires in string to milliseconds
	 */
	private parseExpiresIn(expiresIn: string): number {
		const units: { [key: string]: number } = {
			s: 1000,
			m: 60 * 1000,
			h: 60 * 60 * 1000,
			d: 24 * 60 * 60 * 1000,
		};

		const match = expiresIn.match(/^(\d+)([smhd])$/);
		if (!match) {
			return 7 * 24 * 60 * 60 * 1000; // Default 7 days
		}

		const [, value, unit] = match;
		return parseInt(value) * units[unit];
	}
}
