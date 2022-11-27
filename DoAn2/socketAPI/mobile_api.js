
var controller = require('../controller/mobile-controller');
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var fs = require("fs")
server.listen(process.env.POST ||3000);


console.log("running api mobile");
controller.Trainbot();

function Conection() {
io.sockets.on('connection', (socket) => {
    console.log('User Conncetion');
    socket.on('user_login', async (phone,pass) => {
        console.log(phone + " login");
        var data = await controller.CheckLogin(phone,pass);
        if(data ==false)
            io.emit('user_login_emit', {user_name: phone, status: "fales"});
        else   
            io.emit('user_login_emit', {user_name: data._id , status: "true"});
        });
    socket.on('get_context', async (id)=>{
        console.log("id user "+ id);
        var data = await controller.QueryContext(id);
        if(data == false)
            io.emit('data_context',{data: data, status: "false"});
        else 
            io.emit('data_context',{data: data, status: "true"});
        }); 
    socket.on('get_message', async (id)=>{
        console.log("id context "+ id);
        var data = await controller.QueryMessage(id);
        if(data == false)
            io.emit('data_message',{data: data, status: "false"});
        else 
            io.emit('data_message',{data: data, status: "true"});
        });
        socket.on('send_message', async (contextid,userid,content,timestamp,sta)=>{
            console.log("message" +contextid+userid+content,timestamp);
            var status = await controller.InsertMessage(contextid,userid,content,timestamp,sta);
            var data  = await controller.QueryMessage(contextid);
            if (status== true)
                io.emit('data_sendmessage',{data: data, status: "true"});
            else 
                io.emit('data_sendmessage',{data: data, status: "false"});
        });
    });
}

module.exports = { Conection }