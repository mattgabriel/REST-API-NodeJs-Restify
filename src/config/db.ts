import { config } from "../config/config";
import * as client from "knex";

export const db: client = client({
	client: "pg",
	connection: {
		host: config.postgresql.host,
		// ssl: true,
		user: config.postgresql.user,
		password: config.postgresql.pass,
		database: config.postgresql.db
	},
	pool: {
		min: 2,
		max: 20
	},
	debug: false,
});


export const TABLES = {
	users: "users",
	user_roles: "user_roles",
	user_refresh_tokens: "user_refresh_tokens"
};

export const SCHEMA = {
	users: {
		user_id: "user_id",
		email: "email",
		first_name: "first_name",
		last_name: "last_name",
		username: "username",
		password: "password",
		created_on: "created_on",
		updated_on: "updated_on"
	},
	user_roles: {
		user_id: "user_id",
		role_id: "role_id",
		created_on: "created_on",
		updated_on: "updated_on"
	},
	user_refresh_tokens: {
		user_id: "user_id",
		token_id: "token_id",
		created_on: "created_on",
		expires_on: "expires_on"
	},

};