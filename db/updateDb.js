const common = require('../common.js');

const sqlite3 = require('sqlite3').verbose();



async function getByCountry(countryGeoId) {

    let records = await common.downloadData();

    let countryRecords = [];

    for (let record of records) {

        if (record.geoId.toUpperCase() == countryGeoId.toUpperCase()) {

            countryRecords.push(record);

        }

    }

    return countryRecords;

}

function addCountry(countryGeoId, name) {

    return new Promise((resolve, reject) => {

        let db = new sqlite3.Database(common.serverConfig.db.database);

        let stmt = db.prepare("INSERT INTO countries(geoid, name) VALUES (?, ?);");

        stmt.on('error', (err) => {


        });
        stmt.run(countryGeoId, name);
        stmt.finalize();

        db.close(() => {

            console.log('country ' + countryGeoId + ', ' + name + ' added');

            resolve();

        });

    });
}

async function fillCasesByCountry(countryGeoId) {

    countryGeoId = countryGeoId.toUpperCase();

    let countryRecords = await getByCountry(countryGeoId);

    let db = new sqlite3.Database(common.serverConfig.db.database);


    console.log(' - filling cases for country ' + countryGeoId);

    db.serialize(function () {

        let stmt = db.prepare("INSERT INTO cases(country, date, cases, deaths) VALUES (?, ?, ?, ?)");

        stmt.on('error', (err) => {


        });

        for (let record of countryRecords) {

            let year = record.year;
            let month = parseInt(record.month) - 1;
            let day = record.day;

            let date = (new Date(Date.UTC(year, month, day))).toJSON();


            stmt.run(countryGeoId, date, record.cases, record.deaths);

        }
        stmt.finalize();

    });

    db.close();
}



// addCountry('FR', 'France')
//     .then(() => {
//         fillCasesByCountry('FR');
//     });

exports.fillCasesByCountry = fillCasesByCountry;
