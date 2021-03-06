
// ------------------------------------------------------ REQUIRE

var express = require('express');
var router = express.Router();
var dataManager = require('../db/dataManager');
const common = require('../common.js');

// ------------------------------------------------------ CONFIG

const api_config = common.serverConfig.api;
const api_methods = api_config.methods;

// ------------------------------------------------------ CORE

// ------------------ METHODS DESC

function get_all_methods_description() {
    let methods_descriptor = {}
    for(let method_name in api_methods) {
        let full_method_config = api_methods[method_name]
        let args_config = full_method_config.args
        let args = Object.keys(args_config).filter(arg_name => args_config[arg_name].includes('@'))
        methods_descriptor[method_name] = args
    }
    return methods_descriptor
}

// ------------------------------------------------------ ROUTING

// ------------------ MAIN ENTRY POINT (methods descs)

router.get('/', function(req, res, next) {
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
    let url_template = method_name + '/' + url_args.map(arg_name => ':'+arg_name).join('/')
    let dataManager_method = full_method_config.method

    // -- routing
    router.get(url_template, async function(req, res, next) {

        // -- retrieving args value
        let calling_args = []
        for(let arg_name of url_args) {
            let arg_value = req.params[arg_name]
            calling_args.push(arg_value)
        }

        // -- execute api method
        let data = await dataManager[dataManager_method](...calling_args)
        res.json(data)
    });

}

// ------------------------------------------------------ EXPORTS

module.exports = router