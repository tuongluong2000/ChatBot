const { ObjectID } = require('bson');
const e = require('express');
var connectiondb = require('../models/connection-db');
var usermodel = require('../models/user-model');
var fs = require('fs');

async function CheckLogin(phone, pass) {
    var query = {phone: phone, pass: pass};
    const data = await connectiondb.QueryUser(query,"user");
    return data;
}

async function QueryContext(adminId){
    var query= {adminId: new ObjectID(adminId)};
    var data = await connectiondb.QueryContext(query,"context");
    for (let i = 0; i < data.length; i++)
    {   
        var query1= {_id: new ObjectID(data[i].userid)};
        var query2= {contextId: new ObjectID(data[i]._id), senderMessageId: new ObjectID(data[i].userid)};
        var user = await connectiondb.QueryUser(query1, 'user');
        var mess = await connectiondb.QueryMessage(query2,'message')
        if(user !=false)
            data[i].username = user.name;
            data[i].email = user.mail;
            data[i].mobile = user.phone;
        if(mess != false){
            data[i].content = mess[mess.length-1].content;
            data[i].timestamp = mess[mess.length-1].timestamp;
        }
    }
    return data;
}


async function QueryUser(userid) {
    var query = {_id: new ObjectID(userid)};
    const data = await connectiondb.QueryUser(query,"user");
    return data;
}

async function QueryAllUser(){
    var query = {decentralize: "user"}
    const data = await connectiondb.QueryManyUser(query,"user");
    return data;
}

async function QueryMessage(contextId){
    var query= {contextId: new ObjectID(contextId)};
    var data = await connectiondb.QueryMessage(query,"message");
    return data;
}
async function InsertMessage(contextId,senderMessageId,content,timestamp){
    
    var query= [{contextId: new ObjectID(contextId),
            senderMessageId: new ObjectID(senderMessageId),
    content: content, timestamp: timestamp}];
    var data = await connectiondb.Insert(query,"message");
    
    return data;
}

module.exports = {CheckLogin, QueryContext, QueryUser, QueryMessage, InsertMessage, QueryAllUser}