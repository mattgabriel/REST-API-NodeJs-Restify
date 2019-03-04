import * as restify from "restify";
import * as bunyan from "bunyan";


/**
 *
 * Usage:
 *  import { Log, Types } from "../helpers/logger";
 *  Log.warn(__filename, "some message", Types.auth);
 *  Log.info(__filename, `Authenticated: ${authService.userId}`, Types.auth);
 *
 */

export const requests = new bunyan({
	name: "requests",
	streams: [
		// {
		// 	stream: process.stdout,
		// 	level: "debug"
		// },
		{
			path: "logs/debug.log",
			level: "debug"
		},
		{
			path: "logs/trace.log",
			level: "trace"
		},
	],
	serializers: {
		req: bunyan.stdSerializers.req,
		res: restify.bunyan.serializers.res,
	}
});

export class Log {

	private static getLogger(type: Types) {
		return new bunyan({
			name: type,
			streams: [
				// {
				// 	path: "logs/" + type + ".log"
				// },
				{
					stream: process.stdout
				},
			]
		});
	}

	/* trace -> level 10 */
	static trace(filename: string, msg: any, type: Types) {
		// this.getLogger(type).trace(this.setMsg(msg, filename));
	}

	/* debug -> level 20 */
	static debug(filename: string, msg: any, type: Types) {
		// this.getLogger(type).debug(this.setMsg(msg, filename));
	}

	/* info -> level 30 */
	static info(filename: string, msg: any, type: Types) {
		// this.getLogger(type).info(this.setMsg(msg, filename));
	}

	/* warn -> level 40 */
	static warn(filename: string, msg: any, type: Types) {
		// this.getLogger(type).warn(this.setMsg(msg, filename));
	}

	/* error -> level 50 */
	static error(filename: string, msg: any, type: Types) {
		// this.getLogger(type).error(this.setMsg(msg, filename));
	}

	private static setMsg(msg: any, filename: string): string {
		const file = filename.split("/").pop();

		if (typeof(msg) == "string") {
			return file + " -> " + msg as string;
		} else {
			return file + " -> " + msg;
		}
	}

}


export enum Types {
	auth = "_auth",
	db = "_db",
}

