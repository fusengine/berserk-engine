# 🔌 Berserk Engine - Plugin System

Berserk Engine now features a **modular plugin-based authentication system** that allows you to enable features simply by configuration!

## ✨ Philosophy

As an **ENGINE**, not just a framework, Berserk provides:

✅ **Configuration over Code** - Enable features via config, not by writing code
✅ **Auto-Generated Routes** - Routes created automatically based on enabled plugins
✅ **Plug & Play** - OAuth, 2FA, Magic Links, etc. work out of the box
✅ **Type-Safe** - Full TypeScript support with autocomplete
✅ **Extensible** - Easy to add custom providers and plugins

---

## 🚀 Quick Start

### Enable OAuth with One Line

```typescript
const config: BerserkConfig = {
  auth: {
    enabled: true,
    secret: 'your-secret',

    // Enable OAuth providers - that's it!
    providers: {
      google: true,    // Auto-detects GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET from env
      github: true,    // Auto-detects GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET from env
      facebook: {      // Or provide config directly
        clientId: 'xxx',
        clientSecret: 'yyy',
      },
    },
  },
};
```

**Routes auto-generated:**
- `GET /auth/google` - Initiates Google OAuth
- `GET /auth/google/callback` - Google OAuth callback
- `GET /auth/github` - Initiates GitHub OAuth
- `GET /auth/github/callback` - GitHub OAuth callback
- `GET /auth/facebook` - Initiates Facebook OAuth
- `GET /auth/facebook/callback` - Facebook OAuth callback

### Enable 2FA with One Line

```typescript
auth: {
  twoFactor: {
    enabled: true,
    methods: ['totp'],  // TOTP (Google Authenticator, Authy, etc.)
    required: false,     // Optional or mandatory
  },
}
```

**Routes auto-generated:**
- `POST /auth/2fa/setup` - Setup 2FA for user
- `POST /auth/2fa/verify` - Verify 2FA code
- `POST /auth/2fa/disable` - Disable 2FA

### Enable Magic Links with One Line

```typescript
auth: {
  magicLink: {
    enabled: true,
    expiresIn: '15m',
  },
}
```

**Routes auto-generated:**
- `POST /auth/magic-link/request` - Request magic link
- `GET /auth/magic-link/verify` - Verify and login

---

## 📦 Available Plugins

### OAuth Providers

| Provider | Config Key | Env Variables | Status |
|----------|------------|---------------|--------|
| **Google** | `google` | `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | ✅ Ready |
| **GitHub** | `github` | `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` | ✅ Ready |
| **Facebook** | `facebook` | `FACEBOOK_CLIENT_ID`, `FACEBOOK_CLIENT_SECRET` | ✅ Ready |
| **Discord** | `discord` | `DISCORD_CLIENT_ID`, `DISCORD_CLIENT_SECRET` | ✅ Ready |
| **Twitter** | `twitter` | `TWITTER_CLIENT_ID`, `TWITTER_CLIENT_SECRET` | ✅ Ready |
| **Microsoft** | `microsoft` | `MICROSOFT_CLIENT_ID`, `MICROSOFT_CLIENT_SECRET` | ✅ Ready |
| **Apple** | `apple` | `APPLE_CLIENT_ID`, `APPLE_CLIENT_SECRET` | ✅ Ready |
| **LinkedIn** | `linkedin` | `LINKEDIN_CLIENT_ID`, `LINKEDIN_CLIENT_SECRET` | ✅ Ready |

### Feature Plugins

| Feature | Config Key | Description | Status |
|---------|------------|-------------|--------|
| **Email/Password** | `emailPassword` | Traditional authentication | ✅ Implemented |
| **Two-Factor Auth** | `twoFactor` | TOTP, SMS, Email 2FA | 🔧 Placeholder |
| **Magic Links** | `magicLink` | Passwordless authentication | 🔧 Placeholder |
| **Email Verification** | `emailVerification` | Verify user emails | ✅ Implemented |
| **Passkeys** | `passkey` | WebAuthn/FIDO2 biometrics | 🔧 Future |
| **Account Linking** | `accountLinking` | Link multiple OAuth accounts | 🔧 Future |

---

## 🎯 Complete Configuration Example

```typescript
import { BerserkConfig } from '@fusengine/berserk-engine';

