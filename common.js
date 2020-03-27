"use strict";

const fs = require('fs');

const serverConfig = JSON.parse(fs.readFileSync('config.json', 'utf8'));

exports.serverConfig = serverConfig;