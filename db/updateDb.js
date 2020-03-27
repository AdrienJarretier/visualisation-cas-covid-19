const superagent = require('superagent');

const common = require('../common.js');

const sqlite3 = require('sqlite3').verbose();

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

function addCountry(countryGeoId, name) {

    let db = new sqlite3.Database(common.serverConfig.db.database);

    let stmt = db.prepare("INSERT INTO countries(geoid, name) VALUES (?, ?);");

    stmt.on('error', (err) => {


    });
    stmt.run(countryGeoId, name);
    stmt.finalize();

    db.close(() => {

        console.log('country ' + countryGeoId + ', ' + name + ' added');

    });
}

async function fillCasesByCountry(countryGeoId) {

    countryGeoId = countryGeoId.toUpperCase();

    let countryRecords = await getByCountry(countryGeoId);

    let db = new sqlite3.Database(common.serverConfig.db.database);


    console.log(' - filling cases for country ' + countryGeoId);

    db.serialize(function () {

        let stmt = db.prepare("INSERT INTO cases(country, date, cases, deaths) VALUES (?, ?, ?, ?)");

        for (let record of countryRecords) {


            stmt.run(countryGeoId, record.dateRep, record.cases, record.deaths);

        }
        stmt.finalize();

    });

    db.close();
}



addCountry('FR', 'France');
fillCasesByCountry('FR');
