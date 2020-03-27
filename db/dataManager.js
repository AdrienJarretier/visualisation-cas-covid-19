
// ------------------------------------------------------ REQUIRE

const sqlite3 = require('sqlite3').verbose();
const common = require('../common.js');
let db = new sqlite3.Database(common.serverConfig.db.database);

// ------------------------------------------------------ INNER DB METHODS

async function select_db(sql, transfer_key=null, remove_transferd_key=false) {

    return new Promise(resolve => {
        db.all(sql, function(err, rows) {

            // -- simple call
            if (transfer_key == null) {
                resolve(rows)
                return
            }

            // -- transfered call
            let data_obj = {}
            for(let row of rows) {
                let value_to_transfer = row[transfer_key]
                if(remove_transferd_key) {
                    delete row[transfer_key]
                }
                data_obj[value_to_transfer] = row
            }
            resolve(data_obj)
            return
        })
    })
}

async function db_get_all_by_prop(table, prop, value, transfer_key=null, remove_transferd_key=false) {
    if (typeof value == 'string') {
        value = '"' + value + '"'
    }
    let sql = 'SELECT * FROM ' + table + ' WHERE ' + prop + ' = ' + value;
    return await select_db(sql,  transfer_key, remove_transferd_key);
}

async function db_get_all(table, transfer_key=null, remove_transferd_key=false) {
    let sql = 'SELECT * FROM ' + table
    return await select_db(sql,  transfer_key, remove_transferd_key)
}

// ------------------------------------------------------ CORE DATA SYS

// ------------------ CASE DATA BY GEOID

async function get_data_by_geoid(geoid) {
    return await db_get_all_by_prop('cases', 'Country', geoid)
}

// ------------------ GET ALL COUNTRIES

async function get_all_countries() {
    return await db_get_all('countries', 'geoid', true)
}

// ------------------------------------------------------ EXPORTS

exports.get_all_countries = get_all_countries
exports.get_data_by_geoid = get_data_by_geoid