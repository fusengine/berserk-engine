import { Application, Router } from 'express';
import * as Utils from '../utils';

/** Message */
const SUCCESS = 'Loaded';
const NOT_FOUND = 'This router path not loaded.';

/**
 * Define initial route to run api
 * and default route
 * @param {*} apiRoute api route /api
 * @param {*} webRoute web route /
 */
const Route = (app: Application, api?: Router, web?: Router): void => {
	try {
		if (api && web) {
			app.use('/api', api);
			app.use('/', web);
			Utils.successMessage(`Router: ${SUCCESS}`);
		} else {
			Utils.infoMessage(`Router info: ${NOT_FOUND}`);
		}
	} catch (error) {
		const errorStack = error instanceof Error ? error.stack : 'Unknown error';
		Utils.errorMessage(`Router error: ${errorStack}`);
	}
};

export default Route;
