const { ObjectID } = require('bson');
const e = require('express');
var connectiondb = require('../models/connection-db');
var usermodel = require('../models/user-model');

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

module.exports = {CheckLogin, QueryContext}