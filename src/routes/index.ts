import * as errors from "restify-errors";

import * as restify from "restify";
// import sampleRouteController from '../controllers/SampleRouteController'

function sampleRoute(server: restify.Server) {
	// let routeCtrl = new sampleRouteController();
	server.get("/api2/ping", function(req: restify.Request, res: restify.Response, next: restify.Next) {
		res.json(200, {"pong": true});
		return next();
	});
}

module.exports.routes = sampleRoute;