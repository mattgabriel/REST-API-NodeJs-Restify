import * as restify from "restify";
import { config } from "../config/config";
import { Error, ApiError, ErrorCode, ErrorMsg } from "../helpers/apiErrors";
import { Token, IToken, ITokenUser, generateToken } from "../models/authModel";
import { Auth } from "../services/authService";
import * as jwt from "jwt-simple";

class AuthController {

	// const hasPassword = bcrypt.hashSync(password, 10);
	// curl -X GET "http://localhost:3000/auth/login/?email=a@a.com&password=test1234"
	public login = async (req: restify.Request, res: restify.Response, next: restify.Next) => {
		try {
			if (!req.params || !req.params.email || !req.params.password) {
				return next(ApiError.httpResponse(ErrorMsg.Auth_InsufficientParameters, ErrorCode.BadRequestError));
			}
			// Check if user exists in DB
			const auth = new Auth();
			const user: ITokenUser = await auth.validateCredentials(req.params.email, req.params.password);

			const accessToken: IToken = generateToken(user, false);
			const refreshToken: IToken = generateToken(user, true);

			// the refresh token id (jti) should be store in the DB
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
			if (err instanceof Error) {
				return next(ApiError.httpResponse(err.errorMsg, err.errorCode || ErrorCode.InternalServerError));
			}
			return next(ApiError.httpResponse(ErrorMsg.Auth_InvalidCredentials, ErrorCode.UnauthorizedError));
		}
	}

	// given a valid refresh token it will generate a new access token
	// curl -X GET "http://localhost:3000/auth/logout" -d '{"refreshToken":"JWT ey..."}' -H "Content-Type: application/json"
	public getAccessToken = async (req: restify.Request, res: restify.Response, next: restify.Next) => {
		try {
			if (!req.params && !req.params.refreshToken) {
				return next(ApiError.httpResponse(ErrorMsg.Auth_InsufficientParameters, ErrorCode.BadRequestError));
			}

			const rawToken = req.params.refreshToken.replace("JWT ", "");
			const token = jwt.decode(rawToken, config.authSecret);

			if (!token.userId || !token.jti) {
				return next(ApiError.httpResponse(ErrorMsg.Auth_InvalidToken, ErrorCode.BadRequestError));
			}

			const tokenObj = new Token(
				token.jti,
				token.userId,
				token.iss,
				token.exp,
				token.isRefreshToken,
				token.roleId
			);

			// If the refresh token is expired then we can't continue
			if (tokenObj.isExpired()) {
				return next(ApiError.httpResponse(ErrorMsg.Auth_ExpiredToken, ErrorCode.UnauthorizedError));
			}

			// Check in DB if jti is associated to userId
			const auth = new Auth();
			await auth.validateRefreshtoken(tokenObj.userId, tokenObj.jti); // on false it throws

			const user: ITokenUser = {
				userId: tokenObj.userId,
				roleId: tokenObj.roleId
			};

			const accessToken: IToken = generateToken(user, false);

			return res.json(200, {
				accessToken: accessToken.token,
				accessTokenExpires_utc: accessToken.expires,
				userId: tokenObj.userId,
				roleId: tokenObj.roleId
			});
		} catch (err) {
			if (err instanceof Error) {
				return next(ApiError.httpResponse(err.errorMsg, err.errorCode || ErrorCode.InternalServerError));
			}
			return next(ApiError.httpResponse(ErrorMsg.Auth_InsufficientParameters, ErrorCode.BadRequestError));
		}
	}

	// curl -X DELETE "http://localhost:3000/auth/logout" -d '{"refreshToken":"JWT ey..."}' -H "Content-Type: application/json"
	public logout = async (req: restify.Request, res: restify.Response, next: restify.Next) => {
		try {
			if (!req.params && !req.params.refreshToken) {
				return next(ApiError.httpResponse(ErrorMsg.Auth_InsufficientParameters, ErrorCode.BadRequestError));
			}

			const rawToken = req.params.refreshToken.replace("JWT ", "");
			const token = jwt.decode(rawToken, config.authSecret);

			if (!token.userId || !token.jti) {
				return next(ApiError.httpResponse(ErrorMsg.Auth_InvalidToken, ErrorCode.BadRequestError));
			}

			// delete token from DB
			const auth = new Auth();
			await auth.deleteToken(token.jti); // on false it throws
			return res.json(204);
		} catch (err) {
			if (err instanceof Error) {
				return next(ApiError.httpResponse(err.errorMsg, err.errorCode || ErrorCode.InternalServerError));
			}
			return next(ApiError.httpResponse(ErrorMsg.Auth_InsufficientParameters, ErrorCode.BadRequestError));
		}
	}

	// curl -X DELETE "http://localhost:3000/auth/logoutFromAll" -d '{"refreshToken":"JWT ey..."}' -H "Content-Type: application/json"
	public logoutFromAll = async (req: restify.Request, res: restify.Response, next: restify.Next) => {
		try {
			if (!req.params && !req.params.refreshToken) {
				return next(ApiError.httpResponse(ErrorMsg.Auth_InsufficientParameters, ErrorCode.BadRequestError));
			}

			const rawToken = req.params.refreshToken.replace("JWT ", "");
			const token = jwt.decode(rawToken, config.authSecret);

			if (!token.userId || !token.jti) {
				return next(ApiError.httpResponse(ErrorMsg.Auth_InvalidToken, ErrorCode.BadRequestError));
			}

			// delete token from DB
			const auth = new Auth();
			await auth.deleteAllTokensForUser(token.userId); // on false it throws
			return res.json(204);
		} catch (err) {
			if (err instanceof Error) {
				return next(ApiError.httpResponse(err.errorMsg, err.errorCode || ErrorCode.InternalServerError));
			}
			return next(ApiError.httpResponse(ErrorMsg.Auth_InsufficientParameters, ErrorCode.BadRequestError));
		}
	}
}

export default new AuthController();