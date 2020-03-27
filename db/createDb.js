"use strict";

const common = require("../common.js");

const config = common.serverConfig;

const sqlite3 = require('sqlite3').verbose();


let db = new sqlite3.Database(config.db.database);

db.on('trace', (sql) => { console.log(sql); });

Promise.all([createTables()]).then(() => {
    db.close();
    console.log('closing db');
});

function createTables() {

    db.serialize(function () {

        db.run(`CREATE TABLE IF NOT EXISTS "countries" (
            "geoid" CHARACTER(2) PRIMARY KEY,
            "name" TEXT
            );`);

        db.run(`CREATE TABLE IF NOT EXISTS "cases" (
                "country" CHARACTER(2),
                "date" DATE NOT NULL,
                "cases" INTEGER NOT NULL,
                "deaths" INTEGER NOT NULL,
                FOREIGN KEY(country) REFERENCES countries(geoid)
              );`);

    });

    return; // return Promise.resolve
}
