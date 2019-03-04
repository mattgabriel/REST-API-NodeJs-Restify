import { ErrorMsg, Error } from "../helpers/apiErrors";
import { db, TABLES, SCHEMA } from "../config/db";

export interface IAuthDetails {
	user_id: string;
	email: string;
	password: string;
	role_id: number;
}

export class AuthEntity {

	public static getAuthDetailsFromEmail = async (email: string): Promise<IAuthDetails> => {
		try {
			const res = await db.select("*")
				.from(TABLES.users)
				.leftJoin(TABLES.user_roles, `${TABLES.user_roles}.${SCHEMA.user_roles.user_id}`, `${TABLES.users}.${SCHEMA.users.user_id}`)
				.where({
					[SCHEMA.users.email]: email.toLowerCase()
				})
				.limit(1);
			if (res.length > 0) {
				return {
					user_id: res[0].user_id,
					email: res[0].email,
					password: res[0].password,
					role_id: parseInt(res[0].role_id),
				};
			}
			throw new Error(ErrorMsg.Auth_InvalidCredentials);
		} catch (err) {
			throw new Error(ErrorMsg.General_DatabaseError);
		}
	}

	public static validateRefreshtoken = async (userId: string, jti: string): Promise<boolean> => {
		try {
			const res = await db.select("*")
				.from(TABLES.user_refresh_tokens)
				.where({
					[SCHEMA.user_refresh_tokens.user_id]: userId,
					[SCHEMA.user_refresh_tokens.token_id]: jti
				})
				.limit(1);
			if (res.length > 0) return true;
			throw new Error(ErrorMsg.Auth_InvalidCredentials);
		} catch (err) {
			throw new Error(ErrorMsg.General_DatabaseError);
		}
	}

	public static storeTokenForUser = async (userId: string, jti: string, expires: string): Promise<boolean> => {
		try {
			const res = await db(TABLES.user_refresh_tokens).insert({
				[SCHEMA.user_refresh_tokens.user_id]: userId,
				[SCHEMA.user_refresh_tokens.token_id]: jti,
				[SCHEMA.user_refresh_tokens.expires_on]: expires,
			});
			if (res.rowCount === 1) return true;
			return false;
		} catch (err) {
			throw new Error(ErrorMsg.General_DatabaseError);
		}
	}

	public static deleteToken = async (jti: string): Promise<boolean> => {
		try {
			const res = await db(TABLES.user_refresh_tokens).del().where({
				[SCHEMA.user_refresh_tokens.token_id]: jti
			});
			if (res > 0) return true;
			return false;
		} catch (err) {
			throw new Error(ErrorMsg.General_DatabaseError);
		}
	}

	public static deleteAllTokensForUser = async (userId: string): Promise<boolean> => {
		try {
			const res = await db(TABLES.user_refresh_tokens).del().where({
				[SCHEMA.user_refresh_tokens.user_id]: userId
			});
			if (res > 0) return true;
			return false;
		} catch (err) {
			throw new Error(ErrorMsg.General_DatabaseError);
		}
	}

}

