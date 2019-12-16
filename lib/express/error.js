'use strict'

/** define var to use dynamic  to access app*/
let app
let Utils

/** Express Port 
 * @param _app define app express
 * @param _utils Define utils var
 */
module.exports = (_app, _utils) => {
	app = _app
	Utils = _utils

	// Return Const
	return Errors
}

const errorHandler = require('errorhandler')
const createError = require('http-errors')

/** Define middleware error page */
const Errors = () => {
	if (Utils.ENV() === 'development' || Utils.ENV() === 'test') {
		app.use(function(req, res, next) {
			res.status(404)
			return next(createError(404, req.url, { expose: false }))
		})

		app.use(errorHandler())
	} else {
		app.use(function(req, res, next) {
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
			)
		})

		app.use((err, req, res, next) => {
			const code = err.code || 500

			res.status(code).json({
				code: code,
				message: code === 500 ? null : err.message,
			})
		})
	}
}
