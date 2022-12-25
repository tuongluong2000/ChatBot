
var controller = require('../controller/mobile-controller');



console.log("running api mobile");
controller.Trainbot();
var USERID = "";
var CONTEXT = "";

async function Conection(io) {
    io.sockets.on('connection', async (socket) => {
        console.log('User Conncetion');
        socket.on('user_login', async (phone, pass) => {
            console.log(phone + " login");
            var data = await controller.CheckLogin(phone, pass);
            if (data == false)
                io.emit('user_login_emit', { user_name: phone, status: "fales" });
            else {
                USERID = data._id.toString();
                socket.join(USERID);
                io.to(USERID).emit('user_login_emit', { user_name: data._id.toString(), status: "true" });
            }
        });
        socket.on('get_context', async (id) => {
            console.log("id user " + id);
            socket.join(USERID);
            var data = await controller.QueryContext(id);
            if (data == false)
                io.to(USERID).emit('data_context', { data: data, status: "false" });
            else
                io.to(USERID).emit('data_context', { data: data, status: "true" });
        });
        socket.on('get_message', async (id) => {
            console.log("id context " + id);
            socket.join(USERID);
            CONTEXT = id;
            socket.join(CONTEXT)
            var data = await controller.QueryMessage(id);
            if (data == false)
                io.to(CONTEXT).emit('data_message', { data: data, status: "false" });
            else {
                io.to(CONTEXT).emit('data_message', { data: data, status: "true" });
            }
        });
        socket.on('send_message', async (contextid, userid, content, timestamp, sta) => {
            console.log("message" + contextid + userid + content, timestamp);
            CONTEXT = contextid;
            socket.join(CONTEXT)
            socket.join(USERID);
            var status = await controller.InsertMessage(contextid, userid, content, timestamp, sta);
            var data = await controller.QueryMessage(contextid);
            if (status == true) {
                io.to(CONTEXT).emit('data_sendmessage', { data: data, status: "true" });
                if (sta != "Bot") {
                    await io.to(CONTEXT).emit('admin-user-new-message', { data: data, contextid: contextid,userid: userid })
                }
            }
            else
                io.to(USERID).emit('data_sendmessage', { data: data, status: "false" });
        });
        socket.on('signup_user', async (name, phone, mail, pass) => {
            console.log("user signup");
            var status = await controller.InsertUser(name, phone, mail, pass)
            socket.join(phone)
            if (status == true) {
                io.to(phone).emit('user_signup', { status: "true" });
            }
            else
                io.to(phone).emit('user_signup', { status: "false" });
        });
        socket.on('add_admin', async (userid) => {
            console.log("add context admin");
            socket.join(USERID);
            var status = await controller.InsertContext(userid, true);
            var data = await controller.QueryContext(userid);
            if (data == false)
                io.to(USERID).emit('data_context', { data: data, status: "false" });
            else {
                io.to(USERID).emit('data_context', { data: data, status: "true" });
                socket.join("6374fedad36a12dad2ba4b56")
                io.to("6374fedad36a12dad2ba4b56").emit('admin_user_new_context', { data: data, status: "true" });
                socket.leave("6374fedad36a12dad2ba4b56")
            }
        });
        socket.on('add_bot', async (userid) => {
            console.log("add context admin");
            socket.join(USERID);
            var status = await controller.InsertContext(userid, false);
            var data = await controller.QueryContext(userid);
            if (data == false)
                io.to(USERID).emit('data_context', { data: data, status: "false" });
            else
                io.to(USERID).emit('data_context', { data: data, status: "true" });
        });
        socket.on('delete_context', async (contextid, userid) => {
            console.log('delete ' + contextid);
            socket.join(USERID);
            var status = await controller.DeleteContext(contextid);
            var data = await controller.QueryContext(userid);
            if (data == false)
                io.to(USERID).emit('data_context', { data: data, status: "false" });
            else
            {
                io.to(USERID).emit('data_context', { data: data, status: "true" });
                socket.join("6374fedad36a12dad2ba4b56")
                io.to("6374fedad36a12dad2ba4b56").emit('admin_user_new_context', { data: data, status: "true" });
                socket.leave("6374fedad36a12dad2ba4b56")
            
            }
        });
        socket.on('user_profile', async (userid) => {
            console.log("query user " + userid);
            socket.join(USERID);
            var data = await controller.QueryUser(userid);
            io.to(USERID).emit('data_profile_user', { data: data });
        });
    });
}

module.exports = { Conection }