# Database Support in Berserk Engine

Berserk Engine now supports multiple database systems through a unified configuration interface.

## Supported Databases

- **PostgreSQL** - Using Prisma ORM
- **MySQL** - Using Prisma ORM
- **MongoDB** - Using Mongoose (legacy support)

## Quick Start

### 1. Configure Your Database

In your `config.ts` file, add a `database` configuration:

```typescript
import { BerserkConfig } from '@fusengine/berserk-engine';

const config: BerserkConfig = {
  database: {
    type: 'postgresql', // or 'mysql' or 'mongodb'
    host: 'localhost',
    port: 5432,
    database: 'myapp',
    username: 'postgres',
    password: 'password',
  },
  // ... other config
};
```

### 2. PostgreSQL Setup

#### Configuration Example

```typescript
database: {
  type: 'postgresql',
  host: 'localhost',
  port: 5432,
  database: 'myapp',
  username: 'postgres',
  password: 'password',
  schema: 'public', // optional
  ssl: false, // optional
  poolMin: 2, // optional
  poolMax: 10, // optional
}
```

#### Prisma Schema

Copy the example schema and customize it:

```bash
cp prisma/schema.example.postgresql.prisma prisma/schema.prisma
```

Edit `prisma/schema.prisma` to define your models.

#### Generate Prisma Client

```bash
npx prisma generate
```

#### Run Migrations

```bash
npx prisma migrate dev --name init
```

### 3. MySQL Setup

#### Configuration Example

```typescript
database: {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  database: 'myapp',
  username: 'root',
  password: 'password',
  charset: 'utf8mb4', // optional
  poolMin: 2, // optional
  poolMax: 10, // optional
}
```

#### Prisma Schema

```bash
cp prisma/schema.example.mysql.prisma prisma/schema.prisma
```

Edit and run migrations as with PostgreSQL.

### 4. MongoDB Setup (New Format)

#### Configuration Example

```typescript
database: {
  type: 'mongodb',
  host: 'localhost',
  port: 27017,
  database: 'myapp',
  username: 'admin', // optional
  password: 'password', // optional
  options: 'retryWrites=true&w=majority',
}
```

## Usage in Your Application

### Access Database Client

```typescript
import { engine, getDatabase } from '@fusengine/berserk-engine';
import config from './config';

// Initialize engine
await engine(config);

// Get database instance
const db = getDatabase();

if (db) {
  const client = db.getClient(); // PrismaClient or Mongoose instance

  // For Prisma (PostgreSQL/MySQL)
  const users = await client.user.findMany();

  // For Mongoose (MongoDB)
  // Use your Mongoose models as usual
}
```

### Example Route with Database

```typescript
import { Router } from 'express';
import { getDatabase } from '@fusengine/berserk-engine';

const router = Router();

router.get('/users', async (req, res) => {
  try {
    const db = getDatabase();
    if (!db) {
      return res.status(500).json({ error: 'Database not connected' });
    }

    const client = db.getClient();
    const users = await client.user.findMany();

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
```

## Environment Variables

You can use environment variables for database configuration:

```typescript
database: {
  type: process.env.DB_TYPE as 'postgresql' | 'mysql' | 'mongodb',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'myapp',
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
}
```

Create a `.env` file:

```env
DB_TYPE=postgresql
DB_HOST=localhost
DB_PORT=5432
DB_NAME=myapp
DB_USER=postgres
DB_PASSWORD=password
```

## Prisma Commands

### Generate Client
```bash
npx prisma generate
```

### Create Migration
```bash
npx prisma migrate dev --name <migration_name>
```

### Apply Migrations (Production)
```bash
npx prisma migrate deploy
```

### Open Prisma Studio (Database GUI)
```bash
npx prisma studio
```

### Reset Database
```bash
npx prisma migrate reset
```

## Migration from Legacy MongoDB Config

If you're using the old `mongodb` configuration, you can migrate to the new format:

### Old Format (Deprecated)
```typescript
mongodb: {
  server: 'mongodb',
  host: 'localhost',
  port: '27017',
  dbname: 'myapp',
  // ...
}
```

### New Format
```typescript
database: {
  type: 'mongodb',
  host: 'localhost',
  port: 27017,
  database: 'myapp',
  username: 'admin',
  password: 'password',
}
```

**Note:** The old `mongodb` configuration still works for backwards compatibility but is deprecated.

## Advanced Usage

### Direct Adapter Creation

```typescript
import { DatabaseFactory, PostgreSQLConfig } from '@fusengine/berserk-engine';

const config: PostgreSQLConfig = {
  type: 'postgresql',
  host: 'localhost',
  port: 5432,
  database: 'myapp',
  username: 'postgres',
  password: 'password',
};

const adapter = await DatabaseFactory.createAndConnect(config);
const client = adapter.getClient();

// Use client...

// Don't forget to disconnect
await adapter.disconnect();
```

### Check Connection Status

```typescript
const db = getDatabase();
if (db && db.isConnected()) {
  console.log('Database is connected');
}
```

## Examples

Check the `examples/` directory for complete configuration examples:

- `examples/config.postgresql.example.ts`
- `examples/config.mysql.example.ts`
- `examples/config.mongodb.example.ts`

## Troubleshooting

### Prisma Client Not Found

Run `npx prisma generate` to generate the Prisma Client.

### Connection Errors

- Check your database is running
- Verify credentials and connection details
- Check firewall settings
- For PostgreSQL/MySQL, ensure the database exists

### Type Errors

Make sure you've run `npm run build` after modifying database configurations.

## Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [MySQL Documentation](https://dev.mysql.com/doc/)
