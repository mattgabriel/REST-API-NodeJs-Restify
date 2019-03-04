var shell = require("shelljs");

shell.rm("-rf", "./dist/public");
shell.mkdir("-p", "./dist");
shell.mkdir("-p", "./dist/public");
shell.cp("-R", "./src/public", "./dist/public/"); //bug
