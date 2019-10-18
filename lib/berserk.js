const express = require('express')

/** export express */
exports.app = express()

/** Additionnable modules */
const mongoConnect = require('./database/mongodb')
const errors = require('./express/error')
const port = require('./express/port')
const routes = require('./express/routes')
const urlEncode = require('./express/urlEncode')
const headers = require('./express/header')
const morgan = require('./express/morgan')

/** Utils */
const { modulesFile, infoMessage, successMessage } = require('./utils')

exports.engine = (configFile, apiPath, webPath, moduleRequired) => {
	/** Message */
	successMessage('Berserk: engine Loaded.')

	if (configFile) {
		const { encoded, header, mongoConfig, morganOption, portNumber, viewExtension } = configFile

		// define name to berserk application
		this.app.use((req, res, next) => {
			res.header('X-powered-by', 'Berserk, Fusengine')
			next()
		})

		// Connect mongo db
		if (mongoConfig) mongoConfigObj = Object.values(mongoConfig)
		mongoConnect(...mongoConfigObj)

		// Reade file to application with required
		if (moduleRequired) modulesFile(moduleRequired)

		// Define encode url
		if (encoded) encoded
		encoded ? urlEncode(encoded) : urlEncode()

		// define header to express
		if (header) headerObj = Object.values(header)
		header ? headers(...headerObj) : headers()

		// define to view terminal morgan info
		if (morganOption) morganOption
		morganOption ? morgan(morganOption) : morgan()

		// Define route path
		routes(apiPath, webPath)

		// Define custom error Page middleware
		errors()

		// Define port or port default to app
		portNumber ? port(portNumber) : port()
	} else {
		infoMessage(
			'Config File: config file not found please create your file config and put this path.'
		)
	}
}
