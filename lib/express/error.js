const { app } = require('../berserk')

const errorHandler = require('errorhandler')
const createError = require('http-errors')

/** Define middleware error page */
module.exports = Errors = () => {
	if (process.env.NODE_ENV === 'development') {
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
                        h1 {color: #FFFFF3;font-family: verdana;font-size: 200%;}
                        p{color: #F16B6F;font-family: courier;font-size: 130%;}
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
