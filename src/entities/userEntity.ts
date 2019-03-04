import { ErrorMsg, Error } from "../helpers/apiErrors";
import { db, TABLES, SCHEMA } from "../config/db";

export interface INewUser {
	userId: string;
	email: string;
	hashedPassword: string;
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
				[SCHEMA.users.email]: user.email,
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

}