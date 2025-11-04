export interface HeaderConfig {
	origine: string;
	headers: string;
	method: string;
	credentials: boolean;
}

export interface AssetsConfig {
	dir: string;
	name: string;
}

export interface MongoDBConfig {
	server: string;
	user?: string;
	password?: string;
	host: string;
	port: string;
	dbname: string;
	options: string;
	newUrlParser: boolean;
	useUnifiedTopology: boolean;
	useCreateIndex: boolean;
	useFindAndModify: boolean;
	useUnifiedTopologyMongo: boolean;
}

export interface SessionCookieConfig {
	path: string;
	httpOnly: boolean;
	secure: boolean;
	maxAge: number;
}

export interface SessionConfig {
	secret: string;
	resave: boolean;
	saveUninitialized: boolean;
	cookie: SessionCookieConfig;
}

export interface BerserkConfig {
	portNumber?: string | number;
	header?: HeaderConfig;
	encoded?: boolean;
	morgan?: string;
	viewExtension?: string;
	assets?: AssetsConfig;
	cookieParserSecretKey?: string;
	mongodb?: MongoDBConfig;
	sessionOption?: SessionConfig;
}

const config: BerserkConfig = {
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
	encoded: false,

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
};

export default config;
