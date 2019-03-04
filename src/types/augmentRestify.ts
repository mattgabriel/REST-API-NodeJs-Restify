import * as restify from "restify";

declare module "restify" {
	interface Request {
		_locals?: any;
	}
}