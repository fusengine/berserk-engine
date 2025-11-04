/*!
 * Berserk-Engine
 * Copyright(c) 2019 Bruno Azoulay
 * Copyright(c) 2019 Fusengine
 * MIT Licensed
 */
import * as Utils from './lib/utils';
import config from './config';
import clear from 'clear';
import { engine, app, berserkUtils } from './lib/berserk';

/** Clear terminal */
clear();

/** Message */
Utils.successMessage(`Berserk: engine loaded mode ${Utils.ENV()} \n `);

if (Utils.ENV() === 'test') {
	module.exports = engine(config);
} else {
	module.exports = { engine, app, berserkUtils };
}

export { engine, app, berserkUtils };
export default { engine, app, berserkUtils };
