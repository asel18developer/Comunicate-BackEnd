var db = require('./connectorDB');
var Token = require('./tokenController');
var Socket = require('./SocketController');

exports.getNotes = function(data){

  var socket = this;

  obtainNotes(data, function(err, response, code){

    //console.log(response);
    socket.emit("obtain_notes", response);

  });

};

exports.sendNote = function(data){

  var socket = this;

  saveNote(data, function(err, response, code){

    //console.log(response);
    socket.emit("saved_note", response);

  });

};

saveNote = function (credentials, callback){

  var inputJSON =
    {'apiVersion':'1.0',
    'params':{
      'userID':credentials.userID,
      'byUserID':credentials.byUserID,
      'noteText':credentials.noteText
    },
    'status':{
      'code':100
    }
  };

  var stringOfJson=JSON.stringify(inputJSON);

  db.callProcedure('createNote',stringOfJson,function(err,recordsets,ReturnJSON) {

    if (err) {

      callback(err, null, 400);

    }else{


      var returnJsonAsJson = JSON.parse(ReturnJSON);

      callback(null, returnJsonAsJson, recordsets.returnValue);

    }

  });

};

obtainNotes = function (credentials, callback){

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

  db.callProcedure('getNotes',stringOfJson,function(err,recordsets,ReturnJSON) {

    if (err) {

      callback(err, null, 400);

    }else{


      var returnJsonAsJson = JSON.parse(ReturnJSON);

      callback(null, returnJsonAsJson, recordsets.returnValue);

    }

  });

};
