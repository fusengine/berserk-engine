# Authentication in Berserk Engine

Berserk Engine now includes a complete authentication system powered by **Better Auth** principles and best practices.

## Features

- ✅ **User Registration & Login**
- ✅ **Session Management** with automatic token generation
- ✅ **Password Hashing** with bcrypt
- ✅ **JWT/Token Authentication**
- ✅ **Cookie Support** for web applications
- ✅ **Email Verification** (optional)
- ✅ **Session Cleanup** (automatic expired session removal)
- ✅ **Rate Limiting** for auth routes
- ✅ **TypeScript** type-safe throughout

## Quick Start

### 1. Setup Database

Copy the auth Prisma schema:

```bash
cp prisma/schema.example.auth.prisma prisma/schema.prisma
```

Edit `prisma/schema.prisma` to match your database type (postgresql, mysql).

Generate Prisma client:

```bash
npx prisma generate
```

Run migrations:

```bash
npx prisma migrate dev --name init_auth
```

### 2. Configure Authentication

In your `config.ts`:

```typescript
import { BerserkConfig } from '@fusengine/berserk-engine';

const config: BerserkConfig = {
  portNumber: 3000,

  // Database (required for auth)
  database: {
    type: 'postgresql',
    host: 'localhost',
    port: 5432,
    database: 'myapp',
    username: 'postgres',
    password: 'password',
  },

  // Enable authentication
  auth: {
    enabled: true,
    secret: process.env.AUTH_SECRET || 'your-secret-key-min-32-chars',
    session: {
      expiresIn: '7d', // Session duration
      cookieName: 'auth_token',
      secure: process.env.NODE_ENV === 'production',
    },
    emailVerification: {
      enabled: false, // Set true to require email verification
      expiresIn: '24h',
    },
  },

  // Enable RBAC (optional but recommended)
  rbac: {
    enabled: true,
    defaultRole: 'USER',
  },

  cookieParserSecretKey: 'cookie-secret',
};

export default config;
```

### 3. Initialize Engine

```typescript
import { engine, app } from '@fusengine/berserk-engine';
import config from './config';

await engine(config);
```

## Usage

### Create Auth Routes

```typescript
import { Router } from 'express';
import { getAuthService } from '@fusengine/berserk-engine';

const authRouter = Router();

// Register
authRouter.post('/register', async (req, res) => {
  const authService = getAuthService();
  const result = await authService.register(req.body);
  res.status(result.success ? 201 : 400).json(result);
});

// Login
authRouter.post('/login', async (req, res) => {
  const authService = getAuthService();
  const result = await authService.login(req.body);

  if (result.success && result.token) {
    // Set cookie
    res.cookie('auth_token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
  }

  res.json(result);
});

// Logout
authRouter.post('/logout', async (req, res) => {
  const authService = getAuthService();
  const token = req.cookies.auth_token || req.headers.authorization?.replace('Bearer ', '');

  if (token) {
    await authService.logout(token);
    res.clearCookie('auth_token');
  }

  res.json({ success: true, message: 'Logged out' });
});

export default authRouter;
```

### Protect Routes with Authentication

```typescript
import { Router } from 'express';
import { authenticate, getAuthService } from '@fusengine/berserk-engine';

const apiRouter = Router();

// Protected route - requires authentication
apiRouter.get('/profile', authenticate(getAuthService()!), (req, res) => {
  // req.user is automatically populated
  res.json({
    success: true,
    user: req.user,
  });
});

// Optional authentication - user may or may not be logged in
import { optionalAuthenticate } from '@fusengine/berserk-engine';

apiRouter.get('/posts', optionalAuthenticate(getAuthService()!), (req, res) => {
  // req.user will be populated if authenticated, null otherwise
  if (req.user) {
    // Show private posts too
  } else {
    // Show only public posts
  }
});
```

### Role-Based Protection

```typescript
import { authenticate, requireRole, Role, getAuthService } from '@fusengine/berserk-engine';

// Admin only route
apiRouter.get(
  '/admin/users',
  authenticate(getAuthService()!),
  requireRole(Role.ADMIN),
  (req, res) => {
    // Only admins can access this
    res.json({ users: [] });
  }
);

// Moderator or Admin
apiRouter.delete(
  '/posts/:id',
  authenticate(getAuthService()!),
  requireRole(Role.MODERATOR, Role.ADMIN),
  (req, res) => {
    res.json({ success: true });
  }
);
```

## Authentication Methods

