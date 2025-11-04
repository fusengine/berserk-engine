import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import * as Utils from '../utils';
import {
	AuthUser,
	LoginCredentials,
	RegisterCredentials,
	AuthResponse,
	Session,
	BetterAuthConfig,
	AuthErrorCode,
	Role,
} from './types';

/**
 * Authentication Service
 * Handles user authentication, registration, and session management
 */
export class AuthService {
	private prisma: PrismaClient;
	private config: BetterAuthConfig;
	private readonly SALT_ROUNDS = 10;

	constructor(prisma: PrismaClient, config: BetterAuthConfig) {
		this.prisma = prisma;
		this.config = config;
	}

	/**
	 * Register a new user
	 */
	async register(credentials: RegisterCredentials): Promise<AuthResponse> {
		try {
			const { email, password, name } = credentials;

			// Check if user already exists
			const existingUser = await this.prisma.user.findUnique({
				where: { email },
			});

			if (existingUser) {
				return {
					success: false,
					error: AuthErrorCode.EMAIL_ALREADY_EXISTS,
					message: 'Email already registered',
				};
			}

			// Hash password
			const hashedPassword = await bcrypt.hash(password, this.SALT_ROUNDS);

			// Create user
			const user = await this.prisma.user.create({
				data: {
					email,
					password: hashedPassword,
					name,
					role: Role.USER,
					emailVerified: !this.config.emailVerification?.enabled,
				},
			});

			// Create session
			const session = await this.createSession(user.id);

			Utils.successMessage(`AuthService: User registered - ${email}`);

			return {
				success: true,
				user: this.sanitizeUser(user),
				token: session.token,
				message: 'Registration successful',
			};
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'Unknown error';
			Utils.errorMessage(`AuthService registration error: ${errorMessage}`);
			return {
				success: false,
				error: 'REGISTRATION_FAILED',
				message: errorMessage,
			};
		}
	}

	/**
	 * Login user
	 */
	async login(credentials: LoginCredentials): Promise<AuthResponse> {
		try {
			const { email, password } = credentials;

			// Find user
			const user = await this.prisma.user.findUnique({
				where: { email },
			});

			if (!user) {
				return {
					success: false,
					error: AuthErrorCode.INVALID_CREDENTIALS,
					message: 'Invalid credentials',
				};
			}

			// Verify password
			const isValidPassword = await bcrypt.compare(password, user.password);

			if (!isValidPassword) {
				return {
					success: false,
					error: AuthErrorCode.INVALID_CREDENTIALS,
					message: 'Invalid credentials',
				};
			}

			// Check email verification if enabled
			if (this.config.emailVerification?.enabled && !user.emailVerified) {
				return {
					success: false,
					error: AuthErrorCode.EMAIL_NOT_VERIFIED,
					message: 'Email not verified',
				};
			}

			// Create session
			const session = await this.createSession(user.id);

			Utils.successMessage(`AuthService: User logged in - ${email}`);

			return {
				success: true,
				user: this.sanitizeUser(user),
				token: session.token,
				message: 'Login successful',
			};
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'Unknown error';
			Utils.errorMessage(`AuthService login error: ${errorMessage}`);
			return {
				success: false,
				error: 'LOGIN_FAILED',
				message: errorMessage,
			};
		}
	}

	/**
	 * Logout user
	 */
	async logout(token: string): Promise<boolean> {
		try {
			await this.prisma.session.delete({
				where: { token },
			});

			Utils.infoMessage('AuthService: User logged out');
			return true;
		} catch (error) {
			Utils.errorMessage('AuthService: Logout failed');
			return false;
		}
	}

	/**
	 * Verify session token
	 */
	async verifyToken(token: string): Promise<AuthUser | null> {
		try {
			const session = await this.prisma.session.findUnique({
				where: { token },
				include: { user: true },
			});

			if (!session) {
				return null;
			}

			// Check if session expired
			if (session.expiresAt < new Date()) {
				await this.prisma.session.delete({
					where: { id: session.id },
				});
				return null;
			}

			return this.sanitizeUser(session.user);
		} catch (error) {
			Utils.errorMessage('AuthService: Token verification failed');
			return null;
		}
	}

	/**
	 * Get user by ID
	 */
	async getUserById(userId: string): Promise<AuthUser | null> {
		try {
			const user = await this.prisma.user.findUnique({
				where: { id: userId },
			});

			if (!user) {
				return null;
			}

			return this.sanitizeUser(user);
		} catch (error) {
			return null;
		}
	}

	/**
	 * Update user role
	 */
	async updateUserRole(userId: string, role: Role): Promise<boolean> {
		try {
			await this.prisma.user.update({
				where: { id: userId },
				data: { role },
			});

			Utils.successMessage(`AuthService: User role updated - ${userId} -> ${role}`);
			return true;
		} catch (error) {
			Utils.errorMessage('AuthService: Role update failed');
			return false;
		}
	}

	/**
	 * Create a new session
	 */
	private async createSession(userId: string): Promise<Session> {
		const token = this.generateToken();
		const expiresIn = this.parseExpiresIn(this.config.session?.expiresIn || '7d');

		const session = await this.prisma.session.create({
			data: {
				userId,
				token,
				expiresAt: new Date(Date.now() + expiresIn),
			},
		});

		return session;
	}

	/**
	 * Generate secure token
	 */
	private generateToken(): string {
		return crypto.randomBytes(32).toString('hex');
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

	/**
	 * Remove sensitive data from user object
	 */
	private sanitizeUser(user: any): AuthUser {
		return {
			id: user.id,
			email: user.email,
			name: user.name,
			role: user.role,
			emailVerified: user.emailVerified,
			createdAt: user.createdAt,
			updatedAt: user.updatedAt,
		};
	}

	/**
	 * Clean up expired sessions
	 */
	async cleanupExpiredSessions(): Promise<void> {
		try {
			const result = await this.prisma.session.deleteMany({
				where: {
					expiresAt: {
						lt: new Date(),
					},
				},
			});

			if (result.count > 0) {
				Utils.infoMessage(`AuthService: Cleaned up ${result.count} expired sessions`);
			}
		} catch (error) {
			Utils.errorMessage('AuthService: Session cleanup failed');
		}
	}
}
