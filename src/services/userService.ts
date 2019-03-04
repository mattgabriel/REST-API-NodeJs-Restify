import * as bcrypt from "bcryptjs";
import { Error, ErrorCode, ErrorMsg, errorHandler } from "../helpers/apiErrors";
import { FieldValidator } from "../helpers/fieldValidator";
import { UserRoles, UserRole } from "../models/userModel";
import { UserEntity, INewUser } from "../entities/userEntity";
import { Random } from "../helpers/random";

export class User {

	/*
		- validate email address format
		- validate password length
		- validate user type
		- validate duplicate email address
		@return validated fields
		throws on error
	*/
	public createUser = async (email: string, password: string, role: string): Promise<INewUser> => {
		try {
			if (!FieldValidator.stringLengthBetween(password, 6, 50)) {
				throw new Error(ErrorMsg.User_InvalidPasswordLength, ErrorCode.BadRequestError);
			}

			if (!FieldValidator.email(email)) {
				throw new Error(ErrorMsg.User_InvalidEmailFormat, ErrorCode.BadRequestError);
			}

			if (!FieldValidator.existsInEnum(role, UserRoles)) {
				throw new Error(ErrorMsg.User_InvalidUserType, ErrorCode.BadRequestError);
			}

			// check if email already exists in DB
			if (await UserEntity.doesEmailAddressExist(email)) {
				throw new Error(ErrorMsg.User_EmailAddressExists, ErrorCode.BadRequestError);
			}

			// create all user rows
			const newUser: INewUser = await this.createUserRows(email, password, UserRole.getRole(role));
			return newUser;
		} catch (err) {
			throw errorHandler(err, new Error(ErrorMsg.General_InternalServerError, ErrorCode.InternalServerError));
		}
	}

	private createUserRows = async (email: string, password: string, role: UserRoles): Promise<INewUser> => {
		try {
			const user: INewUser = {
				userId: Random.string(20),
				email: email,
				hashedPassword: bcrypt.hashSync(password, 10),
				role: role
			};
			if (await UserEntity.createUserRoles(user)) {
				return user;
			}
			throw new Error(ErrorMsg.General_InternalServerError, ErrorCode.InternalServerError);
		} catch (err) {
			throw errorHandler(err, new Error(ErrorMsg.General_InternalServerError, ErrorCode.InternalServerError));
		}
	}

}