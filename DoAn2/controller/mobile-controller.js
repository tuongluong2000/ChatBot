const { ObjectID } = require('bson');
const e = require('express');
var connectiondb = require('../models/connection-db');
var usermodel = require('../models/user-model');
var translate = require('translate');
var trainbotbasic = require('../trainbot/trainbasic');
var trainnlu = require('../trainbot/trainnlu');
var fs = require('fs');



async function CheckLogin(phone, pass) {
    var query = { phone: phone, pass: pass };
    const data = await connectiondb.QueryUser(query, "user");
    return data;
}

async function QueryUser(userid) {
    var query = { _id: new ObjectID(userid) };
    const data = await connectiondb.QueryUser(query, "user");
    return data;
}

async function QueryContext(userId) {
    var query = { userId: new ObjectID(userId) };
    var data = await connectiondb.QueryContext(query, "context");
    return data;
}

async function QueryMessage(contextId) {
    var query = { contextId: new ObjectID(contextId) };
    var data = await connectiondb.QueryMessage(query, "message");
    return data;
}

async function InsertMessage(contextId, senderMessageId, content, timestamp, sta) {

    var query = [{
        contextId: new ObjectID(contextId),
        senderMessageId: new ObjectID(senderMessageId),
        content: content, timestamp: timestamp
    }];
    var data = await connectiondb.Insert(query, "message");

    if (sta == "Bot") {
        var answer = await botAnswers(content);
        if (answer == false) {
            var query1 = [{
                contextId: new ObjectID(contextId),
                senderMessageId: "",
                content: "Xin lỗi, tôi không hiểu", timestamp: timestamp
            }];
            var data1 = await connectiondb.Insert(query1, "message");
        }
        else {
            var query1 = [{
                contextId: new ObjectID(contextId),
                senderMessageId: "",
                content: answer, timestamp: timestamp
            }];
            var data1 = await connectiondb.Insert(query1, "message");
        }
    }
    return data;
}

async function InsertUser(name, phone, mail, pass) {
    let ts = Date.now().toString();

    var query = [{
        name: name,
        phone: phone,
        Mail: mail, pass: pass, createday: ts, decentralize: "user"
    }];
    var data = await connectiondb.Insert(query, "user");

    return data;
}

async function InsertContext(userid, status) {
    if (status == true) {
        var query = [{
            userId: new ObjectID(userid),
            adminId: new ObjectID("6374fedad36a12dad2ba4b56"),
            suggestedMessage: []
        }];
        var data = await connectiondb.Insert(query, "context");
    } else {
        var query = [{
            userId: new ObjectID(userid),
            adminId: "",
            suggestedMessage: []
        }];
        var data = await connectiondb.Insert(query, "context");
    }

    return data;
}

async function DeleteContext(contextid) {
    var query = { _id: new ObjectID(contextid) };
    var data = await connectiondb.Delete(query, "context");
    var queryMess = { contextId: new ObjectID(contextid) };
    var mes = await connectiondb.deleteMany(queryMess, 'message');
    return data;
}

async function UpdateUser(userid, name, email, mobile) {
    var query = { _id: new ObjectID(userid) };
    if (name != "") {
        var newvalues = { name: name };
        var data = await connectiondb.Update(query, newvalues, "user");
        return data;
    } else if (email != "") {
        var newvalues = { Mail: email };
        var data = await connectiondb.Update(query, newvalues, "user");
        return data;
    } else if (mobile != "") {
        var newvalues = { phone: mobile };
        var data = await connectiondb.Update(query, newvalues, "user");
        return data;
    }
}

async function Translate(message) {
    translate.engine = "google";
    translate.key = process.env.GOOGLE_KEY;
    translate.from = "vi";
    const text = await translate(message, "en");
    await console.log(text);
    return text;
}

async function TranslateEntoVi(message) {
    translate.engine = "google";
    translate.key = process.env.GOOGLE_KEY;
    translate.from = "en";
    const text = await translate(message, "vi");
    await console.log(text);
    return text;
}

async function Trainbot() {
    await trainbotbasic.TrainBotBasic();
    await trainnlu.TrainNLU();
    console.log("train bot complete");
    let ts = Date.now();
    let a = ts.toString();
    a = Number(a);

    let date_ob = new Date(a); 
    let date = date_ob.getDate();
    let month = date_ob.getMonth() + 1;
    let year = date_ob.getFullYear();
    console.log(year + "-" + month + "-" + date);
}



async function botAnswers(message) {
    var mess = await Translate(message)
    var answer = await trainnlu.botAnswersNLU(mess);
    if (answer == undefined) return false;
    else return answer;
}


module.exports = {
    CheckLogin, QueryContext, QueryMessage,
    InsertMessage, Translate, Trainbot, botAnswers, TranslateEntoVi,
    InsertUser, InsertContext, DeleteContext, QueryUser, UpdateUser
}