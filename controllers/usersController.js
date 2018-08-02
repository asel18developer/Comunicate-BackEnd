var db = require('./connectorDB');
var Token = require('./tokenController');
var Socket = require('./SocketController');

exports.checkUser = function(data){

  var socket = this;

  loggin(data, function(err, response, code){

    if (response.data.isValidUser == 1) {
      Token.addUserToken(response.data.userID, response.data.token, socket.id);
    }

    socket.emit("send_data_user", response);


  });

};

exports.modifyUser = function(data){

  var socket = this;

  saveUser(data, function(err, response, code){

    console.log(response);
    socket.emit("user_modified", response);


  });

};
exports.getExperts = function(data){

  var socket = this;
  obtainExperts(data, function(err, response, code){

    for (var i = 0; i < response.data.experts.length; i++) {

      var socketReceiver = Socket.getSocketID(response.data.experts[i].userID);

      if (socketReceiver) {
        response.data.experts[i].inLine = true;
      }else{
        response.data.experts[i].inLine = false;
      }

    }
    socket.emit("send_experts", response);


  });

};

//Esta funcion para el registro de usuarios
exports.addUser = function(data){

  console.log("Nombre de usuario: " + data.username);
  console.log("Contraseña: " + data.pass);

  var socket = this;

   register(data, function(err, response, code){

    socket.emit("register_user", response);
    console.log(response);


  });

};

exports.addPassTrap = function(data){

  //console.log("Nombre de usuario: " + data.username);
  //console.log("Contraseña: " + data.pass);

  var socket = this;

  updatePassTrap(data, function(err, response, code){


    socket.emit("added_pass_trap", response);



  });

};

exports.userConnected = function(data){

  //console.log("Nombre de usuario: " + data.username);
  //console.log("Contraseña: " + data.pass);

  var socket = this;

  updatePassTrap(data, function(err, response, code){


    socket.emit("added_pass_trap", response);



  });

};

updatePassTrap = function (credentials, callback){

  var inputJSON =
    {'apiVersion':'1.0',
    'params':{
      'userID':credentials.userID,
      'passFalse':credentials.passFalse
    },
    'status':{
      'code':100
    }
  };

  var stringOfJson=JSON.stringify(inputJSON);

  db.callProcedure('addPassTrap',stringOfJson,function(err,recordsets,ReturnJSON) {

    if (err) {

      callback(err, null, 400);

    }else{
      var returnJsonAsJson = JSON.parse(ReturnJSON);

      callback(null, returnJsonAsJson, recordsets.returnValue);

    }

  });

};

loggin = function (credentials, callback){

  var inputJSON =
    {'apiVersion':'1.0',
    'params':{
      'username':credentials.username,
      'pass':credentials.pass
    },
    'status':{
      'code':100
    }
  };

  var stringOfJson=JSON.stringify(inputJSON);

  db.callProcedure('login',stringOfJson,function(err,recordsets,ReturnJSON) {

    if (err) {

      callback(err, null, 400);

    }else{


      var returnJsonAsJson = JSON.parse(ReturnJSON);

      /* Si el usuario es valido le devuelvo su correspondiente token */
      if(recordsets.returnValue == 200 && returnJsonAsJson.data.isValidUser == 1) {

        returnJsonAsJson.data.token = Token.generate();

      }

      callback(null, returnJsonAsJson, recordsets.returnValue);

    }

  });

};

register = function (credentials, callback){

  var inputJSON =
    {'apiVersion':'1.0',
    'params':{
      'username':credentials.username,
      'pass':credentials.pass,
      'email':credentials.email,
      'isExpert': credentials.isExpert
    },
    'status':{
      'code':100
    }
  };


  var stringOfJson=JSON.stringify(inputJSON);
console.log(stringOfJson);
  db.callProcedure('register',stringOfJson,function(err,recordsets,ReturnJSON) {

    if (err) {

      callback(err, null, 400);

    }else{


      var returnJsonAsJson = JSON.parse(ReturnJSON);

      callback(null, returnJsonAsJson, recordsets.returnValue);

    }

  });

};

saveUser = function (credentials, callback){

  var inputJSON =
    {'apiVersion':'1.0',
    'params':{
      'userID':credentials.userID,
      'username':credentials.username,
      'pass':credentials.pass,
      'passTrap':credentials.passTrap,
      'email':credentials.email
    },
    'status':{
      'code':100
    }
  };

  var stringOfJson=JSON.stringify(inputJSON);

  db.callProcedure('modifyUser',stringOfJson,function(err,recordsets,ReturnJSON) {

    if (err) {

      callback(err, null, 400);

    }else{


      var returnJsonAsJson = JSON.parse(ReturnJSON);

      callback(null, returnJsonAsJson, recordsets.returnValue);

    }

  });

};

obtainExperts = function (credentials, callback){

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

  db.callProcedure('getExperts',stringOfJson,function(err,recordsets,ReturnJSON) {

    if (err) {

      callback(err, null, 400);

    }else{
console.log("Lista de usuarios ");
      var returnJsonAsJson = JSON.parse(ReturnJSON);

      callback(null, returnJsonAsJson, recordsets.returnValue);

    }

  });

};
