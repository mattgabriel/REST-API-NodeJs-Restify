import * as moment from "moment";
import { Random } from "../helpers/random";
import * as jwt from "jwt-simple";
import { config } from "../config/config";

export class Token {
	readonly iss: string; // issuer
	readonly jti: string; // token ID
	readonly exp: number; // expiration timestamp
	readonly userId: string;
	readonly roleId: number;
	readonly isRefreshToken: boolean;

	constructor(tokenId: string, userId: string, issuer: string, expiryDate: number, isRefreshToken: boolean = false, roleId: number = 100) {
		this.iss = issuer;
		this.jti = tokenId;
		this.exp = expiryDate;
		this.userId = userId;
		this.roleId = roleId;
		this.isRefreshToken = isRefreshToken;
	}

	isExpired(): boolean {
		if (this.exp < moment().utc().unix()) {
			return true;
		}
		return false;
	}
}

export interface IToken {
	jti: string;
	token: string;
	expires: string;
}

export interface ITokenUser {
	userId: string;
	roleId: number;
}

export const generateToken = (user: ITokenUser, isRefreshToken: boolean = true): IToken => {
	const expires = isRefreshToken ?
		moment().utc().add({ seconds: config.refreshTokenLifespan }).unix() :
		moment().utc().add({ seconds: config.accessTokenLifespan }).unix();

	const jti: string = Random.string(20); // token ID
	const token = jwt.encode({
		iss: "API", // issuer
		jti: jti,
		exp: expires,
		userId: user.userId,
		roleId: user.roleId,
		isRefreshToken: isRefreshToken,
	}, config.authSecret);

	return {
		jti: jti,
		token: "JWT " + token,
		expires: moment.unix(expires).format()
	};
};