const { Schema } = require('mongoose');
const { collection } = require('./user-model');
var usermodel = require('./user-model');
var contextmodel = require('./context-model');
var messagemodel = require('./message_model');
var utterancemodel = require('./utterance_model')
const { Context } = require('@nlpjs/basic');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";


async function Insert(data, collection) {
  const client = new MongoClient(url);

  try {
    const database = client.db("DoAn");
    const collect = database.collection(collection);

    // this option prevents additional documents from being inserted if one fails
    const options = { ordered: true };
    const result = await collect.insertMany(data, options);
    if (await result.insertedCount ===0) {
      console.log("No documents found!");
      return false;
    }
    console.log(`${result.insertedCount} documents were inserted`);
    return true;
  } finally {
    await client.close();
  }

}

async function Query(query, collection) {
  const client = new MongoClient(url);
  var user;
  try {
    const database = client.db("DoAn");
    const collect = database.collection(collection);
    // query for movies that have a runtime less than 15 minutes
  
    const data = collect.find(query);
    // print a message if no documents were found
    if ((await data.count()) === 0) {
      console.log("No documents found!");
      return false;
    }
    // replace console.dir with your callback to access individual elements
    await data.forEach(async function(value){
      user = new usermodel({
        _id: value._id,
        name: value.name,
        pass: value.pass,
        phone: value.phone,
        mail: value.Mail
      });
    });
    return user;
  } finally {
    await client.close();
  }

}

async function Update(query, data, collection) {

  const client = new MongoClient(url);

  try {
    const database = client.db("DoAn");
    const collect = database.collection(collection);

    const updateDoc = {
      $set: data
    };

    const result = await collect.updateMany(query, updateDoc);
    console.log(`Updated ${result.modifiedCount} documents`);
  } finally {
    await client.close();
  }

}

async function Delete(query, collection) {
  const client = new MongoClient(url);

  try {
    const database = client.db("DoAn");
    const collect = database.collection(collection);

    const result = await collect.deleteOne(query);
    if (result.deletedCount === 1) {
      console.log("Successfully deleted one document.");
    } else {
      console.log("No documents matched the query. Deleted 0 documents.");
    }
  } finally {
    await client.close();
  }
}

async function QueryContext(query, collection) {
  const client = new MongoClient(url);
  var model = [];
  var i = 0;
  try {
    const database = client.db("DoAn");
    const collect = database.collection(collection);
    // query for movies that have a runtime less than 15 minutes
  
    const data = collect.find(query);
    // print a message if no documents were found
    if ((await data.count()) === 0) {
      console.log("No documents found!");
      return false;
    }
    // replace console.dir with your callback to access individual elements
    await data.forEach(async function(value){
       model[i] = new contextmodel({
        _id: value._id,
        userid: value.userId,
        adminid: value.adminId,
        suggested: value.suggestedMessage
      });
      i++;
    });
    return model;
  } finally {
    await client.close();
  }

}

async function QueryMessage(query, collection) {
  const client = new MongoClient(url);
  var model = [];
  var i = 0;
  try {
    const database = client.db("DoAn");
    const collect = database.collection(collection);
    // query for movies that have a runtime less than 15 minutes
  
    const data = collect.find(query);
    // print a message if no documents were found
    if ((await data.count()) === 0) {
      console.log("No documents found!");
      return false;
    }
    // replace console.dir with your callback to access individual elements
    await data.forEach(async function(value){
       model[i] = new messagemodel({
        _id: value._id,
        contextid: value.contextId,
        senderid: value.senderMessageId,
        content: value.content,
        timestamp: value.timestamp
      });
      i++;
    });
    return model;
  } finally {
    await client.close();
  }

}

async function QueryUtterance(query, collection) {
  const client = new MongoClient(url);
  var model = [];
  var i = 0;
  try {
    const database = client.db("DoAn");
    const collect = database.collection(collection);
    // query for movies that have a runtime less than 15 minutes
  
    const data = collect.find(query);
    // print a message if no documents were found
    if ((await data.count()) === 0) {
      console.log("No documents found!");
      return false;
    }
    // replace console.dir with your callback to access individual elements
    await data.forEach(async function(value){
       model[i] = new utterancemodel({
        _id: value._id,
        domain: value.domain,
        data: value.data
      });
      i++;
    });
    return model;
  } finally {
    await client.close();
  }

}

module.exports = { Insert, Query, Update, Delete, QueryContext, QueryMessage, QueryUtterance }