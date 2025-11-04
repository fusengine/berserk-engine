import { Application } from 'express';
import express from 'express';
import * as Utils from '../utils';

/**
 * Urlencoded & Json
 * @param {Boolean} optionEncoded define true and false to activate urlencoded default false
 */
const Urlencode = (app: Application, opt?: boolean): void => {
	try {
		if (opt === true) {
			app.use(express.urlencoded({ extended: opt }));
			app.use(express.json());

			if (Utils.ENV() === 'development' || Utils.ENV() === 'test') {
				Utils.successMessage(`Urlencoded: ${opt}`);
			}
		} else {
			app.use(express.urlencoded({ extended: false }));
			app.use(express.json());

			if (Utils.ENV() === 'development' || Utils.ENV() === 'test') {
				Utils.successMessage(`Urlencoded: ${false}`);
			}
		}
	} catch (error) {
		const errorStack = error instanceof Error ? error.stack : 'Unknown error';
		Utils.errorMessage(`Urlencoded:	${errorStack}`);
	}
};

export default Urlencode;
