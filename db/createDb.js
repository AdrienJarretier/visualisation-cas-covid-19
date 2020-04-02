"use strict";

const common = require("../common.js");

const config = common.serverConfig;

const Database = require('better-sqlite3');

const db = new Database(config.db.database, { verbose: console.log });


Promise.all([createTables()]).then(() => {
    db.close();

    console.log('db closed');
    console.log('db ' + config.db.database + ' created');

});

function createTables() {

    db.exec(`CREATE TABLE IF NOT EXISTS "countries" (
        "geoid" CHARACTER(2) PRIMARY KEY,
        "name" TEXT
        );`);

    db.exec(`CREATE TABLE IF NOT EXISTS "cases" (
            "country" CHARACTER(2),
            "date" DATE NOT NULL,
            "cases" INTEGER NOT NULL,
            "deaths" INTEGER NOT NULL,
            FOREIGN KEY(country) REFERENCES countries(geoid),
            UNIQUE (country, date)
          );`);

    return; // return Promise.resolve
}
