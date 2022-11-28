const { containerBootstrap } = require('@nlpjs/core');
const { NluManager, NluNeural } = require('@nlpjs/nlu');
const { LangEn } = require('@nlpjs/lang-en');
var connectiondb = require('../models/connection-db');

async function addDomain(manager, model){
    model.forEach(async function(value){
        value.data.forEach(async function(da){
            await manager.assignDomain('en',da.intent,value.domain),
            da.utterances.forEach(async function(utterance){
                await manager.add('en',utterance,da.intent)
            });
        })
    })
}

var manager;

async function TrainNLU() {
    const container = await containerBootstrap();
    container.use(LangEn);
    container.use(NluNeural);
    manager = new NluManager({
      container,
      locales: ['en'],
      trainByDomain: false,
    });
    var query= {};
    var model = await connectiondb.QueryUtterance(query,"utterance");
    addDomain(manager, model);
    await manager.train();
}

async function botAnswersNLU(mess){
    var actual = await manager.process('en', mess);
    var result = "";
    console.log(actual);
    var query= {domain: actual.domain};
    var model = await connectiondb.QueryUtterance(query,"utterance");
    await model.forEach(async function(value){
    await value.data.forEach(async function(da){
        if(da.intent == actual.intent)
          {
            var i = getRandomInt(da.answers.length);
            result = await da.answers[i];
            await console.log(result);
          }
        });
      })
    return result;
       
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

module.exports = {addDomain, TrainNLU, botAnswersNLU, getRandomInt}