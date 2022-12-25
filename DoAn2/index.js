var mobile = require('./socketAPI/mobile_api')
var web = require('./socketAPI/web_api')

var express = require('express');
var app = express();
var server = require('http').createServer(app);

var io = require('socket.io')(server, {
    cors: {
        origin: "*",
    }
});
var fs = require("fs")
server.listen(process.env.POST || 3000);

mobile.Conection(io);
web.Conection(io);

