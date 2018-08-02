var db = require('./connectorDB');
var Token = require('./tokenController');
var Socket = require('./SocketController');
const nodemailer = require('nodemailer');

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // secure:true for port 465, secure:false for port 587
    auth: {
        user: 'comunicate.recovery@gmail.com',
        pass: 'practicais2'
    }
});


exports.sendEmail = function(data){

  var socket = this;

  redactEmail(data, function(err, response, code){

    // setup email data with unicode symbols

    if (response.status.code == 200) {
      var mailOptions = {
          from: '"Comunicate" <comunicate.recovery@gmail.com>', // sender address
          to: response.data.email, // list of receivers
          subject: 'Recovery pass', // Subject line
          html: '<b>Tu nueva contraseña es '+response.data.newPass+' cambialada desde la aplicación</b>' // html body
      };

      // send mail with defined transport object
      transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
              return console.log(error);
          }
          console.log('Message %s sent: %s', info.messageId, info.response);
      });
    }

    socket.emit("pass_changed", response);


  });

};

redactEmail = function (credentials, callback){

 var inputJSON =
   {'apiVersion':'1.0',
   'params':{
     'username': credentials.username
   },
   'status':{
     'code':100
   }
 };

 var stringOfJson=JSON.stringify(inputJSON);

 db.callProcedure('recoveryPass',stringOfJson,function(err,recordsets,ReturnJSON) {

   if (err) {

     callback(err, null, 400);

   }else{
     var returnJsonAsJson = JSON.parse(ReturnJSON);

     callback(null, returnJsonAsJson, recordsets.returnValue);

   }

 });

};
