const superagent = require('superagent');

const common = require('../common.js');

async function downloadData() {

    // let uri = common.serverConfig.dataUri;
    let uri = 'public/testjson.json';

    try {

        const res = await superagent.get(url)
            .query(Object.assign(parameters, method.fixedParameters));

    } catch (err) {

        console.error("error when getting " + method.method);
        console.error(err);

    }


}

downloadData();