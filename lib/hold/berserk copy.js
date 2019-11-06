const express = require('express')
const berserkUtils = require('../utils')

/** export express */
exports.app = express()

/** export console.log custom */
exports.berserkUtils = berserkUtils

/** Additionnable modules */

const errors = require('../express/error')
const headers = require('../express/header')
const morgan = require('../express/morgan')
const port = require('../express/port')
const mongoConnect = require('../database/mongodb')
const routes = require('../express/routes')
const urlEncode = require('../express/urlEncode')

/** Utils */
const { modulesFile, infoMessage, successMessage } = berserkUtils

/**
 * engine
 * Start berserk engine
 * 
 * @param {String} configFile read user file config.js
 * @param {String} apiPath route path to api /api
 * @param {String} webPath route path to browser web /
 * @param {Array|Function|String} moduleRequired include all file javascript *.js
 */
exports.engine = (configFile, apiPath, webPath, moduleRequired) => {
	/** if have file config.js */
	if (configFile) {
		/** Message */
		successMessage('Berserk default: default conf Loaded.')

		// attribute var to config file
		const { encoded, header, mongoConfig, morganOption, portNumber } = configFile

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
