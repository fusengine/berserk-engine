'user strict'

/** define var to use dynamic  to access app*/
let app
let Utils
let express

/** Express Port 
 * @param _app define app express
 * @param _utils Define utils var
 * @param _express add express var
 */
module.exports = (_app, _utils, _express) => {
	app = _app
	Utils = _utils
	express = _express

	// Return Const
	return Urlencode
}

/**
 * Urlencoded & Json
 * @param {Boolean} optionEncoded define true and false to activate urlencoded default false
 */
const Urlencode = opt => {
	try {
		if (opt === true) {
			app.use(express.urlencoded({ extended: opt }))
			app.use(express.json())

			if (Utils.ENV() === 'development' || Utils.ENV() === 'test') {
				Utils.successMessage(`Urlencoded: ${opt}`)
			}
		} else {
			app.use(express.urlencoded({ extended: false }))
			app.use(express.json())

			if (Utils.ENV() === 'development' || Utils.ENV() === 'test') {
				Utils.successMessage(`Urlencoded: ${false}`)
			}
		}
	} catch (error) {
		Utils.errorMessage(`Urlencoded:	${error.stack}`)
	}
}
