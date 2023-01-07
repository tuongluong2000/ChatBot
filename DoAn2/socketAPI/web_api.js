
var controller = require('../controller/web-controller');


console.log("running api web");

async function Conection(io) {
    io.sockets.on('connection', (socket) => {
        console.log('Useradmin Conncetion');
        socket.join("6374fedad36a12dad2ba4b56")
        socket.on('adminLogin', async (phone, pass) => {
            console.log(phone + " login");
            var data = await controller.CheckLogin(phone, pass);
            if (data == false)
            io.to("6374fedad36a12dad2ba4b56").emit('admin_login_emit', { user_name: phone, status: "fales" });
            else
            io.to("6374fedad36a12dad2ba4b56").emit('admin_login_emit', { user_name: data._id.toString(), status: "true" });
        });
        socket.on('admin-get-context', async (id) => {
            console.log("id admin " + id);
            var data = await controller.QueryContext(id);
            if (data == false){
                io.to("6374fedad36a12dad2ba4b56").emit('admin_data_context', { data: data, status: "false" });
                console.log("false");}
            else{
                for(let i = 0; i<data.length;i++)
                {
                    socket.join(data[i]._id.toString());
                }
                var users = await controller.QueryAllUser();
                io.to("6374fedad36a12dad2ba4b56").emit('admin_data_user', {data: users})
                io.to("6374fedad36a12dad2ba4b56").emit('admin_data_context', { data: data, status: "true"});
            }
        });
        socket.on('admin-get-message', async (id) => {
            console.log("id context " + id);
            var data = await controller.QueryMessage(id);
            if (data == false){
                io.to("6374fedad36a12dad2ba4b56").emit('admin_data_message', { data: data, status: "false" });
                console.log("false");}
            else{
                console.log(data);
                io.to("6374fedad36a12dad2ba4b56").emit('admin_data_message', { data: data, status: "true" });
            }
        });
        socket.on('admin-sent-message', async (contextid,adminid,content,timestamp) => {
            console.log("id context " + contextid);
            var data = await controller.InsertMessage(contextid,adminid,content,timestamp);
            socket.join(contextid)
            if (data == false){
                console.log("false");}
            else{
                console.log("true");
                var datamess = await controller.QueryMessage(contextid);
                io.to("6374fedad36a12dad2ba4b56").emit('admin_data_message', { data: datamess, status: "true"});
                io.to(contextid).emit('user_admin_sent_data_message', { data: datamess, status: "true",contextid: contextid});
            }
        });
        socket.on('admin-get-message-new', async (id) => {
            console.log("id context  message" + id);
            var data = await controller.QueryMessage(id);
            if (data == false){
                io.to("6374fedad36a12dad2ba4b56").emit('admin_data_message_new', { data: data, status: "false" });
                console.log("false");}
            else{
                console.log(data);
                io.to("6374fedad36a12dad2ba4b56").emit('admin_data_message_new', { data: data, status: "true" });
            }
        });
        socket.on('admin_add_user',async (name,mail,phone,pass)=>{
            console.log('admin add user');
            var data = await controller.InsertUser(name,phone,mail,pass);
            if (data ==false){
                console.log('insert user false')
            } else {
                var users = await controller.QueryAllUser();
                io.to("6374fedad36a12dad2ba4b56").emit('admin_data_user', {data: users});
            }
        });
        socket.on('admin_update_user',async (userid, name,mail,phone)=>{
            console.log('admin update user');
            var data = await controller.UpdateUser(userid,name,mail,phone);
            if (data ==false){
                console.log('update user false')
            } else {
                var users = await controller.QueryAllUser();
                io.to("6374fedad36a12dad2ba4b56").emit('admin_data_user', {data: users});
            }
        });
        socket.on('admin_delete_user',async (userid)=>{
            console.log('admin update user');
            var data = await controller.DeleteUser(userid);
            if (data ==false){
                console.log('delete user false')
            } else {
                var users = await controller.QueryAllUser();
                io.to("6374fedad36a12dad2ba4b56").emit('admin_data_user', {data: users});
            }
        });
    });
}

module.exports = { Conection }