/**
 * Example Application using Berserk Engine with PostgreSQL
 */
import { Router } from 'express';
import { engine, app, getDatabase } from '@fusengine/berserk-engine';
import config from './config.postgresql.example';

// API Routes
const apiRouter = Router();

// Example: Get all users
apiRouter.get('/users', async (req, res) => {
	try {
		const db = getDatabase();

		if (!db || !db.isConnected()) {
			return res.status(500).json({
				error: 'Database not connected',
			});
		}

		const prisma = db.getClient();

		// Example Prisma query
		const users = await prisma.user.findMany({
			select: {
				id: true,
				email: true,
				name: true,
				createdAt: true,
			},
		});

		res.json({
			success: true,
			count: users.length,
			data: users,
		});
	} catch (error) {
		console.error('Error fetching users:', error);
		res.status(500).json({
			error: 'Internal server error',
			message: error instanceof Error ? error.message : 'Unknown error',
		});
	}
});

// Example: Create a user
apiRouter.post('/users', async (req, res) => {
	try {
		const { email, name, password } = req.body;

		if (!email || !password) {
			return res.status(400).json({
				error: 'Email and password are required',
			});
		}

		const db = getDatabase();

		if (!db || !db.isConnected()) {
			return res.status(500).json({
				error: 'Database not connected',
			});
		}

		const prisma = db.getClient();

		// Create user
		const user = await prisma.user.create({
			data: {
				email,
				name,
				password, // In production, hash the password first!
			},
			select: {
				id: true,
				email: true,
				name: true,
				createdAt: true,
			},
		});

		res.status(201).json({
			success: true,
			data: user,
		});
	} catch (error) {
		console.error('Error creating user:', error);
		res.status(500).json({
			error: 'Internal server error',
			message: error instanceof Error ? error.message : 'Unknown error',
		});
	}
});

// Example: Get user by ID
apiRouter.get('/users/:id', async (req, res) => {
	try {
		const id = parseInt(req.params.id);

		if (isNaN(id)) {
			return res.status(400).json({
				error: 'Invalid user ID',
			});
		}

		const db = getDatabase();

		if (!db || !db.isConnected()) {
			return res.status(500).json({
				error: 'Database not connected',
			});
		}

		const prisma = db.getClient();

		const user = await prisma.user.findUnique({
			where: { id },
			select: {
				id: true,
				email: true,
				name: true,
				createdAt: true,
				posts: {
					select: {
						id: true,
						title: true,
						published: true,
					},
				},
			},
		});

		if (!user) {
			return res.status(404).json({
				error: 'User not found',
			});
		}

		res.json({
			success: true,
			data: user,
		});
	} catch (error) {
		console.error('Error fetching user:', error);
		res.status(500).json({
			error: 'Internal server error',
			message: error instanceof Error ? error.message : 'Unknown error',
		});
	}
});

// HTTP Routes (for web pages)
const httpRouter = Router();

httpRouter.get('/', (req, res) => {
	res.send('<h1>Welcome to Berserk Engine!</h1><p>API available at /api</p>');
});

// Initialize the engine
(async () => {
	try {
		await engine(config, null, apiRouter, httpRouter);
		console.log('✅ Berserk Engine initialized successfully');
	} catch (error) {
		console.error('❌ Failed to initialize Berserk Engine:', error);
		process.exit(1);
	}
})();

// Graceful shutdown
process.on('SIGTERM', async () => {
	console.log('SIGTERM received, shutting down gracefully...');

	const db = getDatabase();
	if (db) {
		await db.disconnect();
		console.log('Database disconnected');
	}

	process.exit(0);
});

export default app;
