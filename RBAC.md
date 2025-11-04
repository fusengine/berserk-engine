# Role-Based Access Control (RBAC) with CASL

Berserk Engine includes a powerful **RBAC** (Role-Based Access Control) and **ABAC** (Attribute-Based Access Control) system powered by **CASL**.

## What is RBAC?

RBAC controls what users can do based on their **role**:

- **USER** - Basic users, can manage their own content
- **MODERATOR** - Can manage all content but not users
- **ADMIN** - Full access to everything

## What is ABAC?

ABAC adds **conditions** to permissions. For example:

- Users can **update** posts, **but only their own**
- Moderators can **delete** posts, **including others'**

## Features

- ✅ **Role-Based** permissions (USER, MODERATOR, ADMIN)
- ✅ **Attribute-Based** permissions (ownership, conditions)
- ✅ **Type-Safe** with TypeScript
- ✅ **Easy to extend** with custom roles
- ✅ **Granular control** per action and resource
- ✅ **Express middlewares** ready to use

## Quick Start

### 1. Enable RBAC

In your `config.ts`:

```typescript
const config: BerserkConfig = {
  // ... other config

  rbac: {
    enabled: true,
    defaultRole: 'USER', // Role for new users
  },
};
```

### 2. Use Authorization Middleware

```typescript
import { Router } from 'express';
import { authenticate, authorize, getAuthService } from '@fusengine/berserk-engine';

const apiRouter = Router();

// Anyone can create posts (if authenticated)
apiRouter.post(
  '/posts',
  authenticate(getAuthService()!),
  authorize('create', 'Post'),
  async (req, res) => {
    res.json({ message: 'Post created' });
  }
);

// Only post owner or admin can update
apiRouter.put(
  '/posts/:id',
  authenticate(getAuthService()!),
  authorize('update', 'Post'),
  async (req, res) => {
    // CASL checks if user owns the post
    res.json({ message: 'Post updated' });
  }
);

// Owner, moderator, or admin can delete
apiRouter.delete(
  '/posts/:id',
  authenticate(getAuthService()!),
  authorize('delete', 'Post'),
  async (req, res) => {
    res.json({ message: 'Post deleted' });
  }
);
```

## Built-in Permissions

### USER Role

**Can:**
- ✅ Read published posts
- ✅ Create posts
- ✅ Update **own** posts
- ✅ Delete **own** posts
- ✅ Read **own** profile
- ✅ Update **own** profile

**Cannot:**
- ❌ Access other users' data
- ❌ Delete other users' content
- ❌ Manage users

### MODERATOR Role

**Can (everything USER can, plus):**
- ✅ Read all posts (published and unpublished)
- ✅ Update **any** post
- ✅ Delete **any** post
- ✅ Read all users

**Cannot:**
- ❌ Delete users
- ❌ Change user roles
- ❌ Manage moderators or admins

### ADMIN Role

**Can:**
- ✅ **Everything** (manage all)
- ✅ Full access to all resources
- ✅ Manage users, roles, permissions
- ✅ Delete anything

## Permissions by Action

| Action | Resource | USER | MODERATOR | ADMIN |
|--------|----------|------|-----------|-------|
| **Read** | Published Post | ✅ | ✅ | ✅ |
| **Read** | Own Post | ✅ | ✅ | ✅ |
| **Read** | Any Post | ❌ | ✅ | ✅ |
| **Create** | Post | ✅ | ✅ | ✅ |
| **Update** | Own Post | ✅ | ✅ | ✅ |
| **Update** | Any Post | ❌ | ✅ | ✅ |
| **Delete** | Own Post | ✅ | ✅ | ✅ |
| **Delete** | Any Post | ❌ | ✅ | ✅ |
| **Read** | Own Profile | ✅ | ✅ | ✅ |
| **Update** | Own Profile | ✅ | ✅ | ✅ |
| **Read** | All Users | ❌ | ✅ | ✅ |
| **Create** | User | ❌ | ❌ | ✅ |
| **Delete** | User | ❌ | ❌ | ✅ |
| **Manage** | All | ❌ | ❌ | ✅ |

## Usage Examples

### Basic Authorization

```typescript
import { authorize } from '@fusengine/berserk-engine';

// Require permission to create posts
app.post('/posts', authorize('create', 'Post'), (req, res) => {
  // req.user is available
  // CASL already checked permissions
});
```

### Role-Based Authorization

```typescript
import { requireRole, Role } from '@fusengine/berserk-engine';

// Require specific role
app.get('/admin', requireRole(Role.ADMIN), (req, res) => {
  // Only admins can access
});

// Require one of multiple roles
app.get('/moderate', requireRole(Role.MODERATOR, Role.ADMIN), (req, res) => {
  // Moderators and admins can access
});
```

### Ownership Check

