// ------------------------------------------ IMPORT

const fs = require('fs');
const common = require('./common');

// ------------------------------------------ ARGS

var argv = process.argv
argv.splice(0,2)

console.log(argv)

let force_reset = argv[0] == '--reset'

// ------------------------------------------ RESET ?

function delete_if_exists(path) {
    if (fs.existsSync(path)) {
        fs.unlinkSync(path)
        console.log('deleted ' + path)
    } else {
        console.log('file ' + path + ' unexistant')
    }
}

if (force_reset) {
    console.log('RESETING ...')

    delete_if_exists(common.serverConfig.db.database)
    delete_if_exists(common.serverConfig['telegram-notifications-bot-controler'].db.database)
    delete_if_exists('localConfig.json')

    console.log('SERVER DATA RESET')
}

// ------------------------------------------ INIT

else {
    require('./db/createDb.js')
    require('./telegram-notifications-bot-controler/createDb.js')
}
