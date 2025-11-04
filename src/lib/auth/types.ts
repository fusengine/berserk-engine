/**
 * Authentication and Authorization Types (Enhanced for Plugin System)
 */

/**
 * User roles
 */
export enum Role {
	USER = 'USER',
	MODERATOR = 'MODERATOR',
	ADMIN = 'ADMIN',
}

/**
 * OAuth Provider types
 */
export type OAuthProvider =
	| 'google'
	| 'github'
	| 'facebook'
	| 'discord'
	| 'twitter'
	| 'microsoft'
	| 'apple'
	| 'linkedin';

/**
 * 2FA Method types
 */
export type TwoFactorMethod = 'totp' | 'sms' | 'email';

/**
 * OAuth provider configuration
 */
export interface OAuthProviderConfig {
	clientId: string;
	clientSecret: string;
	scope?: string[];
	callbackUrl?: string;
	enabled?: boolean;
}

/**
 * Two-Factor Authentication configuration
 */
export interface TwoFactorConfig {
	enabled: boolean;
	methods?: TwoFactorMethod[];
	required?: boolean; // Mandatory for all users or optional
	issuer?: string; // TOTP issuer name
}

/**
 * Magic Link configuration
 */
export interface MagicLinkConfig {
	enabled: boolean;
	expiresIn?: string; // e.g., '15m', '1h'
	sendEmail?: (email: string, link: string) => Promise<void>;
}

/**
 * Email Verification configuration
 */
export interface EmailVerificationConfig {
	enabled: boolean;
	expiresIn?: string;
	required?: boolean; // Block unverified users
	sendEmail?: (email: string, token: string) => Promise<void>;
}

/**
 * Passkey/WebAuthn configuration
 */
export interface PasskeyConfig {
	enabled: boolean;
	rpName?: string; // Relying Party name
	rpId?: string; // Domain
}

/**
 * Session configuration
 */
export interface SessionConfig {
	expiresIn?: string;
	cookieName?: string;
	secure?: boolean;
	sameSite?: 'strict' | 'lax' | 'none';
}

/**
 * Better Auth Enhanced configuration
 */
export interface BetterAuthConfig {
	enabled: boolean;
	secret: string;

	// Base URL for callbacks
	baseUrl?: string;

	// Session settings
	session?: SessionConfig;

	// Email/Password authentication
	emailPassword?: {
		enabled?: boolean;
		minPasswordLength?: number;
		requireEmailVerification?: boolean;
	};

	// OAuth providers (simplified config)
	providers?: {
		[K in OAuthProvider]?: boolean | OAuthProviderConfig;
	};

	// Two-Factor Authentication
	twoFactor?: TwoFactorConfig;

	// Magic Links (passwordless)
	magicLink?: MagicLinkConfig;

	// Email verification
	emailVerification?: EmailVerificationConfig;

	// Passkeys/WebAuthn
	passkey?: PasskeyConfig;

	// Account linking (link multiple OAuth accounts)
	accountLinking?: boolean;

	// Session management
	multiSession?: boolean; // Allow multiple sessions per user

	// Rate limiting
	rateLimit?: {
		enabled?: boolean;
		maxAttempts?: number;
		windowMs?: number;
	};
}

/**
 * RBAC configuration
 */
export interface RBACConfig {
	enabled: boolean;
	defaultRole?: Role;
	customRoles?: string[];
}

/**
 * Authenticated user interface
 */
export interface AuthUser {
	id: string;
	email: string;
	name?: string;
	role: Role;
	emailVerified: boolean;
	twoFactorEnabled?: boolean;
	createdAt: Date;
	updatedAt: Date;
}

/**
 * Session interface
 */
export interface Session {
	id: string;
	userId: string;
	token: string;
	expiresAt: Date;
	ipAddress?: string;
	userAgent?: string;
}

/**
 * Login credentials
 */
export interface LoginCredentials {
	email: string;
	password: string;
	twoFactorCode?: string;
}

/**
 * Register credentials
 */
export interface RegisterCredentials {
	email: string;
	password: string;
	name?: string;
}

/**
 * Auth response
 */
export interface AuthResponse {
	success: boolean;
	user?: AuthUser;
	token?: string;
	message?: string;
	error?: string;
	requiresTwoFactor?: boolean;
	twoFactorSessionId?: string;
}

/**
 * OAuth callback result
 */
export interface OAuthCallbackResult {
	success: boolean;
	user?: AuthUser;
	token?: string;
	isNewUser?: boolean;
	error?: string;
}

/**
 * Two-Factor setup result
 */
export interface TwoFactorSetupResult {
	success: boolean;
	secret?: string;
	qrCode?: string; // Data URL
	backupCodes?: string[];
	error?: string;
}

/**
 * Permission actions
 */
export type Action = 'create' | 'read' | 'update' | 'delete' | 'manage';

/**
 * Permission subjects
 */
export type Subject = 'User' | 'Post' | 'Comment' | 'all' | string;

/**
 * Auth error codes
 */
export enum AuthErrorCode {
	INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
	USER_NOT_FOUND = 'USER_NOT_FOUND',
	EMAIL_ALREADY_EXISTS = 'EMAIL_ALREADY_EXISTS',
	INVALID_TOKEN = 'INVALID_TOKEN',
	TOKEN_EXPIRED = 'TOKEN_EXPIRED',
	UNAUTHORIZED = 'UNAUTHORIZED',
	FORBIDDEN = 'FORBIDDEN',
	EMAIL_NOT_VERIFIED = 'EMAIL_NOT_VERIFIED',
	TWO_FACTOR_REQUIRED = 'TWO_FACTOR_REQUIRED',
	INVALID_TWO_FACTOR_CODE = 'INVALID_TWO_FACTOR_CODE',
	OAUTH_ERROR = 'OAUTH_ERROR',
	PASSKEY_ERROR = 'PASSKEY_ERROR',
}

/**
 * Auth plugin interface
 */
export interface AuthPlugin {
	name: string;
	initialize?: () => Promise<void>;
	routes?: {
		path: string;
		method: 'GET' | 'POST' | 'PUT' | 'DELETE';
		handler: any;
	}[];
}
