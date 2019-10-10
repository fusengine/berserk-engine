const session = require('express-session')

/** Express and param module */
const app = require('./app')

/**
 * Session
 * @param {String|Boolean|Object} optionSession define signed cookie application
 * resave define resave automatics session application
 * saveUninitialized define saveUninitialized explain a comportement session on save the session
 * cookie define to set cookie session 
 */
const Session = optionSession => {
	app.use(session(optionSession))
}

module.exports = Session
