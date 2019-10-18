const { app } = require('../berserk')
const express = require('express')
const { errorMessage, successMessage } = require('../utils')

/**
 * Urlencoded & Json
 * @param {Boolean} optionEncoded define true and false to activate urlencoded default false
 */
module.exports = urlencode = opt => {
	try {
		if (opt === true) {
			app.use(express.urlencoded({ extended: opt }))
			app.use(express.json())

			if (process.env.NODE_ENV === 'development') {
				successMessage(`Urlencoded: ${opt}`)
			}
		} else {
			app.use(express.urlencoded({ extended: false }))
			app.use(express.json())

			if (process.env.NODE_ENV === 'development') {
				successMessage(`Urlencoded: ${false}`)
			}
		}
	} catch (error) {
		errorMessage(`Urlencoded:	${error.stack}`)
	}
}
