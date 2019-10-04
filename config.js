module.exports = {
	/**
	 * Define port to listen app 
	 * @param {String|number} port define your custom port
	 */
	port: '',

	/** Define Header Request */
	header: {
		origine: '*',
		headers: 'Origin, X-Requested-With, Content-Type, Accept, token-berserk',
		method: 'PUT, POST, GET, DELETE, OPTIONS',
		credentials: true,
	},

	/**
	 * @param {Boolean} urlencoded by default false
	 */
	urlEncoded: true,

	/**
	 * @param {String} morganOption
	 * option: dev, tiny, combined
	 * other option go to https://github.com/expressjs/morgan#readme
	 */
	morganOption: '',

	/**
	 * View
	 * @param {String} viewExtension extension file ejs or pug
	 */
	viewExtension: 'ejs',

	/**
	 * assets
	 * @param {String} dir create your directory to put you js, css and image
	 * @param {String} name create name to use in your ejs and pug file
	 */
	assets: {
		dir: '',
		name: '',
	},

	cookieParserSecretKey: {
		secret: 'berserk-app',
		option: '',
	},

	/** Mongo db */
	mongoConfig: {
		server: 'mongodb',
		user: '',
		password: '',
		host: 'localhost',
		port: '207',
		dbname: 'wow',
		options: 'retryWrites=true',
		newUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
		useFindAndModify: false,
		tryReconnectMongo: 5,
		intervalReconnectMongo: 500,
	},
}
