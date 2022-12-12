
var controller = require('../controller/web-controller');
var express = require('express');
var app = express();
var server = require('http').createServer(app);

var io = require('socket.io')(server, {
    cors: {
        origin: "*",
    }
});
var fs = require("fs")
server.listen(process.env.POST || 3001);


console.log("running api web");

async function Conection() {
    io.sockets.on('connection', (socket) => {
        console.log('Useradmin Conncetion');
        socket.on('adminLogin', async (phone, pass) => {
            console.log(phone + " login");
            var data = await controller.CheckLogin(phone, pass);
            if (data == false)
                io.emit('admin_login_emit', { user_name: phone, status: "fales" });
            else
                io.emit('admin_login_emit', { user_name: data._id, status: "true" });
        });
        socket.on('admin-get-context', async (id) => {
            console.log("id admin " + id);
            var data = await controller.QueryContext(id);
            if (data == false)
                io.emit('admin_data_context', { data: data, status: "false" });
            else
                io.emit('admin_data_context', { data: data, status: "true" });
        });
    });
}

module.exports = { Conection }