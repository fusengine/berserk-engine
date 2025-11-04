import { Application, Request, Response, NextFunction } from 'express';
import errorHandler from 'errorhandler';
import createError from 'http-errors';
import * as Utils from '../utils';

interface ErrorWithCode extends Error {
	code?: number;
}

/** Define middleware error page */
const Errors = (app: Application): void => {
	if (Utils.ENV() === 'development' || Utils.ENV() === 'test') {
		app.use(function (req: Request, res: Response, next: NextFunction) {
			res.status(404);
			return next(createError(404, req.url, { expose: false }));
		});

		// @ts-ignore - errorHandler types are not compatible with Express 4.18+
		app.use(errorHandler());
	} else {
		app.use(function (req: Request, res: Response, _next: NextFunction) {
			res.status(404).send(
				`
            <!DOCTYPE html>
                <html>
                <head>
                    <title>Berserk Not Found 404</title>
                    <style>
                        body{ max-width: 100vh; margin: auto; background: #566270; padding:2rem;text-align: center;}
                        h1 {color: #FFFFF3;font-family: arial;font-size: 200%;}
                        p{color: #F16B6F;font-family: arial;font-size: 130%;}
                    </style>
                </head>
                <body>
                <h1>ERROR Not Found 404</h1>
                <p>Cannot GET ${req.url}</p>
            </body>
            `
			);
		});

		app.use((err: ErrorWithCode, _req: Request, res: Response, _next: NextFunction) => {
			const code = err.code || 500;

			res.status(code).json({
				code: code,
				message: code === 500 ? null : err.message,
			});
		});
	}
};

export default Errors;
