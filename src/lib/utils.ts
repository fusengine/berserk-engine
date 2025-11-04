import colors from 'colors';
import logSymbols from 'log-symbols';
import bcrypt from 'bcrypt';

/**
 * View Env nodejs
 * @returns Return env
 */
export const ENV = (): string | undefined => {
	return process.env.NODE_ENV;
};

export const modulesFile = (files: any[]): void => {
	for (let i = 0; i < files.length; i++) {
		files[i];
	}
};

/**
 * Use bcrypt to hash password
 *
 * @param {String} password User password
 * @param {Number} number number of hash
 * @returns
 */
export const hashPassword = async (password: string, number: number): Promise<string> => {
	try {
		const salt = await bcrypt.genSalt(number);
		return await bcrypt.hash(password, salt);
	} catch (error) {
		throw error;
	}
};

/**
 * Compare password field to user password database
 *
 * @param {String} password password database
 * @param {String} userField password field
 * @returns
 */
export const comparePassword = (password: string, userField: string): Promise<boolean> => {
	return bcrypt.compare(password, userField);
};

/**
 * Define success messages
 * @param {String} message message text
 */
export const successMessage = (message: string): void => {
	const colorMessage = colors.blue.bold;
	const symbolSuccess = logSymbols.success;
	console.log(colorMessage(`${symbolSuccess} ${message}`));
};

/**
 * Define info messages
 * @param {String} message message text
 */
export const infoMessage = (message: string): void => {
	const colorMessage = colors.bgBlue.bold;
	const symbolSuccess = logSymbols.info;
	console.log(colorMessage(`${symbolSuccess} ${message}`));
};

/**
 * Define error Message
 * @param {String} message message text
 */
export const errorMessage = (message: string): void => {
	const colorMessage = colors.red.bold;
	const symbolSuccess = logSymbols.warning;
	console.log(colorMessage(`${symbolSuccess} ${message}`));
};

export default {
	ENV,
	modulesFile,
	hashPassword,
	comparePassword,
	successMessage,
	infoMessage,
	errorMessage,
};
