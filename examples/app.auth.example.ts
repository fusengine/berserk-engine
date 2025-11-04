/**
 * Example Application with Authentication and RBAC
 * Demonstrates complete auth setup with Better Auth + CASL
 */
import { Router } from 'express';
import {
	engine,
	app,
	getAuthService,
	authenticate,
	authorize,
	requireRole,
	Role,
} from '@fusengine/berserk-engine';
import config from './config.auth.example';

// ============================================
// AUTH ROUTES (Public)
// ============================================
const authRouter = Router();

// Register
authRouter.post('/register', async (req, res) => {
	const authService = getAuthService();
	if (!authService) {
		return res.status(500).json({ error: 'Auth service not available' });
	}

	const result = await authService.register(req.body);
	res.status(result.success ? 201 : 400).json(result);
});

// Login
authRouter.post('/login', async (req, res) => {
	const authService = getAuthService();
	if (!authService) {
		return res.status(500).json({ error: 'Auth service not available' });
	}

	const result = await authService.login(req.body);

	if (result.success && result.token) {
		// Set cookie
		res.cookie('auth_token', result.token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
		});
	}

	res.status(result.success ? 200 : 401).json(result);
});

// Logout
authRouter.post('/logout', authenticate(getAuthService()!), async (req, res) => {
	const authService = getAuthService();
	const token = req.cookies.auth_token || req.headers.authorization?.replace('Bearer ', '');

	if (token && authService) {
		await authService.logout(token);
		res.clearCookie('auth_token');
	}

	res.json({ success: true, message: 'Logged out successfully' });
});

// ============================================
// API ROUTES (Protected)
// ============================================
const apiRouter = Router();

// Get current user profile
apiRouter.get('/profile', authenticate(getAuthService()!), (req, res) => {
	res.json({
		success: true,
		user: req.user,
	});
});

// Update profile (own profile only)
apiRouter.put('/profile', authenticate(getAuthService()!), async (req, res) => {
	// Users can only update their own profile
	res.json({
		success: true,
		message: 'Profile updated',
	});
});

// Get all users (Admin only)
apiRouter.get(
	'/users',
	authenticate(getAuthService()!),
	requireRole(Role.ADMIN),
	async (req, res) => {
		// Only admins can see all users
		res.json({
			success: true,
			users: [
				/* List of users */
			],
		});
	}
);

// ============================================
// POST ROUTES (RBAC with CASL)
// ============================================

// Get all published posts (public)
apiRouter.get('/posts', async (req, res) => {
	// Public - anyone can read published posts
	res.json({
		success: true,
		posts: [
			/* Published posts */
		],
	});
});

// Get single post
apiRouter.get('/posts/:id', async (req, res) => {
	res.json({
		success: true,
		post: {
			/* Post details */
		},
	});
});

// Create post (authenticated users)
apiRouter.post(
	'/posts',
	authenticate(getAuthService()!),
	authorize('create', 'Post'),
	async (req, res) => {
		// Any authenticated user can create posts
		res.json({
			success: true,
			message: 'Post created',
		});
	}
);

// Update post (owner or admin)
apiRouter.put(
	'/posts/:id',
	authenticate(getAuthService()!),
	authorize('update', 'Post'),
	async (req, res) => {
		// CASL will check if user owns the post or is admin
		res.json({
			success: true,
			message: 'Post updated',
		});
	}
);

// Delete post (owner, moderator, or admin)
apiRouter.delete(
	'/posts/:id',
	authenticate(getAuthService()!),
	authorize('delete', 'Post'),
	async (req, res) => {
		// CASL will check permissions
		res.json({
			success: true,
			message: 'Post deleted',
		});
	}
);

// ============================================
// ADMIN ROUTES
// ============================================

// Update user role (Admin only)
apiRouter.put(
	'/admin/users/:id/role',
	authenticate(getAuthService()!),
	requireRole(Role.ADMIN),
	async (req, res) => {
		const authService = getAuthService();
		const { role } = req.body;

		if (!authService) {
			return res.status(500).json({ error: 'Auth service not available' });
		}

		const success = await authService.updateUserRole(req.params.id, role);

		res.json({
			success,
			message: success ? 'Role updated' : 'Failed to update role',
		});
	}
);

// ============================================
// WEB ROUTES (Frontend)
// ============================================
const httpRouter = Router();

httpRouter.get('/', (req, res) => {
	res.send(`
    <h1>🔐 Berserk Engine - Auth Example</h1>
    <h2>API Endpoints:</h2>
    <h3>Auth (Public):</h3>
    <ul>
      <li>POST /auth/register - Register new user</li>
      <li>POST /auth/login - Login</li>
      <li>POST /auth/logout - Logout</li>
    </ul>
    <h3>API (Protected):</h3>
    <ul>
      <li>GET /api/profile - Get current user</li>
      <li>PUT /api/profile - Update profile</li>
      <li>GET /api/users - Get all users (Admin only)</li>
    </ul>
    <h3>Posts (RBAC):</h3>
    <ul>
      <li>GET /api/posts - Public posts</li>
      <li>POST /api/posts - Create post (authenticated)</li>
      <li>PUT /api/posts/:id - Update post (owner/admin)</li>
      <li>DELETE /api/posts/:id - Delete post (owner/moderator/admin)</li>
    </ul>
    <h3>Admin:</h3>
    <ul>
      <li>PUT /api/admin/users/:id/role - Update user role (Admin only)</li>
    </ul>
  `);
});

// ============================================
// INITIALIZE ENGINE
// ============================================
(async () => {
	try {
		// Combine routers
		const combinedApiRouter = Router();
		combinedApiRouter.use('/auth', authRouter);
		combinedApiRouter.use('/api', apiRouter);

		await engine(config, null, combinedApiRouter, httpRouter);

		console.log('✅ Berserk Engine with Auth initialized successfully');
		console.log('');
		console.log('📝 Create a user:');
		console.log('  curl -X POST http://localhost:3000/auth/register \\');
		console.log("    -H 'Content-Type: application/json' \\");
		console.log('    -d \'{"email":"user@example.com","password":"password123","name":"John Doe"}\'');
		console.log('');
		console.log('🔑 Login:');
		console.log('  curl -X POST http://localhost:3000/auth/login \\');
		console.log("    -H 'Content-Type: application/json' \\");
		console.log('    -d \'{"email":"user@example.com","password":"password123"}\'');
	} catch (error) {
		console.error('❌ Failed to initialize:', error);
		process.exit(1);
	}
})();

export default app;
