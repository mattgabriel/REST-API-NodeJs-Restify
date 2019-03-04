import * as restify from "restify";
import * as restifyPlugins from "restify-plugins";
import authController from "../controllers/AuthController";
import authMiddleware from "../middleware/authMiddleware";

/**
 * @apiDefine Auth Auth
 * Used by all users to login and get new access tokens.
 */

function authRoute(server: restify.Server) {
	const routeCtrl = authController;

	/**
	 * @api {get} /auth/login Login
	 * @apiGroup Auth
	 * @apiVersion 1.0.0
	 * @apiName Login
	 * @apiDescription This endpoint will return a long-lived `refreshToken` and a short-lived `accessToken`.
	 * Any other API calls should be made with the `accessToken`.<br><br>
	 *
	 * Sample request:
	 * <pre>curl -X GET "http://localhost:3000/auth/login/?email=john@email.com&password=test1234"</pre><br>
	 *
	 * @apiParam {String} email The email address of the user trying to log in.
	 * @apiParam {String} password The password of the user trying to log in.
	 * @apiSuccessExample {json} Success-Response:
	 * {
	 * 	"accessToken": String,
	 * 	"accessTokenExpires_utc": Date,
	 * 	"refreshToken": String,
	 * 	"refreshTokenExpires_utc": Date,
	 * 	"userId": String,
	 * 	"roleId": Int,
	 * }
	 * @apiErrorExample InsufficientParameters (401):
	 * {
	 * "code": "Unauthorized",
	 * "message": "Auth_InsufficientParameters"
	 * }
	 * @apiErrorExample InvalidCredentials (401):
	 * {
	 * "code": "Unauthorized",
	 * "message": "Auth_InvalidCredentials"
	 * }
	 */
	server.get(
		{
			path: "/auth/login",
			version: "1.0.0"
		},
		restifyPlugins.jsonBodyParser({ mapParams: true }),
		[routeCtrl.login]
	);


	/**
	 * @api {get} /auth/getAccessToken GetAccessToken
	 * @apiGroup Auth
	 * @apiVersion 1.0.0
	 * @apiName GetAccessToken
	 * @apiDescription After logging in, the API will return a short-lived `accessToken`. Any other API calls should be made with this `accessToken` in the header of the request.
	 *
	 * A `401` response means that the `accessToken` has expired and the user needs to log in again.<br><br>
	 *
	 * Sample request:
	 * <pre>curl -X GET "http://localhost:3000/auth/getAccessToken/?refreshToken=JWT+ey..."</pre><br>
	 *
	 * @apiParam {String} refreshToken that you previously obtained when logging in
	 * @apiSuccessExample {json} Success-Response:
	 * {
	 *  "accessToken": String,
	 * 	"accessTokenExpires_utc": Date,
	 * 	"userId": String,
	 * 	"roleId": Int,
	 * }
	 * @apiErrorExample InvalidToken (401):
	 * {
	 * 	"code": "Unauthorized",
	 * 	"message": "Auth_InvalidToken"
	 * }
	 * @apiErrorExample UnadaptableToken (401):
	 * {
	 * 	"code": "Unauthorized",
	 * 	"message": "Auth_UnadaptableToken"
	 * }
	 * @apiErrorExample ExpiredToken (401):
	 * {
	 * 	"code": "Unauthorized",
	 * 	"message": "Auth_ExpiredToken"
	 * }
	 */
	server.get(
		{
			path: "/auth/getAccessToken",
			version: "1.0.0"
		},
		restifyPlugins.jsonBodyParser({ mapParams: true }),
		[routeCtrl.getAccessToken]);

	/**
	 * @api {delete} /auth/logout Logout
	 * @apiGroup Auth
	 * @apiVersion 1.0.0
	 * @apiName Logout
	 * @apiHeader {String} Content-Type `application/json`.
	 * @apiDescription Deletes the given refresh token in the database. The user will no longer be able to request a new accessToken via the provided refreshToken. Although the accessToken will still be valid until it expires (up to 59 minutes later).
	 *
	 * NOTE: Clients must delete both refresh and access token from local storage.<br><br>
	 * Sample request:
	 * <pre>curl -X DELETE "http://localhost:3000/auth/logout"<br>
	 * -H "Content-Type: application/json"<br>
	 * -d '{"refreshToken":"JWT ey..."}'</pre><br>
	 *
	 * @apiParam {String} refreshToken The refresh token you'd like to disable.
	 * @apiSampleRequest off
	 * @apiSuccessExample Success (204):
	 * 	No Content
	 */
	server.del(
		{
			path: "/auth/logout",
			version: "1.0.0"
		},
		restifyPlugins.bodyParser({ mapParams: true }),
		[routeCtrl.logout]
	);

	/**
	 * @api {delete} /auth/logoutFromAll LogoutFromAll
	 * @apiGroup Auth
	 * @apiVersion 1.0.0
	 * @apiName LogoutFromAll
	 * @apiHeader {String} Content-Type `application/json`.
	 * @apiDescription Deletes all refresh tokens that match the user making the request.
	 *
	 * NOTE: Clients must delete both refresh and access token from local storage.<br><br>
	 *
	 * Sample request:
	 * <pre>curl -X DELETE "http://localhost:3000/auth/logoutFromAll"<br>
	 * -H "Content-Type: application/json"<br>
	 * -d '{"refreshToken":"JWT ey..."}'</pre><br>
	 *
	 * @apiParam {String} refreshToken The refresh token you'd like to disable.
	 * @apiSampleRequest off
	 * @apiSuccessExample Success (204):
	 * 	No Content
	 */
	server.del(
		{
			path: "/auth/logoutFromAll",
			version: "1.0.0"
		},
		restifyPlugins.bodyParser({ mapParams: true }),
		[routeCtrl.logoutFromAll]
	);
}

module.exports.routes = authRoute;