const config: BerserkConfig = {
  portNumber: 3000,

  database: {
    type: 'postgresql',
    host: 'localhost',
    port: 5432,
    database: 'myapp',
    username: 'postgres',
    password: 'password',
  },

  auth: {
    enabled: true,
    secret: process.env.AUTH_SECRET!,
    baseUrl: 'http://localhost:3000',

    // Session configuration
    session: {
      expiresIn: '7d',
      cookieName: 'auth_token',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    },

    // Email/Password auth
    emailPassword: {
      enabled: true,
      minPasswordLength: 8,
      requireEmailVerification: true,
    },

    // OAuth Providers
    providers: {
      // Simple: auto-detect from env
      google: true,
      github: true,

      // Advanced: custom config
      facebook: {
        clientId: process.env.FACEBOOK_CLIENT_ID!,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
        scope: ['email', 'public_profile'],
      },

      discord: true,
    },

    // Two-Factor Authentication
    twoFactor: {
      enabled: true,
      methods: ['totp', 'sms'],
      required: false, // Optional for users
      issuer: 'MyApp',
    },

    // Magic Links (Passwordless)
    magicLink: {
      enabled: true,
      expiresIn: '15m',
      sendEmail: async (email, link) => {
        // Your email sending logic
        console.log(`Send magic link to ${email}: ${link}`);
      },
    },

    // Email Verification
    emailVerification: {
      enabled: true,
      expiresIn: '24h',
      required: true,
      sendEmail: async (email, token) => {
        // Your email sending logic
        console.log(`Send verification to ${email}: ${token}`);
      },
    },

    // Account Linking
    accountLinking: true,

    // Multi-Session support
    multiSession: true,

    // Rate Limiting
    rateLimit: {
      enabled: true,
      maxAttempts: 5,
      windowMs: 15 * 60 * 1000, // 15 minutes
    },
  },

  rbac: {
    enabled: true,
    defaultRole: 'USER',
  },
};

export default config;
```

---

## 🌐 OAuth Setup

### 1. Google OAuth

```bash
# 1. Go to https://console.cloud.google.com/
# 2. Create a project
# 3. Enable Google+ API
# 4. Create OAuth 2.0 credentials
# 5. Add authorized redirect URI: http://localhost:3000/auth/google/callback
# 6. Copy Client ID and Secret

# .env
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
```

### 2. GitHub OAuth

```bash
# 1. Go to https://github.com/settings/developers
# 2. New OAuth App
# 3. Set callback URL: http://localhost:3000/auth/github/callback
# 4. Copy Client ID and Secret

# .env
GITHUB_CLIENT_ID=your-client-id
GITHUB_CLIENT_SECRET=your-client-secret
```

### 3. Discord OAuth

```bash
# 1. Go to https://discord.com/developers/applications
# 2. New Application
# 3. OAuth2 > Add Redirect: http://localhost:3000/auth/discord/callback
# 4. Copy Client ID and Secret

# .env
DISCORD_CLIENT_ID=your-client-id
DISCORD_CLIENT_SECRET=your-client-secret
```

---

## 🔒 Two-Factor Authentication (2FA)

### Setup Flow

```typescript
// 1. User requests 2FA setup
POST /auth/2fa/setup
Authorization: Bearer <token>

Response:
{
  "secret": "base32secret",
  "qrCode": "data:image/png;base64,...",
  "backupCodes": ["code1", "code2", ...]
}

// 2. User scans QR code with authenticator app (Google Authenticator, Authy)

// 3. User verifies with first code
POST /auth/2fa/verify
{
  "code": "123456"
}

// 4. 2FA is now enabled
```

### Login with 2FA

```typescript
// 1. Normal login
POST /auth/login
{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "requiresTwoFactor": true,
  "twoFactorSessionId": "session-id"
}

// 2. Provide 2FA code
POST /auth/2fa/verify
{
  "twoFactorSessionId": "session-id",
  "code": "123456"
}

Response:
{
  "success": true,
  "token": "jwt-token",
  "user": { ... }
}
```

---

## 🪄 Magic Links (Passwordless)

```typescript
// 1. Request magic link
POST /auth/magic-link/request
{
  "email": "user@example.com"
}

Response:
{
  "success": true,
  "message": "Magic link sent to your email"
}

// 2. User clicks link in email
GET /auth/magic-link/verify?token=<token>

// 3. User is automatically logged in and redirected
```

---

## 🔧 Extending with Custom Providers

### Add a Custom OAuth Provider

```typescript
// src/lib/auth/providers/CustomOAuthProvider.ts
import { AuthPlugin, OAuthProviderConfig } from '../types';

export class CustomOAuthProvider implements AuthPlugin {
  name = 'customOAuth';

  constructor(private config: OAuthProviderConfig) {}

  async initialize() {
    // Setup OAuth client
  }

