'use strict'
const mongoose = require('mongoose')
const express = require('express')
const Utils = require('./utils')

/** Default export */
exports.app = express()
exports.berserkUtils = Utils

/** Message */
const confMessage = 'Config file not found please create your file config and put this path.'
const poweredBy = 'Berserk, Fusengine'

/** Module */
const Connect = require('./database/mongodb')(mongoose, Utils)
const Encoded = require('./express/Urlencode')(this.app, Utils, express)
const Headers = require('./express/Header')(this.app, Utils)
const Morgan = require('./express/Morgan')(this.app, Utils)
const Route = require('./express/Route')(this.app, Utils)
const Port = require('./express/Port')(this.app, Utils)
const Errors = require('./express/Error')(this.app, Utils)

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
