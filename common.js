"use strict";

const csvParse = require('csv-parse/lib/sync');
const fs = require('fs');
const superagent = require('superagent');

const serverConfig = JSON.parse(fs.readFileSync('config.json', 'utf8'));
Object.assign(serverConfig, JSON.parse(fs.readFileSync('localConfig.json', 'utf8')));

console.log(JSON.stringify(serverConfig, null, 2));

async function downloadData() {

    let uri = serverConfig.dataBaseUri + '/csv';
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