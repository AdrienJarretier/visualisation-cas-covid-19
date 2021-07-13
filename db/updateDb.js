const common = require('../common.js');

const Database = require('better-sqlite3');


function removeDate(db, date) {

    stmt = db.prepare("DELETE FROM cases WHERE date=?");
    stmt.run(date);

}

async function getByCountry(countryGeoId) {

    let records = await common.downloadData();

    return records[countryGeoId.toUpperCase()];

}

function addCountry(db, countryGeoId, name) {

    let stmt = db.prepare("INSERT INTO countries(geoid, name) VALUES (?, ?);");
    stmt.run(countryGeoId, name);

    console.log('country ' + countryGeoId + ', ' + name + ' added');

}

async function fillCasesByCountry(countryGeoId) {

    countryGeoId = countryGeoId.toUpperCase();

    let countryRecords = await getByCountry(countryGeoId);

    // console.log(countryRecords);
    // console.log('----------------countryRecords-----------------');

    const db = new Database(common.serverConfig.db.database);

    // check first if country is already in db, if not add it

    let stmt = db.prepare("SELECT count(geoid) FROM countries WHERE geoid = ?");
    let countryInDb = stmt.get(countryGeoId)['count(geoid)'] > 0;

    if (!countryInDb) {

        addCountry(db, countryGeoId, Object.values(countryRecords)[0]['country'])

    }


    console.log(' - filling cases for country ' + countryGeoId);


    stmt = db.prepare("INSERT INTO cases(country, date, cases, deaths) VALUES (?, ?, ?, ?)");

    let rowsInserted = 0;
    let lastInsertRowid;

    for (const [date, record] of Object.entries(countryRecords)) {

        try {

            const info = stmt.run(countryGeoId, date, record.cases, record.deaths);

            rowsInserted += info.changes;
            lastInsertRowid = info.lastInsertRowid;

        } catch (err) {

        }
    }

    removeDate(db, '2021-03-01T00:00:00.000Z');

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
