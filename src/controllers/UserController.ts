import * as restify from "restify";
import { config } from "../config/config";
import { Error, ApiError, ErrorCode, ErrorMsg, errorHandler } from "../helpers/apiErrors";
import { IToken, ITokenUser, generateToken } from "../models/authModel";
import { Auth } from "../services/authService";
import { UserService } from "../services/userService";
import { INewUser } from "../entities/userEntity";

class UserController {

	userService: UserService;

	constructor() {
		this.userService = new UserService();
	}

	public signup = async (req: restify.Request, res: restify.Response, next: restify.Next) => {
		try {
			if (!req.params || !req.params.email || !req.params.password || !req.params.type) {
				return next(ApiError.httpResponse(ErrorMsg.General_InsufficientParameters, ErrorCode.BadRequestError));
			}

			// create the user in the DB
			const userData: INewUser = await this.userService.createUser(req.params.email, req.params.password, req.params.type);

			// now we can generate some tokens for the user
			const user: ITokenUser = {
				userId: userData.userId,
				roleId: userData.role
			};

			const accessToken: IToken = generateToken(user, false);
			const refreshToken: IToken = generateToken(user, true);

			// the refresh token id (jti) should be store in the DB
			const auth = new Auth();
			await auth.storeTokenForUser(user.userId, refreshToken.jti, refreshToken.expires);

			return res.json(200, {
				accessToken: accessToken.token,
				accessTokenExpires_utc: accessToken.expires,
				accessTokenExpiresIn_s: config.accessTokenLifespan,
				refreshToken: refreshToken.token,
				refreshTokenExpires_utc: refreshToken.expires,
				refreshTokenExpiresIn_s: config.refreshTokenLifespan,
				userId: user.userId,
				roleId: user.roleId
			});
		} catch (err) {
			const error = errorHandler(err, new Error(ErrorMsg.General_InternalServerError, ErrorCode.InternalServerError));
			return next(ApiError.httpResponse(error.errorMsg, error.errorCode || ErrorCode.InternalServerError));
		}
	}

	public getUser = async (req: restify.Request, res: restify.Response, next: restify.Next) => {
		try {
			const userId = req._locals.userId;
			const user = await this.userService.getUser(userId);
			return res.json(200, user);
		} catch (err) {
			const error = errorHandler(err, new Error(ErrorMsg.General_InternalServerError, ErrorCode.InternalServerError));
			return next(ApiError.httpResponse(error.errorMsg, error.errorCode || ErrorCode.InternalServerError));
		}
	}
}

export default new UserController();