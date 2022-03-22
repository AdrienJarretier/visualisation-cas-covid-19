"use strict";

const csvParse = require('csv-parse/lib/sync');
const fs = require('fs');
const superagent = require('superagent');
const local_config_loader = require('env-config-prompt');
const { EOL } = require('os');

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

        let countryCode = record.country_code.toUpperCase();

        if (!(countryCode in parsedData)) {

            parsedData[countryCode] = {};
        };

        if (!(date in parsedData[countryCode])) {

            parsedData[date] = {
                'cases': 0,
                'deaths': 0,
                'country': record.country
            }

        }

        parsedData[date][record.indicator] = record.weekly_count

    }

    return parsedData
}

function parseDailyCases(records, countryGeoId) {

    let parsedData = {};
    switch (countryGeoId) {
        case 'FRA':
            for (let record of records) {
                const dateArray = record.date.split('-');
                const year = dateArray[0];
                const month = dateArray[1];
                const day = dateArray[2];
                let date = (new Date(Date.UTC(year, month, day))).toJSON();

                if (!(countryGeoId in parsedData)) {
                    parsedData[countryGeoId] = {};
                };

                parsedData[countryGeoId][date] = {
                    'cases': record.conf_j1,
                    'deaths': record.incid_dchosp,
                    'country': serverConfig.countries.data.find(e => e.geoid == countryGeoId).name
                }

                // console.log(EOL);
                // console.log(record);
                // console.log('-');
                // console.log(parsedData[countryGeoId][date]);
                // console.log(EOL);
            }



            break;
        default:
            for (let record of records) {
                let year = record.year;
                let month = parseInt(record.month) - 1;
                let day = record.day;
                let date = (new Date(Date.UTC(year, month, day))).toJSON();
                let countryCode = record.countryterritoryCode.toUpperCase();
                if (!(countryCode in parsedData)) {
                    parsedData[countryCode] = {};
                };
                parsedData[countryCode][date] = {
                    'cases': record.cases,
                    'deaths': record.deaths,
                    'country': record.countriesAndTerritories
                }
            }
            break;
    }

    return parsedData
}

async function downloadData(countryGeoId) {

    const uri = serverConfig.countries.data.find(e => e.geoid == countryGeoId).dataUri;

    try {

        console.log('getting ' + uri);

        const res = await superagent.get(uri)
            .set("Content-Type", "text/csv")
            .set("accept", "application/octet-stream")
            .buffer(true).disableTLSCerts();

        const records = csvParse(res.text.toString(), {
            bom: true,
            columns: true,
            skip_empty_lines: true
        });

        return parseDailyCases(records, countryGeoId);

    } catch (err) {

        throw 'common.js downloadData() : error when getting ' + uri + EOL + err.toString();

    }


}

exports.serverConfig = serverConfig;

exports.downloadData = downloadData;