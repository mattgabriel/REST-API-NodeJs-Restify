# NodeJS/Restify API

The idea of this repo is to have a production ready NodeJS REST API that can be used to quickly start new projects. 
It uses:

- TypeScript
- Restify
- PostgreSQL
- Redis
- Passport

Out of the box it contains endpoints to:

- Login
- Logout
- Request new access tokens
- Register users
- Get user details
- Update user details

To get started simply run `mv .env.example .env`, open the file and at leats fill in your PostgreSQL credentials after running the SQL queries in `config/tables.sql` to create the default tables.


## Install NodeJs on Ubuntu via NVM

`sudo apt-get update`

`sudo apt-get install build-essential libssl-dev`

`curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | sh`

`source ~/.profile`

Optional `nvm ls-remote` to view the NodeJs available versions

`nvm install 8.9.4` Installs the selected version



## SETUP

https://github.com/Microsoft/TypeScript-Node-Starter#typescript-node-starter

`npm install typescript --save`



### Install Sublime plugin (optional):

Enable Package Control via tools > developer

Install the TypeScript package: `cmd+shift+P` > type `install` > `TypeScript`


https://github.com/corvisacloud/SummitLinter

Install sublime linter

Install lua: `brew install lua`

Install luacheck: `luarocks install luacheck --local`

Install package: `cmd+shift+P` > type `install` > `SublimeLinter`


To run it: `tslint -c tslint.json -p tsconfig.json`



### Dependencies

`npm install -g concurrently`

`npm install apidoc -g`

`npm install`



## RUN

First of all, to build the docs, run:

`npm run docs`

Then you can create build the app and start the server like this:

`npm run build`

`export API_ENV=develop && npm run serve`



## DEBUG

SQL: `export DEBUG=knex:query`

NODE: `npm run debug` then on Chrome type: `chrome:inspect` and click on `Open dedicated DevTools for Node`



### Lifescyle

*Route*:

- Requested by clients

- Calls a Controller

- Many Routes can call the same Controller


*Controller*:

- Authenticates the user

- Calls a Service

- Specifies and sends the response


*Service*:

- Business logic

- Calls Models, Helpers and Entities


*Model*:

- Object


*Helpers*:

- Perform a small task

- Abstract methods


*Entity*:

- Database queries
