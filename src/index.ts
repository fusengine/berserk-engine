/*!
 * Berserk-Engine
 * Copyright(c) 2019 Bruno Azoulay
 * Copyright(c) 2019 Fusengine
 * MIT Licensed
 */
import * as Utils from './lib/utils';
import config from './config';
import clear from 'clear';
import { engine, app, berserkUtils, getDatabase, getAuthService } from './lib/berserk';

/** Clear terminal */
clear();

/** Message */
Utils.successMessage(`Berserk: engine loaded mode ${Utils.ENV()} \n `);

if (Utils.ENV() === 'test') {
	module.exports = engine(config);
} else {
	module.exports = { engine, app, berserkUtils, getDatabase, getAuthService };
}

export { engine, app, berserkUtils, getDatabase, getAuthService };
export default { engine, app, berserkUtils, getDatabase, getAuthService };

// Export database types and utilities for users
export * from './lib/database/types';
export { DatabaseFactory } from './lib/database';

// Export auth types and utilities for users
export * from './lib/auth/types';
export * from './lib/auth';
