import * as restify from "restify";
import { ApiError, ErrorCode, ErrorMsg } from "../helpers/apiErrors";
import * as passport from "passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { config } from "../config/config";
import { Token } from "../models/authModel";

export default class AuthMiddleware {

	static validateAccessToken = async (req: restify.Request, res: restify.Response, next: restify.Next) => {
		AuthMiddleware.initialize();
		passport.authenticate("jwt", {session: false, failWithError: true}, (err, token: Token, info) => {
			// Can't decode token
			if (err || !token) {
				return next(ApiError.httpResponse(ErrorMsg.Auth_UnadaptableToken, ErrorCode.UnauthorizedError));
			}

			// refresh tokens can't be used as access tokens
			if (token.isRefreshToken === true) {
				return next(ApiError.httpResponse(ErrorMsg.Auth_InvalidToken, ErrorCode.UnauthorizedError));
			}

			// token expired
			if (token.isExpired()) {
				return next(ApiError.httpResponse(ErrorMsg.Auth_ExpiredToken, ErrorCode.UnauthorizedError));
			}

			// set session details
			req._locals = token;
			return next();
		})(req, res);
	}

	static getAccessTokenFromHeader = async (req: restify.Request, res: restify.Response, next: restify.Next) => {
		AuthMiddleware.initialize();
		passport.authenticate("jwt", {session: false, failWithError: true}, (err, token: Token, info) => {
			// Can't decode token
			if (err || !token) {
				return next(ApiError.httpResponse(ErrorMsg.Auth_UnadaptableToken, ErrorCode.UnauthorizedError));
			}

			// access tokens can't be used as refresh tokens
			if (token.isRefreshToken === false) {
				return next(ApiError.httpResponse(ErrorMsg.Auth_InvalidToken, ErrorCode.UnauthorizedError));
			}

			// token expired
			if (token.isExpired()) {
				return next(ApiError.httpResponse(ErrorMsg.Auth_ExpiredToken, ErrorCode.UnauthorizedError));
			}

			// set session details
			req._locals = token;
			return next();
		})(req, res);
	}

	private static initialize = () => {
		passport.use("jwt", AuthMiddleware.getStrategy());
		return passport.initialize();
	}

	private static getStrategy = (): Strategy => {
		const params: any = {
			secretOrKey: config.authSecret,
			jwtFromRequest: ExtractJwt.fromAuthHeader(),
			passReqToCallback: true
		};
		return new Strategy(params, (req: any, payload: any, done: any) => {
			const token = new Token(payload.jti, payload.userId, payload.iss, payload.exp, payload.isRefreshToken, payload.roleId);
			return done(undefined, token);
		});
	}

}