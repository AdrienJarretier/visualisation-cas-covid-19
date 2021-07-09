const common = require('../common.js');

const Database = require('better-sqlite3');



async function getByCountry(countryGeoId) {

    let records = await common.downloadData();

    let countryRecords = [];

    for (let record of records) {

        if (record.country_code.toUpperCase() == countryGeoId.toUpperCase()) {

            countryRecords.push(record);
            console.log(record);

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

        addCountry(db, countryGeoId, countryRecords[0]['country'])

    }


    console.log(' - filling cases for country ' + countryGeoId);


    stmt = db.prepare("INSERT INTO cases(country, date, cases, deaths) VALUES (?, ?, ?, ?)");

    let rowsInserted = 0;
    let lastInsertRowid;

    function getDateOfWeek(w, y) {
        var d = (1 + (w - 1) * 7); // 1st of January + 7 days for each week

        return new Date(y, 0, d);
    }

    let dataToSaveToDb = {}

    for (let record of countryRecords) {

        let year_weak = record.year_week.split('-')
        let dateTmp = getDateOfWeek(year_weak[1], year_weak[0])

        let year = dateTmp.getFullYear();
        let month = dateTmp.getMonth();
        let day = dateTmp.getDate();

        let date = (new Date(Date.UTC(year, month, day))).toJSON();

        if (!(date in dataToSaveToDb)) {

            dataToSaveToDb[date] = {
                'cases': 0,
                'deaths': 0
            }

        }

        dataToSaveToDb[date][record.indicator] = record.weekly_count

    }

    for (const [date, record] of Object.entries(dataToSaveToDb)) {

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
