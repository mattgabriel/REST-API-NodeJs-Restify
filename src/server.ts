"use strict";

import * as restify from "restify";
import * as restifyPlugins from "restify-plugins";
import * as corsMiddleware from "restify-cors-middleware";
import * as serveStatic from "serve-static-restify";
import * as logger from "./helpers/logger";
import * as fs from "fs";
import * as conf from "./config/config";

console.log("      _    ____ ___ ");
console.log("     / \\  |  _ \\_ _|");
console.log("    / _ \\ | |_) | |  ");
console.log("   / ___ \\|  __/| |  ");
console.log("  /_/   \\_\\_|  |___|");
console.log("┌-----------------------------------");
console.log(`| Env: ${process.env.API_ENV}`);
console.log(`| URL: ${conf.config.base_url}:${conf.config.port}`);

const cors = corsMiddleware({
	preflightMaxAge: 5, // optional
	origins: ["*"], // ["http://*.xx.com", "https://*.xx.com"],
	allowHeaders: ["Authorization", "authorization", "accept", "accept-version", "content-type", "request-id", "origin", "x-api-version", "x-request-id", "x-requested-with"], // ["API-Token"],
	exposeHeaders: ["Authorization", "authorization", "api-version", "content-length", "content-md5", "content-type", "date", "request-id", "response-time"], // ["API-Token-Expiry"]
});

(async () => {

	// Create server instance
	const server = restify.createServer({
		name: conf.config.name,
		version: conf.config.version,
		log: logger.requests,
		handleUncaughtExceptions: true
	});

	/**
	 * Middleware
	 */
	server.pre(restify.pre.sanitizePath());
	server.pre(cors.preflight);
	server.use(cors.actual);
	server.use(restifyPlugins.acceptParser(server.acceptable));
	server.use(restifyPlugins.queryParser({ mapParams: true }));
	server.use(restifyPlugins.fullResponse());

	fs.readdirSync(__dirname + "/routes").forEach(function (routeConfig: string) {
		if (routeConfig.substr(-3) === ".js") {
			const route = require(__dirname + "/routes/" + routeConfig);
			route.routes(server);
		}
	});

	/**
	 * Serve static page (ie. docs)
	 */
	server.get(
		/^\/?.*/,
		restify.plugins.serveStatic({
			directory: __dirname + "/public",
			default: "index.html"
		})
	);

	// if the createServer option handleUncaughtExceptions: true
	// this event will run and return a 500 response to the client
	// with also the the route and params that were used in the request
	// Good for development/debugging, not so good for production since clients
	// will have details on that error we are having.
	// IMPORTANT: it also allows the server to continue running where it originally
	// was going to die. Performance-wise this is quite expensive since it works
	// on the node domain (instead of restify)
	// NOTE: if some error occurs (broken DB, redis,... connection) and the
	// server doesn't recover then probably this event is causing it.
	server.on("uncaughtException", function (req, res, route, err) {
		if (!res.headersSent) {
			return res.send(500, {
				ok: false,
				message: err.stack,
				route: route
			});
		}
	});

	/**
	 * Start server
	 */
	server.listen(conf.config.port, async function() {
		console.log(`| Server is listening on port ${conf.config.port}`);
		console.log("└-----------------------------------");
	});

})();
