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

async function fillCasesByCountry(countryGeoId) {


    let countryRecords = await getByCountry(countryGeoId);

    console.log(countryRecords);
    console.log(countryRecords.length);

    let db = new sqlite3.Database(common.serverConfig.db.database);

    let stmt = db.prepare("INSERT INTO countries(geoid, name) VALUES (?, ?);");
    stmt.run('FR', 'France');
    stmt.finalize();

    db.serialize(function () {

        let stmt = db.prepare("INSERT INTO cases(country, date, cases, deaths) VALUES (?, ?, ?, ?)");

        for (let i = 1; i < dataArray.length; ++i) {

            let geoShape = JSON.parse(dataArray[i][1]);
            stmt.run(geoShape.coordinates[0], geoShape.coordinates[1], dataArray[i][2], dataArray[i][3], dataArray[i][4]);

        }
        stmt.finalize();

    });

    db.close();
}

fillCasesByCountry('fr');
