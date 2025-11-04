import { Request, Response, NextFunction } from 'express';
import { AuthService } from './AuthService';
import { AuthUser, Role, Action, Subject, AuthErrorCode } from './types';
import { checkPermission } from './abilities';
import * as Utils from '../utils';

// Extend Express Request to include user
declare global {
	namespace Express {
		interface Request {
			user?: AuthUser;
		}
	}
}

/**
 * Extract token from request
 */
function extractToken(req: Request): string | null {
	// Check Authorization header (Bearer token)
	const authHeader = req.headers.authorization;
	if (authHeader && authHeader.startsWith('Bearer ')) {
		return authHeader.substring(7);
	}

	// Check cookie
	const cookieToken = req.cookies?.['auth_token'];
	if (cookieToken) {
		return cookieToken;
	}

	// Check query parameter (not recommended for production)
	if (req.query.token && typeof req.query.token === 'string') {
		return req.query.token;
	}

	return null;
}

/**
 * Authentication middleware
 * Verifies that the user is authenticated
 */
export function authenticate(authService: AuthService) {
	return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		try {
			const token = extractToken(req);

			if (!token) {
				res.status(401).json({
					success: false,
					error: AuthErrorCode.UNAUTHORIZED,
					message: 'Authentication required',
				});
				return;
			}

			const user = await authService.verifyToken(token);

			if (!user) {
				res.status(401).json({
					success: false,
					error: AuthErrorCode.INVALID_TOKEN,
					message: 'Invalid or expired token',
				});
				return;
			}

			// Attach user to request
			req.user = user;
			next();
		} catch (error) {
			Utils.errorMessage('Authentication middleware error');
			res.status(500).json({
				success: false,
				error: 'INTERNAL_ERROR',
				message: 'Authentication failed',
			});
		}
	};
}

/**
 * Optional authentication middleware
 * Tries to authenticate but doesn't fail if no token
 */
export function optionalAuthenticate(authService: AuthService) {
	return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
		try {
			const token = extractToken(req);

			if (token) {
				const user = await authService.verifyToken(token);
				if (user) {
					req.user = user;
				}
			}

			next();
		} catch (error) {
			// Silently fail and continue
			next();
		}
	};
}

/**
 * Role-based authorization middleware
 * Requires user to have one of the specified roles
 */
export function requireRole(...roles: Role[]) {
	return (req: Request, res: Response, next: NextFunction): void => {
		if (!req.user) {
			res.status(401).json({
				success: false,
				error: AuthErrorCode.UNAUTHORIZED,
				message: 'Authentication required',
			});
			return;
		}

		if (!roles.includes(req.user.role)) {
			res.status(403).json({
				success: false,
				error: AuthErrorCode.FORBIDDEN,
				message: 'Insufficient permissions',
			});
			return;
		}

		next();
	};
}

/**
 * Permission-based authorization middleware using CASL
 * Requires user to have permission to perform action on subject
 */
export function authorize(action: Action, subject: Subject, conditions?: any) {
	return (req: Request, res: Response, next: NextFunction): void => {
		if (!req.user) {
			res.status(401).json({
				success: false,
				error: AuthErrorCode.UNAUTHORIZED,
				message: 'Authentication required',
			});
			return;
		}

		const hasPermission = checkPermission(req.user, action, subject, conditions);

		if (!hasPermission) {
			Utils.infoMessage(
				`Authorization denied: ${req.user.email} cannot ${action} ${subject}`
			);
			res.status(403).json({
				success: false,
				error: AuthErrorCode.FORBIDDEN,
				message: `You don't have permission to ${action} ${subject}`,
			});
			return;
		}

		next();
	};
}

/**
 * Resource ownership check middleware
 * Verifies that the user owns the resource or is admin
 */
export function requireOwnership(getUserIdFromResource: (req: Request) => string) {
	return (req: Request, res: Response, next: NextFunction): void => {
		if (!req.user) {
			res.status(401).json({
				success: false,
				error: AuthErrorCode.UNAUTHORIZED,
				message: 'Authentication required',
			});
			return;
		}

		// Admins can access everything
		if (req.user.role === Role.ADMIN) {
			next();
			return;
		}

		const resourceUserId = getUserIdFromResource(req);

		if (resourceUserId !== req.user.id) {
			res.status(403).json({
				success: false,
				error: AuthErrorCode.FORBIDDEN,
				message: 'You can only access your own resources',
			});
			return;
		}

		next();
	};
}

/**
 * Rate limiting middleware for authentication routes
 */
export function rateLimitAuth(maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000) {
	const attempts = new Map<string, { count: number; resetAt: number }>();

	return (req: Request, res: Response, next: NextFunction): void => {
		const identifier = req.ip || 'unknown';
		const now = Date.now();

		const userAttempts = attempts.get(identifier);

		if (userAttempts) {
			if (now > userAttempts.resetAt) {
				// Reset window
				attempts.set(identifier, { count: 1, resetAt: now + windowMs });
			} else if (userAttempts.count >= maxAttempts) {
				res.status(429).json({
					success: false,
					error: 'TOO_MANY_REQUESTS',
					message: 'Too many authentication attempts. Please try again later.',
				});
				return;
			} else {
				userAttempts.count++;
			}
		} else {
			attempts.set(identifier, { count: 1, resetAt: now + windowMs });
		}

		next();
	};
}

/**
 * Email verification required middleware
 */
export function requireEmailVerification() {
	return (req: Request, res: Response, next: NextFunction): void => {
		if (!req.user) {
			res.status(401).json({
				success: false,
				error: AuthErrorCode.UNAUTHORIZED,
				message: 'Authentication required',
			});
			return;
		}

		if (!req.user.emailVerified) {
			res.status(403).json({
				success: false,
				error: AuthErrorCode.EMAIL_NOT_VERIFIED,
				message: 'Email verification required',
			});
			return;
		}

		next();
	};
}
