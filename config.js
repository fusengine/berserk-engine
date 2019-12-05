module.exports = {
	/**
	 * Define port to listen app 
	 * @param {String|number} port define your custom port
	 */
	portNumber: '',

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
	encoded: '',

	/**
	 * @param {String} morganOption
	 * option: dev, tiny, combined
	 * other option go to https://github.com/expressjs/morgan#readme
	 */
	morgan: '',

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

	cookieParserSecretKey: 'berserk-app',

	/** Mongo db */
	mongodb: {
		server: 'mongodb',
		user: '',
		password: '',
		host: 'localhost',
		port: '207',
		dbname: 'test-db',
		options: 'retryWrites=true',
		newUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
		useFindAndModify: false,
		useUnifiedTopologyMongo: true,
		// tryReconnectMongo: 3,
		// intervalReconnectMongo: 500,
	},

	/** Session Option */
	sessionOption: {
		secret: 'berserk-Key-Secret',
		resave: false,
		saveUninitialized: true,
		cookie: {
			path: '/',
			httpOnly: true,
			secure: true,
			maxAge: 60000,
		},
	},
}
