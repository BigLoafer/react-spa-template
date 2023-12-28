"use strict";

const fs = require("fs");
const paths = require("./paths");

// Make sure that including paths.js after env.js will read .env variables.
delete require.cache[require.resolve("./paths")];

const dotenvFiles = [paths.dotenv].filter(Boolean);

dotenvFiles.forEach(dotenvFile => {
    if (fs.existsSync(dotenvFile)) {
        require("dotenv-expand")(
            require("dotenv").config({
                path: dotenvFile
            })
        );
    }
});

const APP_ = /^APP_/i;

const raw = Object.keys(process.env)
    .filter(key => APP_.test(key))
    .reduce(
        (env, key) => {
            env[key] = process.env[key];
            return env;
        },
        {
            NODE_ENV: process.env.NODE_ENV || "development",
            PUBLIC_URL: process.env.PUBLIC_URL,
            AJAX_PREFIX: process.env.AJAX_PREFIX,
            APP_API_PREFIX: process.env.APP_API_PREFIX,
            BASE_NAME: process.env.BASE_NAME || ""
        }
    );

const stringified = {
    "process.env": Object.keys(raw).reduce((env, key) => {
        env[key] = JSON.stringify(raw[key]);
        return env;
    }, {})
};

module.exports = stringified;
