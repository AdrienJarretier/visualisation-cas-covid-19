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

function addCountry(db, countryGeoId, name) {

    let stmt = db.prepare("INSERT INTO countries(geoid, name) VALUES (?, ?);");
    stmt.run(countryGeoId, name);

    console.log('country ' + countryGeoId + ', ' + name + ' added');

}

async function fillCasesByCountry(countryGeoId) {

    countryGeoId = countryGeoId.toUpperCase();

    let countryRecords = await getByCountry(countryGeoId);

    const db = new Database(common.serverConfig.db.database);

    // check first if country is already in db, if not add it

    let stmt = db.prepare("SELECT count(geoid) FROM countries WHERE geoid = ?");
    let countryInDb = stmt.get(countryGeoId)['count(geoid)'] > 0;

    if (!countryInDb) {

        addCountry(db, countryGeoId, countryRecords[0]['countriesAndTerritories'])

    }


    console.log(' - filling cases for country ' + countryGeoId);


    stmt = db.prepare("INSERT INTO cases(country, date, cases, deaths) VALUES (?, ?, ?, ?)");

    let rowsInserted = 0;
    let lastInsertRowid;

    for (let record of countryRecords) {

        let year = record.year;
        let month = parseInt(record.month) - 1;
        let day = record.day;

        let date = (new Date(Date.UTC(year, month, day))).toJSON();


        try {

            const info = stmt.run(countryGeoId, date, record.cases, record.deaths);

            rowsInserted += info.changes;
            lastInsertRowid = info.lastInsertRowid;

        } catch (err) {

        }


    }

    db.close();
    console.log('cases for country ' + countryGeoId + ' added');

    return { rowsInserted: rowsInserted, lastInsertRowid: lastInsertRowid };
}



// addCountry('FR', 'France')
//     .then(() => {
//         fillCasesByCountry('FR');
//     });

// let rowsInserted = fillCasesByCountry('FR');
// console.log(rowsInserted + " rows inserted");

exports.fillCasesByCountry = fillCasesByCountry;