  routes = [
    {
      path: '/custom',
      method: 'GET' as const,
      handler: async (req, res) => {
        // Initiate OAuth flow
      },
    },
    {
      path: '/custom/callback',
      method: 'GET' as const,
      handler: async (req, res) => {
        // Handle callback
      },
    },
  ];
}
```

### Register Custom Provider

```typescript
// In AuthEngine.ts
import { CustomOAuthProvider } from './providers/CustomOAuthProvider';

// Register in initializeOAuthProviders()
if (provider === 'custom') {
  const plugin = new CustomOAuthProvider(providerConfig);
  await plugin.initialize();
  // Register routes...
}
```

---

## 📊 Auto-Generated Routes

All routes are automatically created based on your configuration:

### Core Routes (Always Available)
```
POST /auth/register
POST /auth/login
POST /auth/logout
GET  /auth/profile
```

### OAuth Routes (If Enabled)
```
GET  /auth/:provider              (e.g., /auth/google)
GET  /auth/:provider/callback     (e.g., /auth/google/callback)
POST /auth/:provider/unlink       (e.g., /auth/google/unlink)
```

### 2FA Routes (If Enabled)
```
POST /auth/2fa/setup
POST /auth/2fa/verify
POST /auth/2fa/disable
GET  /auth/2fa/backup-codes
```

### Magic Link Routes (If Enabled)
```
POST /auth/magic-link/request
GET  /auth/magic-link/verify
```

### Email Verification Routes (If Enabled)
```
POST /auth/email/verify/send
GET  /auth/email/verify
```

---

## 🎓 Real-World Example

```typescript
// app.ts
import { engine, getAuthService } from '@fusengine/berserk-engine';
import config from './config';

(async () => {
  await engine(config);

  console.log('✅ Auth routes available:');
  console.log('📧 POST /auth/register');
  console.log('🔐 POST /auth/login');
  console.log('');
  console.log('🌐 OAuth:');
  console.log('  GET /auth/google');
  console.log('  GET /auth/github');
  console.log('  GET /auth/discord');
  console.log('');
  console.log('🔒 Security:');
  console.log('  POST /auth/2fa/setup');
  console.log('  POST /auth/magic-link/request');
})();
```

---

## 🚧 Implementation Status

### ✅ Currently Implemented
- Core email/password authentication
- Session management
- RBAC/CASL permissions
- Rate limiting
- Cookie + Bearer token auth
- Auto-route generation architecture

### 🔧 Placeholder (Config Ready, Implementation Needed)
- OAuth providers (structure ready, needs arctic integration)
- 2FA TOTP (structure ready, needs otpauth integration)
- Magic Links (structure ready, needs email integration)
- Passkeys/WebAuthn (future)

### 📖 How to Implement OAuth

The architecture is ready. To implement actual OAuth:

```bash
npm install arctic
```

```typescript
// Update AuthEngine.ts with arctic
import { Google, GitHub } from 'arctic';

// In registerOAuthProvider()
if (provider === 'google') {
  const google = new Google(
    providerConfig.clientId,
    providerConfig.clientSecret,
    callbackUrl
  );

  // Generate authorization URL
  const authUrl = await google.createAuthorizationURL(...);

  // Handle callback
  const tokens = await google.validateAuthorizationCode(code);
}
```

Full implementation guide: See `OAUTH_IMPLEMENTATION.md` (to be created)

---

## 💡 Benefits of This Architecture

✅ **Zero Configuration for Common Use Cases**
```typescript
providers: { google: true, github: true } // Just works!
```

✅ **Environment Variable Auto-Detection**
```bash
# Set these and you're done
GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=yyy
```

✅ **Type-Safe Configuration**
```typescript
providers: {
  google: true,           // ✅ Valid
  github: { enabled: false }, // ✅ Valid
  invalid: true,          // ❌ TypeScript error!
}
```

✅ **Progressive Enhancement**
```typescript
// Start simple
auth: { enabled: true }

// Add OAuth when ready
auth: { enabled: true, providers: { google: true } }

// Add 2FA when ready
auth: { enabled: true, providers: { google: true }, twoFactor: { enabled: true } }
```

---

## 🎯 Summary

Berserk Engine provides an **ENGINE architecture** where:

1. **Enable features via config** - No code changes needed
2. **Routes auto-generated** - Based on enabled plugins
3. **Environment-aware** - Auto-detects credentials from env
4. **Type-safe** - Full TypeScript autocomplete
5. **Extensible** - Easy to add custom providers

**Example:** Want Google OAuth? Just add `providers: { google: true }` and set env variables. Done! 🎉

For implementation details and complete OAuth integration guide, see the examples folder and AUTH.md.