```typescript
import { requireOwnership } from '@fusengine/berserk-engine';

app.put(
  '/posts/:id',
  requireOwnership((req) => {
    // Extract owner ID from resource
    // This would typically come from database
    return req.params.authorId;
  }),
  (req, res) => {
    // Only the owner or admin can access
  }
);
```

### Manual Permission Check

```typescript
import { checkPermission } from '@fusengine/berserk-engine';

app.post('/posts/:id/publish', async (req, res) => {
  const canPublish = checkPermission(
    req.user,
    'update',
    'Post',
    { authorId: req.user.id }
  );

  if (!canPublish) {
    return res.status(403).json({ error: 'Cannot publish this post' });
  }

  // Continue...
});
```

### Check in Route Handler

```typescript
import { defineAbilitiesFor } from '@fusengine/berserk-engine';

app.get('/posts/:id', async (req, res) => {
  const post = await getPost(req.params.id);
  const ability = defineAbilitiesFor(req.user);

  // Check if user can read this specific post
  if (ability.can('read', 'Post', post)) {
    res.json(post);
  } else {
    res.status(403).json({ error: 'Access denied' });
  }
});
```

## Custom Permissions

You can customize permissions by modifying `src/lib/auth/abilities.ts`:

```typescript
export function defineAbilitiesFor(user: AuthUser | null): AppAbility {
  const { can, cannot, build } = new AbilityBuilder<AppAbility>(createPrismaAbility);

  if (!user) {
    // Anonymous users
    can('read', 'Post', { published: true });
    return build();
  }

  // Custom role: EDITOR
  if (user.role === 'EDITOR') {
    can('read', 'all');
    can('create', 'Post');
    can('update', 'Post');
    can('update', 'Post', { status: 'draft' }); // Only drafts
    cannot('delete', 'Post'); // Cannot delete
  }

  // Add custom conditions
  if (user.role === Role.USER) {
    // Users can publish if they have > 10 posts
    can('update', 'Post', {
      authorId: user.id,
      published: false // Can only update unpublished
    });
  }

  return build();
}
```

## CASL Subjects

Subjects are the resources you want to protect:

```typescript
type AppSubjects = Subjects<{
  User: any;      // User resources
  Post: any;      // Post resources
  Comment: any;   // Comment resources
  Session: any;   // Session resources
}>;
```

Add custom subjects:

```typescript
type AppSubjects = Subjects<{
  User: any;
  Post: any;
  Comment: any;
  Product: any;    // New: Products
  Order: any;      // New: Orders
  Invoice: any;    // New: Invoices
}>;
```

## Actions

Built-in actions:

- `create` - Create new resource
- `read` - Read/view resource
- `update` - Modify resource
- `delete` - Delete resource
- `manage` - Full access (all actions)

Custom actions:

```typescript
type Action =
  | 'create'
  | 'read'
  | 'update'
  | 'delete'
  | 'manage'
  | 'publish'    // Custom: Publish content
  | 'archive'    // Custom: Archive content
  | 'approve';   // Custom: Approve content
```

## Conditional Permissions

### Based on Resource Attributes

```typescript
// Users can only read their own unpublished posts
can('read', 'Post', {
  authorId: user.id,
  published: false
});

// Moderators can edit posts with less than 100 likes
can('update', 'Post', {
  likes: { $lt: 100 }
});
```

### Based on User Attributes

```typescript
// Premium users get extra permissions
if (user.isPremium) {
  can('create', 'Post', { type: 'premium' });
}

// Verified users can publish
if (user.emailVerified) {
  can('update', 'Post', { published: true });
}
```

## Prisma Integration

CASL integrates with Prisma queries:

```typescript
import { accessibleBy } from '@casl/prisma';
import { defineAbilitiesFor } from '@fusengine/berserk-engine';

// Get only posts the user can read
const ability = defineAbilitiesFor(req.user);

const posts = await prisma.post.findMany({
  where: accessibleBy(ability).Post,
});
```

## Client-Side Permissions

Send permissions to frontend:

```typescript
import { serializeAbility } from '@fusengine/berserk-engine';

app.get('/api/permissions', authenticate(authService), (req, res) => {
  const permissions = serializeAbility(req.user);
  res.json({ permissions });
});
```

Frontend usage (with @casl/ability):

```typescript
// Frontend
import { createMonad, PureAbility } from '@casl/ability';

const ability = new PureAbility(permissions);

// Check permissions
if (ability.can('update', 'Post')) {
  // Show edit button
}

if (ability.can('delete', 'Comment', comment)) {
  // Show delete button
}
```

## Testing Permissions

