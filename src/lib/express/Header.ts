import { Application, Request, Response, NextFunction } from 'express';
import * as Utils from '../utils';

/**
 * Header
 * define response header berserk
 * @param {String} origine Access-Control-Allow-Origin
 * @param {String} headers Access-Control-Allow-Headers
 * @param {String} method Access-Control-Allow-Methods
 * @param {Boolean} credentials Access-Control-Allow-Credentials
 */
const Headers = (
	app: Application,
	origine?: string,
	headers?: string,
	method?: string,
	credentials?: boolean
): void => {
	try {
		if (origine && headers && method && credentials !== undefined) {
			/** Accept request header */
			app.use((_req: Request, res: Response, next: NextFunction) => {
				res.header('Access-Control-Allow-Origin', origine);
				res.header('Access-Control-Allow-Headers', headers);
				res.header('Access-Control-Allow-Methods', method);
				res.header('Access-Control-Allow-Credentials', credentials.toString());
				next();
			});

			if (Utils.ENV() === 'development' || Utils.ENV() === 'test') {
				Utils.successMessage('Headers: loaded to config.js.');
			}
		} else {
			/** Accept request header */
			app.use((_req: Request, res: Response, next: NextFunction) => {
				res.header('Access-Control-Allow-Origin', '*');
				res.header(
					'Access-Control-Allow-Headers',
					'Origin, X-Requested-With, Content-Type, Accept, token'
				);
				res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
				res.header('Access-Control-Allow-Credentials', 'true');
				next();
			});
		}
	} catch (error) {
		const errorStack = error instanceof Error ? error.stack : 'Unknown error';
		Utils.errorMessage(`Headers error: ${errorStack}`);
	}
};

export default Headers;
