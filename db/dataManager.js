
// ------------------------------------------------------ REQUIRE

const sqlite3 = require('sqlite3').verbose();
const common = require('../common.js');
let db = new sqlite3.Database(common.serverConfig.db.database);

// ------------------------------------------------------ INNER DB METHODS


// ------------------ TRANSFORMERS METHODS

function remove_props_inplace(obj, props_to_remove) {
    for(let id in obj) {
        for(let prop of props_to_remove) {
            delete obj[id][prop]
        }
    }
}

function transfer_to_key(rows, transfer_key) {

    let data_obj = {}

    for(let row of rows) {
        let value_to_transfer = row[transfer_key];
        data_obj[value_to_transfer] = row;
    }

    return data_obj
}

// ------------------ SQL DB CALLER

function select_db(sql) {
    return new Promise(resolve => {
        db.all(sql, function(err, rows) {
            resolve(rows);
        })
    })
}

// ------------------ SQL SUGAR

async function db_get_all_by_prop(table, prop, value) {
    if (typeof value == 'string') {
        value = '"' + value + '"';
    }
    let sql = 'SELECT * FROM ' + table + ' WHERE ' + prop + ' = ' + value;
    return await select_db(sql);
}

async function db_get_all(table) {
    let sql = 'SELECT * FROM ' + table;
    return await select_db(sql);
}

// ------------------------------------------------------ CORE METHODS


// ------------------ PROP ACCUMULATION

function compute_data_accumulation(end_date, props, full_rows) {

    return full_rows.reduce((accu, day_data) => {

        let current_date = new Date(day_data.date)
        if(current_date <= end_date) {
            for(let prop of props) {
                accu += day_data[prop]
            }
            return accu
        }
        return accu

    }, 0)
}

// ------------------------------------------------------ RETRIEAVAL METHODS

// ------------------ CASE DATA BY GEOID

async function get_data_by_geoid(geoid) {

    let geodata = await db_get_all_by_prop('cases', 'Country', geoid);

    // -- compute accumulation
    geodata = geodata.map(day_data => {

        let day_date = new Date(day_data.date)

        day_data.cumul_cases = compute_data_accumulation(day_date, ['cases'], geodata)
        day_data.cumul_deaths = compute_data_accumulation(day_date, ['deaths'], geodata)
        day_data.total = day_data.cumul_cases + day_data.cumul_deaths
        
        return day_data

    })

    let final_data = transfer_to_key(geodata, 'date');
    let props_to_remove = ['date', 'country'];
    remove_props_inplace(final_data, props_to_remove);

    return final_data;
}

// ------------------ GET ALL COUNTRIES

async function get_all_countries() {

    let countries = await db_get_all('countries');
    let final_data = transfer_to_key(countries, 'geoid');
    let props_to_remove = ['geoid'];
    remove_props_inplace(final_data, props_to_remove);

    return final_data;
}

// ------------------------------------------------------ EXPORTS

exports.get_all_countries = get_all_countries
exports.get_data_by_geoid = get_data_by_geoid