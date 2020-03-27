
// ------------------------------------------------------ REQUIRE

var express = require('express');
var router = express.Router();
var dataManager = require('../db/dataManager');
const common = require('../common.js');

// ------------------------------------------------------ CONFIG

const api_config = common.serverConfig.api;
const api_entry_point = api_config.entry_point;
const api_methods = api_config.methods;

// ------------------------------------------------------ CORE

// ------------------ METHODS DESC

function get_all_methods_description() {
    return api_methods
}

// ------------------------------------------------------ ROUTING

// ------------------ MAIN ENTRY POINT (methods descs)

router.get(api_entry_point, function(req, res, next) {
    res.json(get_all_methods_description())
});

// ------------------ SUB ROUTES

for (let method_name in api_methods) {

    let full_method_config = api_methods[method_name]
    
    // -- creating the url template
    let args = full_method_config.args
    let url_args = []

    for (let arg_name in args) {
        let arg_data = args[arg_name]

        if (arg_data == '@url') {
            url_args.push(arg_name)
        }
    }

    // -- final route data
    let full_url = api_entry_point + method_name + '/' + url_args.map(arg_name => ':'+arg_name).join('/')
    let dataManager_method = full_method_config.method

    // -- routing
    router.get(full_url, async function(req, res, next) {

        // -- retrieving args value
        let calling_args = []
        for(let arg_name in url_args) {
            let arg_value = url_args[arg_name]
            calling_args.push(arg_value)
        }

        // -- execute api method
        let data = await dataManager[dataManager_method](...calling_args)
        res.json(data)
    });

}

// ------------------------------------------------------ EXPORTS

module.exports = router