const common = require('../common.js');

const Database = require('better-sqlite3');



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

        const db = new Database(common.serverConfig.db.database, { verbose: console.log });

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

    const db = new Database(common.serverConfig.db.database);


    console.log(' - filling cases for country ' + countryGeoId);


    let stmt = db.prepare("INSERT INTO cases(country, date, cases, deaths) VALUES (?, ?, ?, ?)");

    let rowsInserted = 0;

    for (let record of countryRecords) {

        let year = record.year;
        let month = parseInt(record.month) - 1;
        let day = record.day;

        let date = (new Date(Date.UTC(year, month, day))).toJSON();


        try {

            const info = stmt.run(countryGeoId, date, record.cases, record.deaths);

            rowsInserted += info.changes;

        } catch (err) {

        }


    }
    console.log(rowsInserted + " rows inserted");

    db.close();
    console.log('cases for country ' + countryGeoId + ' added');
}



// addCountry('FR', 'France')
//     .then(() => {
//         fillCasesByCountry('FR');
//     });

fillCasesByCountry('FR');

exports.fillCasesByCountry = fillCasesByCountry;
