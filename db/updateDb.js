const superagent = require('superagent');

const common = require('../common.js');

async function downloadData() {

    // let uri = common.serverConfig.dataUri;
    let uri = '127.0.0.1:' + common.serverConfig.port + '/testjson.json';

    try {

        console.log('getting ' + uri);

        const res = await superagent.get(uri);

        return res.body.records;

    } catch (err) {

        console.error("error when getting " + uri);
        console.error(err);

    }


}

async function getByCountry(countryGeoId) {

    let records = await downloadData();

    let countryRecords = [];

    for (let record of records) {

        if (record.geoId.toUpperCase() == countryGeoId.toUpperCase()) {

            countryRecords.push(record);

        }

    }

    return countryRecords;

}

async function fillCasesByCountry(countryGeoId) {

    let countryRecords = await getByCountry(countryGeoId);

    console.log(countryRecords);
    console.log(countryRecords.length);

}

fillCasesByCountry('fr');
