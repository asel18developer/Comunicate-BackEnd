var db = require('./connectorDB');
var Token = require('./tokenController');
var Socket = require('./SocketController');


exports.getUserLastMessages = function (data){

  //console.log("Es un usuario normal con UserID: " + data.userID);
  //console.log("Token: " + data.accessToken);

  var socket = this;

  obtainLastChats(data, function(err, response, code){


   if (response.data.listMessages) {

      for (var i = 0; i < response.data.listMessages.length; i++) {

        var socketReceiver = Socket.getSocketID(response.data.listMessages[i].chatUserID);

        if (socketReceiver) {
          response.data.listMessages[i].inLine = true;
        }else{
          response.data.listMessages[i].inLine = false;
        }

      }

    }else{
      response.status.message = 'ChatList empty'
    }

    socket.emit("obtain_messages", response);


  });
};

exports.createChat = function (data){


  var socket = this;

  saveChat(data, function(err, response, code){

    console.log(response);
    socket.emit("send_chat_created", response);

  });
};

exports.getChat = function (data){

  //console.log("ChatID: " + data.chatID);
  var socket = this;
  console.log(data);
  obtainChat(data, function(err, response, code){

    var socketReceiver = Socket.getSocketID(response.data.userChatID);

     if (socketReceiver) {
         response.data.inLine = true;
     }else{
        response.data.inLine = false;
     }

     if (!response.data.listMessages) {

       response.status.message = "Chat empty"
     }
     console.log(response);

    socket.emit("obtain_chat", response);


  });
};

exports.deleteChat = function (data){

  //console.log("ChatID: " + data.chatID);
  var socket = this;

  removeChat(data, function(err, response, code){

    socket.emit("deleted_chat", response);
    console.log(response);

  });
};

exports.getRating = function (data){

  //console.log("ChatID: " + data.chatID);
  var socket = this;

  getRating(data, function(err, response, code){


    socket.emit("obtain_rating", response);

  });
};

getRating = function (credentials, callback){

  var inputJSON =
    {'apiVersion':'1.0',
    'params':{
      'userID':credentials.userID
    },
    'status':{
      'code':100
    }
  };

  var stringOfJson=JSON.stringify(inputJSON);

  db.callProcedure('averageRating',stringOfJson,function(err,recordsets,ReturnJSON) {

    if (err) {

      callback(err, null, 400);

    }else{


      var returnJsonAsJson = JSON.parse(ReturnJSON);

      callback(null, returnJsonAsJson, recordsets.returnValue);

    }

  });

};

removeChat = function (credentials, callback){

  var inputJSON =
    {'apiVersion':'1.0',
    'params':{
      'chatID':credentials.chatID
    },
    'status':{
      'code':100
    }
  };

  var stringOfJson=JSON.stringify(inputJSON);

  db.callProcedure('deleteChat',stringOfJson,function(err,recordsets,ReturnJSON) {

    if (err) {

      callback(err, null, 400);

    }else{


      var returnJsonAsJson = JSON.parse(ReturnJSON);

      callback(null, returnJsonAsJson, recordsets.returnValue);

    }

  });

};
exports.setRating = function (rating){

var socket = this;

  var inputJSON =
    {'apiVersion':'1.0',
    'params':{
      'userID':rating.userID,
      'value':rating.value
    },
    'status':{
      'code':100
    }
  };

  var stringOfJson=JSON.stringify(inputJSON);
  db.callProcedure('createRating',stringOfJson,function(err,recordsets,ReturnJSON) {

    if (err) {

      console.log(err);

    }

    socket.emit("rating_saved", stringOfJson);

  });

};

exports.sendMessage = function (data){

  var socket = this;
  var socketReceiver = Socket.getSocketID(data.chatUserID);
  console.log(new Date());
  data.sendTimestamp = new Date().toJSON().substring(0,16).replace('T',' ');

  console.log("Enviando mensaje: "+JSON.stringify(data));
  console.log("Socket del que envia: "+this.id);
  console.log("Socket del que recibe: "+ socketReceiver);

  delete data.accessToken;

  //console.log(socket.sockets[socketID]);

  saveMessage(data, function(err, response, code){

    if(socket.to(socketReceiver)) {
      socket.to(socketReceiver).emit('receive_message', data);
    }else{
      console.log("PEUWBA");
    }


  });
};

