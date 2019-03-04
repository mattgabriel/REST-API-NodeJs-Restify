import * as bcrypt from "bcryptjs";
import { Error, ErrorCode, ErrorMsg, errorHandler } from "../helpers/apiErrors";
import { AuthEntity, IAuthDetails } from "../entities/authEntity";
import { ITokenUser } from "../models/authModel";

export class Auth {

	public validateCredentials = async (email: string, password: string): Promise<ITokenUser> => {
		// get user details for user with email address = email
		try {
			const res: IAuthDetails = await AuthEntity.getAuthDetailsFromEmail(email);
			if (res.password && bcrypt.compareSync(password, res.password)) {
				return {
					userId: res.user_id,
					roleId: res.role_id
				};
			}
			throw new Error(ErrorMsg.Auth_InvalidPassword, ErrorCode.UnauthorizedError);
		} catch (err) {
			throw errorHandler(err, new Error(ErrorMsg.Auth_Forbidden, ErrorCode.UnauthorizedError));
		}
	}

	public validateRefreshtoken = async (userId: string, jti: string) => {
		// check if there is a DB row matching userId and jti
		try {
			const res: boolean = await AuthEntity.validateRefreshtoken(userId, jti);
			if (!res) {
				throw new Error(ErrorMsg.Auth_InvalidToken, ErrorCode.UnauthorizedError);
			}
			return;
		} catch (err) {
			throw errorHandler(err, new Error(ErrorMsg.Auth_Forbidden, ErrorCode.UnauthorizedError));
		}
	}

	public storeTokenForUser = async (userId: string, jti: string, expires: string): Promise<boolean> => {
		// get user details for user with email address = email
		try {
			const res: boolean = await AuthEntity.storeTokenForUser(userId, jti, expires);
			if (res) {
				return true;
			}
			throw new Error(ErrorMsg.General_DatabaseError, ErrorCode.UnauthorizedError);
		} catch (err) {
			throw errorHandler(err, new Error(ErrorMsg.General_DatabaseError, ErrorCode.UnauthorizedError));
		}
	}

	public deleteToken = async (jti: string): Promise<boolean> => {
		// delete matching token from DB
		try {
			const res: boolean = await AuthEntity.deleteToken(jti);
			if (res) {
				return true;
			}
			throw new Error(ErrorMsg.Auth_MissingToken, ErrorCode.NotFoundError);
		} catch (err) {
			throw errorHandler(err, new Error(ErrorMsg.Auth_MissingToken, ErrorCode.UnauthorizedError));
		}
	}

	public deleteAllTokensForUser = async (userId: string): Promise<boolean> => {
		// delete matching token from DB
		try {
			const res: boolean = await AuthEntity.deleteAllTokensForUser(userId);
			if (res) {
				return true;
			}
			throw new Error(ErrorMsg.Auth_MissingToken, ErrorCode.NotFoundError);
		} catch (err) {
			throw errorHandler(err, new Error(ErrorMsg.Auth_MissingToken, ErrorCode.UnauthorizedError));
		}
	}
}
