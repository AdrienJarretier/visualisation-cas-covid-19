"use strict";

const fs = require('fs');
const superagent = require('superagent');

let rawdata = fs.readFileSync('config.json');
let config = JSON.parse(rawdata);

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

exports.sendMessage = sendMessage