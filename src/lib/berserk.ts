import express, { Application, Request, Response, NextFunction, Router } from 'express';
import * as Utils from './utils';
import { BerserkConfig } from '../config';
import MongoDb from './database/mongodb';
import Encoded from './express/Urlencode';
import Headers from './express/Header';
import Morgan from './express/Morgan';
import Route from './express/Route';
import Port from './express/Port';
import Errors from './express/error';

/** Default export */
export const app: Application = express();
export const berserkUtils = Utils;

/** Message */
const confMessage = 'Config file not found please create your file config and put this path.';
const poweredBy = 'Berserk, Fusengine';

/**
 * Berserk Engine
 * @param {BerserkConfig} config read config files: config.ts.
 * @param {any} modules includes all modules.
 * @param {Router} api route files to api.
 * @param {Router} http route files to http.
 */
export const engine = (
	config?: BerserkConfig,
	modules?: any,
	api?: Router,
	http?: Router
): void => {
	/** Define name application */
	app.use((_req: Request, res: Response, next: NextFunction) => {
		res.header('X-powered-by', poweredBy);
		next();
	});

	/** If config files added. */
	if (config) {
		/** Message */
		Utils.successMessage('Berserk default: default config loaded.');

		/** Attribute variable to config files. */
		const { encoded, header, mongodb, morgan, portNumber } = config;

		/** connect to mongodb */
		if (mongodb) {
			MongoDb(
				mongodb.server,
				mongodb.user,
				mongodb.password,
				mongodb.host,
				mongodb.port,
				mongodb.dbname,
				mongodb.options,
				mongodb.newUrlParser,
				mongodb.useUnifiedTopology,
				mongodb.useCreateIndex,
				mongodb.useFindAndModify,
				mongodb.useUnifiedTopologyMongo
			);
		}

		/** Include modules */
		if (modules) modules;

		/** url encoded */
		encoded ? Encoded(app, encoded) : Encoded(app);

		/** Headers  */
		header
			? Headers(app, header.origine, header.headers, header.method, header.credentials)
			: Headers(app);

		/** Morgan */
		morgan ? Morgan(app, morgan) : Morgan(app);

		/** Route */
		Route(app, api, http);

		/** Errors */
		Errors(app);

		/** Port app  */
		portNumber ? Port(app, portNumber) : Port(app);
	} else {
		Utils.infoMessage(confMessage);
	}
};
