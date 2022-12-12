const { ObjectID } = require('bson');
const e = require('express');
var connectiondb = require('../models/connection-db');
var usermodel = require('../models/user-model');
var fs = require('fs');

async function CheckLogin(phone, pass) {
    var query = {phone: phone, pass: pass};
    const data = await connectiondb.Query(query,"user");
    return data;
}

async function QueryContext(adminId){
    var query= {adminId: new ObjectID(adminId)};
    var data = await connectiondb.QueryContext(query,"context");
    return data;
}

module.exports = {CheckLogin, QueryContext}