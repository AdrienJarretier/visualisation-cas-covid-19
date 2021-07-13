"use strict";

const csvParse = require('csv-parse/lib/sync');
const fs = require('fs');
const superagent = require('superagent');
const local_config_loader = require('env-config-prompt');

const serverConfig = JSON.parse(fs.readFileSync('config.json', 'utf8'));
const local_config = local_config_loader(false, 'localConfig.json', 'localConfig_template.json', 'server config');

Object.assign(serverConfig, local_config);


console.log(JSON.stringify(serverConfig, null, 4));
console.log()

function getDateOfWeek(w, y) {
    var d = (1 + (w - 1) * 7); // 1st of January + 7 days for each week

    return new Date(y, 0, d);
}

function parse14DaysNotificationCases(records) {

    let parsedData = {};

    for (let record of records) {

        let year_weak = record.year_week.split('-')
        let dateTmp = getDateOfWeek(year_weak[1], year_weak[0])

        let year = dateTmp.getFullYear();
        let month = dateTmp.getMonth();
        let day = dateTmp.getDate();

        let date = (new Date(Date.UTC(year, month, day))).toJSON();

        if (!(date in parsedData)) {

            parsedData[date] = {
                'cases': 0,
                'deaths': 0,
                'country_code': record.country_code,
                'country': record.country
            }

        }

        parsedData[date][record.indicator] = record.weekly_count

    }

    return parsedData
}

function parseDailyCases(records) {

    let parsedData = {};

    for (let record of records) {

        let year = record.year;
        let month = parseInt(record.month) - 1;
        let day = record.day;

        let date = (new Date(Date.UTC(year, month, day))).toJSON();

        parsedData[date] = {
            'cases': record.cases,
            'deaths': record.deaths,
            'country_code': record.geoId,
            'country': record.country
        }

    }

    return parsedData
}

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
            bom: true,
            columns: true,
            skip_empty_lines: true
        });

        return parse14DaysNotificationCases(records);

    } catch (err) {

        console.error("error when getting " + uri);
        console.error(err);

    }


}

exports.serverConfig = serverConfig;

exports.downloadData = downloadData;