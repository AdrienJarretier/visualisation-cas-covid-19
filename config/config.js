// ------------------------------------------------------ IMPORTS

const config_loader = require('env-config-prompt');
const deepmerge = require('deepmerge');
const fs = require('fs');

// ------------------------------------------------------ DATA

const template_file = __dirname + '/localConfig_template.json';
const local_file = __dirname + '/localConfig.json';
const global_file = __dirname + '/globalConfig.json';

// ------------------------------------------------------ LOADING

const localConfig = config_loader(false,local_file, template_file,'server config');
const serverConfig = JSON.parse(fs.readFileSync(global_file, 'utf8'));

// ------------------------------------------------------ MERGING

var config = deepmerge(serverConfig, localConfig);

// ------------------------------------------------------ EXPORTS

module.exports = config;