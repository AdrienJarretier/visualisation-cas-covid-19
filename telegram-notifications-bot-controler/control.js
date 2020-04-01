"use strict";

const fs = require('fs');
const superagent = require('superagent');

const common = require('../common.js');

const config = common.serverConfig['telegram-notifications-bot-controler'];

const BOT_TOKEN = config.bot_token;

const BASE_API_ULR = config.telegram_api_url;

const METHODS = {

  getMe: {
    method: "getMe",
    fixedParameters: {}
  },
  getUpdates: {
    method: "getUpdates",
    fixedParameters: {}
  },
  sendMessage: {
    method: "sendMessage",
    fixedParameters: {
      chat_id: config.chat_id
    }
  }

}

function makeApiCallUrl(method) {

  let url = BASE_API_ULR + BOT_TOKEN + '/' + method;

  return url;

}

async function simpleRequest(method, parameters) {

  let url = makeApiCallUrl(method.method);


  try {

    const res = await superagent.get(url)
      .query(Object.assign(parameters, method.fixedParameters));

  } catch (err) {

    console.error("error when sending " + method.method);
    console.error(err);

  }


}

function sendMessage(text) {

  simpleRequest(METHODS.sendMessage, { text: text })

}

let last_update_id = 0;

async function getUpdate(timeout) {

  try {

    let url = makeApiCallUrl('getUpdates');
    console.log(url);
    let data = await superagent.get(url)
      .query(
        {
          offset: (last_update_id + 1),
          timeout: timeout
        }
      );

    return data.body.result;

  }
  catch (e) {

    console.log(e);

  }

}


async function pollUpdates(interval) {

  console.log((new Date()).toLocaleString());
  console.log("polling update");

  let results = await getUpdate(interval);

  for (let result of results) {

    console.log(result);

    last_update_id = result.update_id;

    console.log(result.message);

  }

  pollUpdates(interval);

}

pollUpdates(3600);

exports.sendMessage = sendMessage