// Export types
export * from './types';

// Export auth service
export { AuthService } from './AuthService';

// Export abilities
export { defineAbilitiesFor, checkPermission, getUserPermissions, serializeAbility } from './abilities';
export type { AppAbility } from './abilities';

// Export middlewares
export {
	authenticate,
	optionalAuthenticate,
	requireRole,
	authorize,
	requireOwnership,
	rateLimitAuth,
	requireEmailVerification,
} from './middlewares';
