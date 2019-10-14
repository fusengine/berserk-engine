const path = require('path')
const express = require('express')
const logSymbols = require('log-symbols')
const colors = require('colors')

const { app } = require('./app')

/**
 * StaticFile
 * @param {String} fileDirectory this is a directory to your assets
 * @param {String} nameAssets this is a name to your assets
 */
const StaticFile = (fileDirectory, nameAssets) => {
	try {
		if (fileDirectory && nameAssets) {
			app.use(nameAssets, express.static(path.join(__dirname, fileDirectory)))
		} else {
			console.log(
				colors.red.bold(
					`${logSymbols.warning} Your file directory assets and name assets is not define.`
				)
			)
		}
	} catch (error) {
		console.error(colors.red.bold(`${logSymbols.warning} ${error.stack}`))
	}
}

module.exports = StaticFile