```typescript
import { checkPermission, Role } from '@fusengine/berserk-engine';

describe('Permissions', () => {
  const user = { id: '1', role: Role.USER };
  const moderator = { id: '2', role: Role.MODERATOR };
  const admin = { id: '3', role: Role.ADMIN };

  it('user can create posts', () => {
    expect(checkPermission(user, 'create', 'Post')).toBe(true);
  });

  it('user cannot delete other users posts', () => {
    expect(checkPermission(
      user,
      'delete',
      'Post',
      { authorId: 'other-user' }
    )).toBe(false);
  });

  it('moderator can delete any post', () => {
    expect(checkPermission(moderator, 'delete', 'Post')).toBe(true);
  });

  it('admin can do everything', () => {
    expect(checkPermission(admin, 'manage', 'all')).toBe(true);
  });
});
```

## Error Handling

```typescript
app.put('/posts/:id', authorize('update', 'Post'), async (req, res) => {
  // If user doesn't have permission, authorize() middleware
  // automatically returns 403 with:
  // {
  //   success: false,
  //   error: "FORBIDDEN",
  //   message: "You don't have permission to update Post"
  // }
});
```

Custom error messages:

```typescript
import { defineAbilitiesFor } from '@fusengine/berserk-engine';

app.put('/posts/:id', async (req, res) => {
  const ability = defineAbilitiesFor(req.user);

  if (!ability.can('update', 'Post')) {
    return res.status(403).json({
      error: 'You need to be a moderator to edit this post'
    });
  }

  // Continue...
});
```

## Best Practices

### 1. Always Check Permissions

```typescript
// ❌ Bad - No permission check
app.delete('/posts/:id', async (req, res) => {
  await deletePost(req.params.id);
});

// ✅ Good - With permission check
app.delete('/posts/:id', authorize('delete', 'Post'), async (req, res) => {
  await deletePost(req.params.id);
});
```

### 2. Check Ownership

```typescript
// ❌ Bad - Anyone can update any profile
app.put('/users/:id', async (req, res) => {
  await updateUser(req.params.id, req.body);
});

// ✅ Good - Only owner or admin
app.put('/users/:id', requireOwnership((req) => req.params.id), async (req, res) => {
  await updateUser(req.params.id, req.body);
});
```

### 3. Principle of Least Privilege

Give users the minimum permissions they need.

```typescript
// ❌ Bad - Too permissive
if (user.role === Role.USER) {
  can('manage', 'all'); // Too much!
}

// ✅ Good - Specific permissions
if (user.role === Role.USER) {
  can('read', 'Post', { published: true });
  can('create', 'Post');
  can('update', 'Post', { authorId: user.id });
}
```

### 4. Test Permissions Thoroughly

Write tests for all permission scenarios, especially edge cases.

## Advanced Usage

### Custom Ability Builder

```typescript
import { AbilityBuilder } from '@casl/ability';
import { createPrismaAbility } from '@casl/prisma';

export function defineAbilitiesForOrganization(user: AuthUser, orgId: string) {
  const { can, build } = new AbilityBuilder(createPrismaAbility);

  // Organization-specific permissions
  can('read', 'Project', { organizationId: orgId });

  if (user.isOrgAdmin) {
    can('manage', 'Project', { organizationId: orgId });
  }

  return build();
}
```

### Field-Level Permissions

```typescript
can('read', 'User', ['id', 'name', 'email']); // Only these fields
cannot('read', 'User', ['password', 'apiKey']); // Block these fields
```

### Dynamic Permissions

```typescript
// Load permissions from database
const permissions = await prisma.permission.findMany({
  where: { roleId: user.roleId }
});

permissions.forEach(perm => {
  can(perm.action, perm.subject, perm.conditions);
});
```

## Troubleshooting

### "Access denied" for legitimate users

Check:
1. User role is correctly assigned
2. Ability definition includes the permission
3. Conditions match (e.g., authorId)

### TypeScript errors with subjects

Make sure your Prisma models are generated:

```bash
npx prisma generate
```

### Permissions not updating

Permissions are checked per request. Changes to `abilities.ts` require server restart.

## Examples

See complete examples:

- `examples/app.auth.example.ts` - Full RBAC implementation
- `src/lib/auth/abilities.ts` - Permission definitions

## Resources

- [CASL Documentation](https://casl.js.org/v6/en/)
- [AUTH.md](./AUTH.md) - Authentication guide
- [DATABASE.md](./DATABASE.md) - Database setup

## Summary

```typescript
// 1. Enable RBAC in config
rbac: { enabled: true }

// 2. Use middlewares
authenticate(authService)    // Require login
requireRole(Role.ADMIN)      // Require specific role
authorize('update', 'Post')  // Require permission

// 3. Custom checks
checkPermission(user, action, subject, conditions)
defineAbilitiesFor(user)

// 4. Built-in roles
Role.USER       // Basic access
Role.MODERATOR  // Content management
Role.ADMIN      // Full access
```

🎉 You now have enterprise-grade authorization in Berserk Engine!
