import * as restify from "restify";
import * as restifyPlugins from "restify-plugins";
import userController from "../controllers/UserController";
import authMiddleware from "../middleware/authMiddleware";

/**
 * @apiDefine User User
 * Used to create and delete user accounts as well as to view and midify user details
 */

function userRoute(server: restify.Server) {
	const routeCtrl = userController;

	/**
	 * @api {put} /user/signup SignUp
	 * @apiGroup User
	 * @apiVersion 1.0.0
	 * @apiName SignUp
	 * @apiHeader {String} Content-Type `application/json`.
	 * @apiDescription Create a new user account<br><br>
	 *
	 * Sample request:
	 * <pre>curl -X PUT "http://localhost:3000/user/signup"<br>
	 * -H "Content-Type: application/json"<br>
	 * -d '{"email":"matt@matt.com","password":"test1234","type":"type1"}'</pre><br>
	 *
	 * @apiParam {String} email Email address [5-50 characters long, valid email address format]
	 * @apiParam {String} password Password [6-50 characters long, no other constraints]
	 * @apiParam {String} type User type. Must be one of the following [`type1`, `type2`]
	 * @apiSuccessExample {json} Success-Response:
	 * {
	 * 	"userId": String
	 * }
	 * @apiErrorExample InsufficientParameters (400):
	 * {
	 * "code": "BadRequest",
	 * "message": "General_InsufficientParameters"
	 * }
	 * @apiErrorExample InvalidEmailFormat (400):
	 * {
	 * "code": "BadRequest",
	 * "message": "User_InvalidEmailFormat"
	 * }
	 * @apiErrorExample EmailAddressExists (400):
	 * {
	 * "code": "BadRequest",
	 * "message": "User_EmailAddressExists"
	 * }
	 * @apiErrorExample InvalidPasswordLength (400):
	 * {
	 * "code": "BadRequest",
	 * "message": "User_InvalidPasswordLength"
	 * }
	 * @apiErrorExample InvalidUserType (400):
	 * {
	 * "code": "BadRequest",
	 * "message": "User_InvalidUserType"
	 * }
	 */
	server.put(
		{
			path: "/user/signup",
			version: "1.0.0"
		},
		restifyPlugins.jsonBodyParser({ mapParams: true }),
		[routeCtrl.signup]
	);

	/**
	 * @api {get} /user Details
	 * @apiGroup User
	 * @apiVersion 1.0.0
	 * @apiName Details
	 * @apiUse AuthHeader
	 * @apiDescription Gets user details<br><br>
	 *
	 * Sample request:
	 * <pre>curl -X GET "http://localhost:3000/user/"</pre><br>
	 *
	 * @apiSuccessExample {json} Success-Response:
	 * {
	 *   "basics": {
	 *     "userId": String,
	 *     "email": String,
	 *     "language": String
	 * }
	 *   "images": {}
	 *   "notifications": {}
	 * }
	 * @apiErrorExample InvalidUserType (404):
	 * {
	 * "code": "BadRequest",
	 * "message": "User_NotFound"
	 * }
	 */
	server.get(
		{
			path: "/user",
			version: "1.0.0"
		},
		restifyPlugins.jsonBodyParser({ mapParams: true }),
		[authMiddleware.validateAccessToken, routeCtrl.getUser]
	);

}

module.exports.routes = userRoute;
