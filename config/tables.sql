-- DROP TABLE user_refresh_tokens;
-- DROP TABLE users_roles;
-- DROP TABLE users;

CREATE TABLE IF NOT EXISTS users (
	user_id character varying(100),
	email character varying(50) UNIQUE,
	first_name character varying(50),
	last_name character varying(50),
	username character varying(50) UNIQUE,
	password character varying(250),
	created_on timestamp without time zone default (now() at time zone 'utc'),
	updated_on timestamp without time zone default (now() at time zone 'utc'),
	CONSTRAINT users_pkey PRIMARY KEY (user_id)
);

CREATE TABLE IF NOT EXISTS user_roles (
	user_id character varying(100) REFERENCES users(user_id) ON DELETE CASCADE,
	role_id integer,
	created_on timestamp without time zone default (now() at time zone 'utc'),
	updated_on timestamp without time zone default (now() at time zone 'utc'),
	CONSTRAINT users_roles_pkey PRIMARY KEY (user_id)
);

CREATE TABLE IF NOT EXISTS user_refresh_tokens (
	user_id character varying(100) REFERENCES users(user_id) ON DELETE CASCADE,
	token_id character varying(20),
	created_on timestamp without time zone default (now() at time zone 'utc'),
	expires_on timestamp without time zone default (now() at time zone 'utc'),
	CONSTRAINT user_refresh_tokens_pkey PRIMARY KEY (user_id, token_id)
);


-- Dummy data
INSERT INTO users (user_id, email, first_name, last_name, username, password) VALUES ('aaaaa', 'matt@matt.com', 'matt', 'm', 'mattm', '$2a$10$QYqoXgrPMWk8RUpRDb/H0uY9B7Nk2NF2/eWBnAGCmcY62uRqBzOcm'); -- password = test1234
INSERT INTO user_roles (user_id, role_id) VALUES ('aaaaa', 100);