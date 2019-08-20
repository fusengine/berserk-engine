const express = require('express')
const colors = require('colors')
const logSymbols = require('log-symbols')

/** Express Module */
const app = require('./app')
const berserkParam = require('../params').parameters

/**
 * Urlencoded & Json
 * @param {Boolean} optionEncoded define true and false to activate urlencoded default false
 */
const Urlencoded = optionEncoded => {
	try {
		if (optionEncoded === true) {
			app.use(express.urlencoded({ extended: optionEncoded }))
			app.use(express.json())

			if (process.env.NODE_ENV === 'development') {
				console.log(colors.cyan.bold(`${logSymbols.info} Urlencoded: ${optionEncoded} `))
			}
		} else {
			app.use(express.urlencoded({ extended: berserkParam.encoded }))
			app.use(express.json())

			if (process.env.NODE_ENV === 'development') {
				console.log(
					colors.cyan.bold(`${logSymbols.info} Urlencoded: ${berserkParam.encoded} `)
				)
			}
		}
	} catch (error) {
		console.error(colors.red.bold(`${logSymbols.warning} ${error.stack}`))
	}
}

module.exports = Urlencoded