### 1. Bearer Token (Recommended for APIs)

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:3000/api/profile
```

In your client:

```typescript
fetch('/api/profile', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

### 2. Cookie (Recommended for Web Apps)

The token is automatically stored in a cookie after login. No additional headers needed.

```typescript
fetch('/api/profile', {
  credentials: 'include' // Important!
});
```

### 3. Query Parameter (Not Recommended)

```bash
curl http://localhost:3000/api/profile?token=YOUR_TOKEN
```

## API Reference

### AuthService

Get the auth service instance:

```typescript
import { getAuthService } from '@fusengine/berserk-engine';

const authService = getAuthService();
```

#### `register(credentials)`

Register a new user.

```typescript
const result = await authService.register({
  email: 'user@example.com',
  password: 'password123',
  name: 'John Doe' // optional
});

// Returns: AuthResponse
// {
//   success: boolean,
//   user?: AuthUser,
//   token?: string,
//   message?: string,
//   error?: string
// }
```

#### `login(credentials)`

Login user.

```typescript
const result = await authService.login({
  email: 'user@example.com',
  password: 'password123'
});
```

#### `logout(token)`

Logout user and invalidate token.

```typescript
await authService.logout(token);
```

#### `verifyToken(token)`

Verify and get user from token.

```typescript
const user = await authService.verifyToken(token);
// Returns: AuthUser | null
```

#### `getUserById(userId)`

Get user by ID.

```typescript
const user = await authService.getUserById('user-id');
```

#### `updateUserRole(userId, role)`

Update user role (admin only).

```typescript
await authService.updateUserRole('user-id', Role.ADMIN);
```

### Middlewares

#### `authenticate(authService)`

Require authentication.

```typescript
app.get('/protected', authenticate(authService), (req, res) => {
  // req.user is available
});
```

#### `optionalAuthenticate(authService)`

Optional authentication.

```typescript
app.get('/posts', optionalAuthenticate(authService), (req, res) => {
  // req.user may or may not be present
});
```

#### `requireRole(...roles)`

Require specific role(s).

```typescript
app.get('/admin', requireRole(Role.ADMIN), (req, res) => {
  // Only admins
});
```

#### `rateLimitAuth(maxAttempts, windowMs)`

Rate limit auth routes.

```typescript
authRouter.post('/login', rateLimitAuth(5, 15 * 60 * 1000), async (req, res) => {
  // Max 5 attempts per 15 minutes
});
```

#### `requireEmailVerification()`

Require email to be verified.

```typescript
app.get('/sensitive', requireEmailVerification(), (req, res) => {
  // Only verified users
});
```

## Configuration Options

### AuthConfig

```typescript
auth: {
  enabled: boolean;              // Enable/disable auth system
  secret: string;                // Secret key for tokens (min 32 chars)
  session?: {
    expiresIn?: string;         // '7d', '24h', '30m', etc.
    cookieName?: string;        // Cookie name (default: 'auth_token')
    secure?: boolean;           // HTTPS only (production)
  };
  emailVerification?: {
    enabled: boolean;           // Require email verification
    expiresIn?: string;        // Verification token expiry
  };
}
```

### RBACConfig

```typescript
rbac: {
  enabled: boolean;             // Enable RBAC system
  defaultRole?: Role;          // Default role for new users
  customRoles?: string[];      // Custom roles beyond USER/MODERATOR/ADMIN
}
```

## User Roles

Berserk Engine includes 3 built-in roles:

- **USER** - Default role, basic access
- **MODERATOR** - Can manage content
- **ADMIN** - Full access to everything

See [RBAC.md](./RBAC.md) for detailed permission management.

## Security Best Practices

### 1. Use Strong Secrets

```typescript
// ❌ Bad
secret: 'secret'

// ✅ Good
secret: process.env.AUTH_SECRET // Min 32 characters
```

### 2. Enable HTTPS in Production

```typescript
auth: {
  session: {
    secure: process.env.NODE_ENV === 'production'
  }
}
```

### 3. Use Environment Variables

```bash
# .env
AUTH_SECRET=your-super-secret-key-min-32-chars-long
DB_PASSWORD=strong-database-password
COOKIE_SECRET=another-secret-key
```

### 4. Rate Limit Auth Routes

```typescript
authRouter.post('/login', rateLimitAuth(5, 15 * 60 * 1000), loginHandler);
```

### 5. Hash Passwords

Passwords are automatically hashed with bcrypt (10 rounds). Never store plain passwords!

### 6. Validate Input

```typescript
authRouter.post('/register', async (req, res) => {
  const { email, password } = req.body;

  // Validate email format
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Invalid email' });
  }

  // Validate password strength
  if (!password || password.length < 8) {
    return res.status(400).json({ error: 'Password too short' });
  }

  // Continue with registration...
});
```

## Testing Auth

### Register a user

```bash
curl -X POST http://localhost:3000/auth/register \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'
```

### Login

```bash
curl -X POST http://localhost:3000/auth/login \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Access protected route

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/profile
```

## Troubleshooting

### "Auth service not available"

Make sure:
1. Database is configured and connected
2. Auth is enabled in config: `auth: { enabled: true }`
3. Engine is initialized with `await engine(config)`

### "Invalid or expired token"

Tokens expire based on `session.expiresIn` config. User needs to login again.

### "Email already registered"

The email is already in use. Use a different email or login with existing account.

### TypeScript errors

Run `npx prisma generate` after changing schema.

## Examples

See complete examples in `/examples`:

- `examples/config.auth.example.ts` - Configuration
- `examples/app.auth.example.ts` - Full application with auth routes

## Next Steps

- Read [RBAC.md](./RBAC.md) for permission management with CASL
- Check [DATABASE.md](./DATABASE.md) for database setup
- See `examples/` for complete working examples
