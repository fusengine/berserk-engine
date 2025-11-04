import { Application } from 'express';
import morganApp from 'morgan';
import * as Utils from '../utils';

/**
 * Morgan
 * @param {String} paramMorgan this param morgan to view url request
 */
const Morgan = (app: Application, paramMorgan?: string): void => {
	if (paramMorgan) {
		app.use(morganApp(paramMorgan));

		if (Utils.ENV() === 'development' || Utils.ENV() === 'test') {
			Utils.successMessage(`Morgan: ${paramMorgan}`);
		}
	} else {
		const mode = 'dev';
		app.use(morganApp(mode));
		if (Utils.ENV() === 'development' || Utils.ENV() === 'test') {
			Utils.successMessage(`Morgan: ${mode}`);
		}
	}
};

export default Morgan;