obtainLastChats = function (credentials, callback){

  //console.log("Obteniendo los ultimos mensajes de un usuario normal "+JSON.stringify(credentials));
  var inputJSON =
    {'apiVersion':'1.0',
    'params':{
      'accessToken':credentials.accessToken,
      'userID':credentials.userID,
      'isExpert':credentials.isExpert
    },
    'status':{
      'code':100
    }
  };

  var stringOfJson=JSON.stringify(inputJSON);

  db.callProcedure('getUserLastMessages',stringOfJson,function(err,recordsets,ReturnJSON) {

    if (err) {

      callback(err, null, 400);

    }else{


      var returnJsonAsJson = JSON.parse(ReturnJSON);

      callback(null, returnJsonAsJson, recordsets.returnValue);

    }

  });

};

saveChat = function (credentials, callback){

  //console.log("Obteniendo los ultimos mensajes de un usuario normal "+JSON.stringify(credentials));
  var inputJSON =
    {'apiVersion':'1.0',
    'params':{
      'expertID':credentials.expertID,
      'userID':credentials.userID,
      'username':credentials.username,
      'expertName':credentials.expertName
    },
    'status':{
      'code':100
    }
  };

  var stringOfJson=JSON.stringify(inputJSON);
  db.callProcedure('createChat',stringOfJson,function(err,recordsets,ReturnJSON) {

    if (err) {

      callback(err, null, 400);

    }else{

      var returnJsonAsJson = JSON.parse(ReturnJSON);

      callback(null, returnJsonAsJson, recordsets.returnValue);

    }

  });

};

obtainLastChats = function (credentials, callback){

  //console.log("Obteniendo los ultimos mensajes de un usuario normal "+JSON.stringify(credentials));
  var inputJSON =
    {'apiVersion':'1.0',
    'params':{
      'expertID':credentials.accessToken,
      'userID':credentials.userID,
      'username':credentials.username,
      'expertName':credentials.expertName
    },
    'status':{
      'code':100
    }
  };

  var stringOfJson=JSON.stringify(inputJSON);

  db.callProcedure('createChat',stringOfJson,function(err,recordsets,ReturnJSON) {

    if (err) {

      callback(err, null, 400);

    }else{


      var returnJsonAsJson = JSON.parse(ReturnJSON);

      callback(null, returnJsonAsJson, recordsets.returnValue);

    }

  });

};


obtainLastChats = function (credentials, callback){

  //console.log("Obteniendo los ultimos mensajes "+JSON.stringify(credentials));
  var inputJSON =
    {'apiVersion':'1.0',
    'params':{
      'accessToken':credentials.accessToken,
      'userID':credentials.userID,
      'isExpert':credentials.isExpert
    },
    'status':{
      'code':100
    }
  };

  var stringOfJson=JSON.stringify(inputJSON);

  db.callProcedure('getUserLastMessages',stringOfJson,function(err,recordsets,ReturnJSON) {

    if (err) {

      callback(err, null, 400);

    }else{


      var returnJsonAsJson = JSON.parse(ReturnJSON);
      callback(null, returnJsonAsJson, recordsets.returnValue);

    }

  });

};



obtainChat = function (credentials, callback){

  var inputJSON =
    {'apiVersion':'1.0',
    'params':{
      'chatID':credentials.chatID,
      'userID':credentials.userID
    },
    'status':{
      'code':100
    }
  };

  var stringOfJson=JSON.stringify(inputJSON);

  db.callProcedure('getChat',stringOfJson,function(err,recordsets,ReturnJSON) {

    if (err) {

      callback(err, null, 400);

    }else{


      var returnJsonAsJson = JSON.parse(ReturnJSON);

      callback(null, returnJsonAsJson, recordsets.returnValue);

    }

  });

};



saveMessage = function (data, callback){


  var inputJSON =
    {'apiVersion':'1.0',
    'params':{
      'chatID':data.chatID,
      'userID':data.userID,
      'message':data.message,
      'chatUserID':data.chatUserID,
      'sendTimestamp':data.sendTimestamp
    },
    'status':{
      'code':100
    }
  };

  var stringOfJson=JSON.stringify(inputJSON);

  db.callProcedure('saveMessage',stringOfJson,function(err,recordsets,ReturnJSON) {

    if (err) {

      callback(err, null, 400);

    }else{


      var returnJsonAsJson = JSON.parse(ReturnJSON);

      callback(null, returnJsonAsJson, recordsets.returnValue);

    }

  });



};
