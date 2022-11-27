const { dockStart } = require('@nlpjs/basic');

var dock;
var nlp

async function TrainBotBasic(){
    dock = await dockStart();
    nlp = dock.get('nlp');
    await nlp.train();
    console.log("train bot finish")
    return true;
}

async function botAnswers(mess){
    var response = await nlp.process('en', mess);
    console.log(response);
    return response.answer;
}

module.exports = {botAnswers, TrainBotBasic}