const VERBOSE = true;

var Socket = require('./SocketController');
var randtoken  = require('rand-token');

/* Variable global para almacenar las sesiones de los usuarios */
var usersTokens = {};

exports.generate = function(){

	  return randtoken.generate(16);

};

exports.checkExpiration = function(){

	for (var token in usersTokens) {

    if (usersTokens[token].creationTimeStamp < new Date()) console.log("caduco "+usersTokens[token]);;

  }

}

exports.checkToken = function(userID, token){

  var validToken = false;

  if(usersTokens[token].userID == userID) validToken = true;

  return validToken;

};

exports.getUser = function(token){

  return usersTokens[token].userID;

};

function getToken(userID){

  for (var token in usersTokens) {

    if (usersTokens[token].userID == userID) return usersTokens[token];

  }

  return null;

}

exports.getDiccionary = function(token){

  return usersTokens;

};

exports.isValid = function(token){

  return usersTokens[token] != null;

};

exports.addUserToken = function(userID, token, socketID){

	//COJO LA FECHA ACTUAL Y LE SUMO 10 MINUTOS
	var ReturnJSON = {
		'userID': userID,
		'creationTimeStamp': new Date().setMinutes(new Date().getMinutes() + 10)
	};


  // add the client's username to the global list
  usersTokens[token] = ReturnJSON;
	Socket.pairing(userID, socketID);

  console.log("Añadido token para el usuario " + userID + " token " + token);

};

exports.deleteUserTokenByUserID = function(userID){

	var token = getToken(userID);

	if (token) {

		console.log('Delete user: '+userID+" for token "+token);
	 	delete usersTokens[token];

	}else {
		console.log('Delete sesion sin nada');
	}



};
