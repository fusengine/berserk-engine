import { AbilityBuilder, PureAbility } from '@casl/ability';
import { AuthUser, Role, Action, Subject } from './types';

/**
 * App ability type
 */
export type AppAbility = PureAbility<[Action, Subject | string]>;

/**
 * Define abilities based on user role
 * This is the core RBAC/ABAC logic
 */
export function defineAbilitiesFor(user: AuthUser | null): AppAbility {
	const { can, cannot, build } = new AbilityBuilder<AppAbility>(PureAbility);

	if (!user) {
		// Anonymous users - very limited access
		can('read', 'Post', { published: true });
		return build();
	}

	// All authenticated users can read their own profile
	can('read', 'User', { id: user.id });
	can('update', 'User', { id: user.id });

	// All authenticated users can manage their own sessions
	can('read', 'Session', { userId: user.id });
	can('delete', 'Session', { userId: user.id });

	// Role-based permissions
	switch (user.role) {
		case Role.ADMIN:
			// Admins can do everything
			can('manage', 'all');
			break;

		case Role.MODERATOR:
			// Moderators can read everything
			can('read', 'all');

			// Can manage all posts
			can('create', 'Post');
			can('update', 'Post');
			can('delete', 'Post');

			// Can manage all comments
			can('create', 'Comment');
			can('update', 'Comment');
			can('delete', 'Comment');

			// Can read users but not modify
			can('read', 'User');

			// Cannot delete users
			cannot('delete', 'User');
			break;

		case Role.USER:
		default:
			// Users can read published posts
			can('read', 'Post', { published: true });

			// Users can create posts
			can('create', 'Post');

			// Users can only update/delete their own posts
			can('update', 'Post', { authorId: user.id });
			can('delete', 'Post', { authorId: user.id });

			// Users can read their own unpublished posts
			can('read', 'Post', { authorId: user.id });

			// Comments permissions
			can('create', 'Comment');
			can('update', 'Comment', { authorId: user.id });
			can('delete', 'Comment', { authorId: user.id });

			// Users cannot manage other users
			cannot('create', 'User');
			cannot('delete', 'User');
			break;
	}

	return build();
}

/**
 * Check if user can perform action on subject
 */
export function checkPermission(
	user: AuthUser | null,
	action: Action,
	subject: Subject,
	conditions?: any
): boolean {
	const ability = defineAbilitiesFor(user);
	return ability.can(action, subject, conditions);
}

/**
 * Get list of permissions for user
 */
export function getUserPermissions(user: AuthUser | null): string[] {
	const ability = defineAbilitiesFor(user);
	const permissions: string[] = [];

	// Convert ability rules to readable strings
	ability.rules.forEach((rule) => {
		const action = Array.isArray(rule.action) ? rule.action.join('|') : rule.action;
		const subject = Array.isArray(rule.subject) ? rule.subject.join('|') : rule.subject;
		const inverted = rule.inverted ? 'cannot' : 'can';
		permissions.push(`${inverted} ${action} ${subject}`);
	});

	return permissions;
}

/**
 * Serialize ability for client-side use
 */
export function serializeAbility(user: AuthUser | null): any {
	const ability = defineAbilitiesFor(user);
	return ability.rules;
}
