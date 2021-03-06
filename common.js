"use strict";

const csvParse = require('csv-parse/lib/sync');
const fs = require('fs');
const superagent = require('superagent');
const local_config_loader = require('env-config-prompt');

const serverConfig = JSON.parse(fs.readFileSync('config.json', 'utf8'));
const local_config = local_config_loader(false,'localConfig.json','localConfig_template.json','server config');

Object.assign(serverConfig, local_config);


console.log(JSON.stringify(serverConfig, null, 4));
console.log()

async function downloadData() {

    let uri = serverConfig.dataBaseUri;
    // let uri = '127.0.0.1:' + common.serverConfig.port + '/testjson.json';

    try {

        console.log('getting ' + uri);

        const res = await superagent.get(uri)
            .set("Content-Type", "text/csv")
            .set("accept", "application/octet-stream")
            .buffer(true).disableTLSCerts();


        const records = csvParse(res.body.toString(), {
            columns: true,
            skip_empty_lines: true
        });

        return records;

    } catch (err) {

        console.error("error when getting " + uri);
        console.error(err);

    }


}

exports.serverConfig = serverConfig;

exports.downloadData = downloadData;