/* Variable global para almacenar las sesiones de los usuarios */
var usersSocket = {};

exports.pairing = function(userID, socketID) {

  if (!socketID) socketID = this.id;
  usersSocket[userID] = socketID;

  console.log("Emparejo "+userID+" con "+socketID);

}

exports.unpairing = function(userID) {

  delete usersSocket[userID];

}

function unpairing(userID){

  console.log("Desmparejo "+userID+" con "+usersSocket[userID]);

  delete usersSocket[userID];

}

exports.getSocketID = function(userID) {

  return usersSocket[userID];

}

exports.getUserID = function(socketID) {

  for (var userID in usersSocket) {

    if (usersSocket[userID] == socketID) return userID;

  }

  return null;

}

function getUserID(socketID){

  for (var userID in usersSocket) {

    if (usersSocket[userID] == socketID) return userID;

  }

  return null;

}

exports.getAll = function() {

  return usersSocket;

}

exports.disconnectSocket = function(socketID) {

  var userID = getUserID(socketID);

  if (userID) {

    unpairing(userID);
    console.log("Si estaba asociado");

  }else {

    console.log("No estaba asociado");

  }

}
