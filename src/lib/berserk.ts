import express, { Application, Request, Response, NextFunction, Router } from 'express';
import * as Utils from './utils';
import { BerserkConfig } from '../config';
import MongoDb from './database/mongodb';
import { DatabaseFactory, DatabaseAdapter } from './database';
import Encoded from './express/Urlencode';
import Headers from './express/Header';
import Morgan from './express/Morgan';
import Route from './express/Route';
import Port from './express/Port';
import Errors from './express/error';

/** Default export */
export const app: Application = express();
export const berserkUtils = Utils;

/** Database instance (accessible globally) */
let databaseInstance: DatabaseAdapter | null = null;

/**
 * Get the database instance
 * @returns DatabaseAdapter instance or null if not connected
 */
export const getDatabase = (): DatabaseAdapter | null => {
	return databaseInstance;
};

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
export const engine = async (
	config?: BerserkConfig,
	modules?: any,
	api?: Router,
	http?: Router
): Promise<void> => {
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
		const { encoded, header, mongodb, database, morgan, portNumber } = config;

		/** connect to database (new unified system) */
		if (database) {
			try {
				databaseInstance = await DatabaseFactory.createAndConnect(database);
			} catch (error) {
				const errorMessage = error instanceof Error ? error.message : 'Unknown error';
				Utils.errorMessage(`Database connection failed: ${errorMessage}`);
			}
		}
		/** connect to mongodb (legacy support) */
		else if (mongodb) {
			Utils.infoMessage('Using legacy MongoDB configuration. Consider migrating to the new "database" config.');
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
