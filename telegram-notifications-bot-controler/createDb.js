"use strict";

const Database = require('better-sqlite3');
const common = require('../common.js');

const config = common.serverConfig['telegram-notifications-bot-controler'];


const db = new Database(config.db.database, { verbose: console.log });

db.exec(`CREATE TABLE IF NOT EXISTS "clients" (
    "chat_id" varchar(255) PRIMARY KEY
    );`);

db.close();
