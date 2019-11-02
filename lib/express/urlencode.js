const { app, berserkUtils } = require('../berserk')
const express = require('express')

/**
 * Urlencoded & Json
 * @param {Boolean} optionEncoded define true and false to activate urlencoded default false
 */
const urlencode = opt => {
	try {
		if (opt === true) {
			app.use(express.urlencoded({ extended: opt }))
			app.use(express.json())

			if (Utils.ENV() === 'development' || Utils.ENV() === 'test') {
				berserkUtils.successMessage(`Urlencoded: ${opt}`)
			}
		} else {
			app.use(express.urlencoded({ extended: false }))
			app.use(express.json())

			if (berserkUtils.ENV() === 'development' || berserkUtils.ENV() === 'test') {
				berserkUtils.successMessage(`Urlencoded: ${false}`)
			}
		}
	} catch (error) {
		berserkUtils.errorMessage(`Urlencoded:	${error.stack}`)
	}
}

module.exports = urlencode
