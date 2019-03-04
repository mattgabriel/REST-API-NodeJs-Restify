import { ErrorMsg, Error, ErrorCode } from "../helpers/apiErrors";
import { db, TABLES, SCHEMA } from "../config/db";

export interface INewUser {
	userId: string;
	email: string;
	hashedPassword: string;
	role: number;
}

export interface IUserDetails {
	userId: string;
	email: string;
	role: number;
}

export class UserEntity {

	public static doesEmailAddressExist = async (email: string): Promise<boolean> => {
		try {
			const res = await db.select("*")
				.from(TABLES.users)
				.where({
					[SCHEMA.users.email]: email.toLowerCase()
				})
				.limit(1);
			if (res.length > 0) {
				return true;
			}
			return false;
		} catch (err) {
			throw new Error(ErrorMsg.General_DatabaseError);
		}
	}

	public static createUserRoles = async (user: INewUser): Promise<boolean> => {
		try {
			const res1 = await db(TABLES.users).insert({
				[SCHEMA.users.user_id]: user.userId,
				[SCHEMA.users.email]: user.email.toLowerCase(),
				[SCHEMA.users.password]: user.hashedPassword,
			});
			if (res1.rowCount === 1) {
				const res2 = await db(TABLES.user_roles).insert({
					[SCHEMA.user_roles.user_id]: user.userId,
					[SCHEMA.user_roles.role_id]: user.role,
				});

				if (res2.rowCount === 1) {
					return true;
				}
			}
			return false;
		} catch (err) {
			throw new Error(ErrorMsg.General_DatabaseError);
		}
	}

	public static getUserDetails = async (userId: string): Promise<IUserDetails> => {
		try {
			const res = await db.select("*")
				.from(TABLES.users)
				.leftJoin(TABLES.user_roles, `${TABLES.user_roles}.${SCHEMA.user_roles.user_id}`, `${TABLES.users}.${SCHEMA.users.user_id}`)
				.where({
					[`${TABLES.users}.${SCHEMA.users.user_id}`]: userId
				})
				.limit(1);
			if (res.length === 0) { throw new Error(ErrorMsg.User_NotFoundError, ErrorCode.NotFoundError); }
			return {
				userId: userId,
				email: res[0].email,
				role: parseInt(res[0].role_id)
			};
		} catch (err) {
			throw new Error(ErrorMsg.General_DatabaseError);
		}
	}

}