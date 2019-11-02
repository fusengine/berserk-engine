'use strict'

const express = require('express')
const Utils = require('./utils')

/** Default export */
exports.app = express()
exports.berserkUtils = Utils

/** Message */
const confMessage = 'Config file not found please create your file config and put this path.'
const poweredBy = 'Berserk, Fusengine'

/** Module */
const Connect = require('./database/mongodb')
const Encoded = require('./express/Urlencode')
const Headers = require('./express/Header')
const Morgan = require('./express/Morgan')
const Route = require('./express/Routes')
const Port = require('./express/Port')
const Errors = require('./express/Error')

/**
 * 
 * @param {*} config read config files: config.js.
 * @param {*} api route files to api.
 * @param {*} http route files to http.
 * @param {*} modules includes all modules.
 */
exports.engine = (config, modules, api, http) => {
	const app = this.app

	/** Define name application */
	app.use((req, res, next) => {
		res.header('X-powered-by', poweredBy)
		next()
	})

	/** If config files added. */
	if (config) {
		/** Message */
		Utils.successMessage('Berserk default: default config loaded.')

		/** Attribute variable to config files. */
		const { encoded, header, mongodb, morgan, port } = config

		/** connect to mongodb */
		if (mongodb) Connect(...Object.values(mongodb))

		/** Include modules */
		if (modules) modules

		/** url encoded */
		encoded ? Encoded(encoded) : Encoded()

		/** Headers  */
		header ? Headers(...Object.values(header)) : Headers()

		/** Morgan */
		morgan ? Morgan(morgan) : Morgan()

		/** Route */
		Route(api, http)

		/** Errors */
		Errors()

		/** Port app  */
		port ? Port(port) : Port()
	} else {
		Utils.infoMessage(confMessage)
	}
}
