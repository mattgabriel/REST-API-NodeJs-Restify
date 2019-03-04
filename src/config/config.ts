import * as dotenv from "dotenv";
dotenv.config();

// list of valid environments
const environments = ["test", "development", "production"];
// make sure config.env is in the list above (just in case the user makes a mistake)
let env = process.env.API_ENV || environments[0];
if (environments.indexOf(env) === -1) {
	env = environments[0];
}

export const config = {
	name: process.env.API_NAME || "API",
	version: process.env.API_VERSION || "1.0.0",
	pipelineVersion: process.env.API_VERSION || "1.0.0",
	pipelineEnvironment: process.env.API_ENV || "production",
	authSecret: process.env.API_AUTH_SECRET || "mySuperSecurePassword",
	refreshTokenLifespan: 31536000, // in seconds
	accessTokenLifespan: 3600, // in seconds
	env: env,
	port: process.env.API_PORT || 3000,
	base_url: process.env.BASE_URL || "http://localhost",
	postgresql: {
		user: process.env.API_PG_USER || "",
		pass: process.env.API_PG_PASS || "",
		host: process.env.API_PG_HOST || "",
		port: process.env.API_PG_PORT || 5432,
		db: process.env.API_PG_DB || "",
	},
	redis: {
		host: process.env.API_REDIS_HOST || "",
		port: process.env.API_REDIS_PORT || "",
		key_version: "v1.0"
	},
	mandrill: {
		id: process.env.API_MANDRILL_ID || "",
	},
	aws: {
		access_key_id: process.env.API_AWS_ACCESS_KEY_ID || "",
		secret_access_key: process.env.API_AWS_SECRET_ACCESS_KEY || "",
		bucket: process.env.API_AWS_BUCKET || ""
	},
	slack: {
		hookUri: process.env.API_SLACK_HOOK_URI || ""
	},
	basePath: (path: String) => {
		return "/" + path.replace(/^\//, "");
	}
};
