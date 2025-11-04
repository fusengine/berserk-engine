import { Application } from 'express';
import * as Utils from '../utils';

/** Message */
const MESSAGE_DEFAULT = 'Default Port to';
const MESSAGE_CHANGE = 'You have change the port for';
const MESSAGE_ALREADY_USE = 'Other server use this port';
const MESSAGE_PORT_CUSTOM = 'New custom port listen is';

/**
 * @param {Number|String} userPort define port to user
 */
const Port = (app: Application, userPort?: number | string): void => {
	try {
		let defPort = 5000;
		const portFunction = (value: number | string): string | number =>
			process.env.PORT || value;

		if (userPort) {
			app
				.listen(portFunction(userPort), () => {
					Utils.infoMessage(`Port: ${MESSAGE_CHANGE} ${userPort}`);
				})
				.on('error', (err: NodeJS.ErrnoException) => {
					if (err.code === 'EADDRINUSE') {
						// port is currently in use
						Utils.errorMessage(`Warning: ${MESSAGE_ALREADY_USE} ${userPort}`);
						// increment port
						let newPort = typeof userPort === 'number' ? ++userPort : parseInt(userPort as string, 10) + 1;
						// new port increment is ok
						app.listen(newPort, () => {
							Utils.infoMessage(`Port: ${MESSAGE_PORT_CUSTOM} ${newPort}`);
						});
					}
				});
		} else {
			app
				.listen(defPort, () => {
					Utils.successMessage(`Port: ${MESSAGE_DEFAULT} ${defPort}`);
				})
				.on('error', (err: NodeJS.ErrnoException) => {
					if (err.code === 'EADDRINUSE') {
						// port is currently in use
						Utils.errorMessage(`Warning: ${MESSAGE_ALREADY_USE}${defPort}`);
						// increment port
						let newPort = ++defPort;
						// new port increment is ok
						app.listen(newPort, () => {
							Utils.infoMessage(`Port: ${MESSAGE_PORT_CUSTOM} ${newPort}`);
						});
					}
				});
		}
	} catch (error) {
		const errorStack = error instanceof Error ? error.stack : 'Unknown error';
		Utils.errorMessage(`Port Error: ${errorStack}`);
	}
};

export default Port;
