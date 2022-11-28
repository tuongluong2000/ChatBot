const { ObjectID } = require('bson');
const e = require('express');
var connectiondb = require('../models/connection-db');
var usermodel = require('../models/user-model');
var translate = require('translate');
var trainbotbasic = require('../trainbot/trainbasic');
var trainnlu = require('../trainbot/trainnlu')



async function CheckLogin(phone, pass) {
    var query = {phone: phone, pass: pass};
    const data = await connectiondb.Query(query,"user");
    return data;
}

async function QueryContext(userId){
    var query= {userId: new ObjectID(userId)};
    var data = await connectiondb.QueryContext(query,"context");
    return data;
}

async function QueryMessage(contextId){
    var query= {contextId: new ObjectID(contextId)};
    var data = await connectiondb.QueryMessage(query,"message");
    return data;
}

async function InsertMessage(contextId,senderMessageId,content,timestamp, sta){
    
    var query= [{contextId: new ObjectID(contextId),
            senderMessageId: new ObjectID(senderMessageId),
    content: content, timestamp: timestamp}];
    var data = await connectiondb.Insert(query,"message");
    
   if(sta =="Bot"){
        var answer = await botAnswers(content);
        if (answer == false)
        {
            var query1= [{contextId: new ObjectID(contextId),
                senderMessageId: "",
            content: "Xin lỗi, tôi không hiểu", timestamp: timestamp}];
            var data1 = await connectiondb.Insert(query1,"message");
        }
        else {
            var query1= [{contextId: new ObjectID(contextId),
                senderMessageId: "",
            content: answer, timestamp: timestamp}];
            var data1 = await connectiondb.Insert(query1,"message");
        }
    }
    return data;
}

async function Translate(message){
    translate.engine = "google";
    translate.key = process.env.GOOGLE_KEY;
    translate.from ="vi";
    const text = await translate(message, "en");
    await console.log(text);
    return text;
}

async function TranslateEntoVi(message){
    translate.engine = "google";
    translate.key = process.env.GOOGLE_KEY;
    translate.from ="en";
    const text = await translate(message, "vi");
    await console.log(text);
    return text;
}

async function Trainbot(){
    await trainbotbasic.TrainBotBasic();
    await trainnlu.TrainNLU();
}

async function botAnswers(message) {
    var mess = await Translate(message)
    var answer = await trainnlu.botAnswersNLU(mess);
    if (answer == undefined) return false;
    else return answer;
}


module.exports = {CheckLogin, QueryContext, QueryMessage, 
    InsertMessage, Translate, Trainbot, botAnswers, TranslateEntoVi}