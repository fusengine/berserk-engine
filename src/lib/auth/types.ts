/**
 * Authentication and Authorization Types
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
 * Authenticated user interface
 */
export interface AuthUser {
	id: string;
	email: string;
	name?: string;
	role: Role;
	emailVerified: boolean;
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
 * Better Auth configuration
 */
export interface BetterAuthConfig {
	enabled: boolean;
	secret: string;
	session?: {
		expiresIn?: string; // e.g., "7d", "24h", "30m"
		cookieName?: string;
		secure?: boolean;
	};
	emailVerification?: {
		enabled: boolean;
		expiresIn?: string;
	};
	oauth?: {
		providers?: Array<{
			name: string;
			clientId: string;
			clientSecret: string;
		}>;
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
 * Login credentials
 */
export interface LoginCredentials {
	email: string;
	password: string;
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
}
