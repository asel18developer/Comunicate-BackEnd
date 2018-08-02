/*****************************************************************************/
/*                            Import node modules                            */
/*****************************************************************************/
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var resourses = express.Router();

/*****************************************************************************/
/*                            Import our controllers                         */
/*****************************************************************************/
var db = require('./controllers/connectorDB');
var Token = require('./controllers/tokenController');
var Socket = require('./controllers/SocketController');
var Loggin = require('./controllers/usersController');
var Chats = require('./controllers/chatsController');
var smtp = require('./controllers/smtpServer');
var Notes = require('./controllers/notesController');

/* Ruta del servidor web.*/
app.use(express.static('../Comunicate-Int/'));

/* Inicio de la conexion con la base de datos*/
db.connectDB();

io.on('connection',function(socket){

    //Aqui se llega siempre que un cliente se conecte por socket (sea la ruta que sea va entrar aqui tambien)
    console.log('One user connected '+socket.id);
    socket.on('disconnect', disconnected);

    /* USUARIO NORMAL: Conectamos el socket con sus señales */
    socket.on('check_user', Loggin.checkUser);
    socket.on('add_user', Loggin.addUser);
    socket.on('get_user_last_messages', Chats.getUserLastMessages);
    socket.on('get_chat', Chats.getChat);
    socket.on('delete_chat', Chats.deleteChat);
    socket.on('send_message', Chats.sendMessage);
    socket.on('get_experts', Loggin.getExperts);
    socket.on('create_chat', Chats.createChat);
    socket.on('add_pass_trap', Loggin.addPassTrap);
    socket.on('modify_user', Loggin.modifyUser);
    socket.on('get_rating', Chats.getRating);
    socket.on('set_rating', Chats.setRating);
    socket.on('recovery_pass', smtp.sendEmail);
    socket.on('get_notes', Notes.getNotes);
    socket.on('send_note', Notes.sendNote);


    //Emparejar un socket con un usuario
    socket.on('pairing', Socket.pairing);

});


setInterval(function(){

  Token.checkExpiration();

}, 5000);



// io.of('/loggin').on('connection',function(socket){
//     //Aqui se llega solo si un cliente se conecta a la ruta ip:puerto/loggin
//     // socket.on('check_user', Loggin.checkUser);
//     // socket.on('add_user', Loggin.addUser);
//     // socket.on('close_session', closeSession);
//
// });
var disconnected = function(){
  Socket.disconnectSocket(this.id);
};

http.listen(80,function(){
    console.log('Server listening on port 80.');
});
