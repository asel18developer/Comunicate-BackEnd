/*****************************************************************************/
/*                            Import node modules                            */
/*****************************************************************************/
var sql = require("mssql");

/* Database configuration */
var dbConfig = {

	user: "is2-admin",
	password: "jHJuIm4F",
	server: "comunicate.database.windows.net",
	database: "IS2-Comunicate",

	options: {
		encrypt: true /* Use this if you're on Windows Azure */
	}

}

/* Function to connect to the database */
exports.connectDB = function(){

	  sql.connect(dbConfig).then(function() {

	    console.log('Database connection established');

	  }).catch(function(err) {

	    console.log('Impossible connecting to Database.');

	  });

};

/* Generic function to call the procedures of the database */
exports.callProcedure = function (procedure,InputJSON,callback){

		// Stored Procedure
		var request = new sql.Request();
		request.input('InputJSON',sql.NVarChar(sql.MAX),InputJSON);
		request.output('ReturnJSON', sql.NVarChar(sql.MAX));
		request.execute(procedure,function(err, recordsets, returnValue) {

		//console.log(request.parameters.ReturnJSON.value);
		//console.log(recordsets[0][0].ReturnJSON);
		//console.log("EL RETURN VALUE ES: "+request.parameters.ReturnJSON.value);

		//callback(err,recordsets,request.parameters.ReturnJSON.value);
		//callback(err,recordsets,recordsets.ReturnJSON);
		if (recordsets[0]) {
			//JESUS
			console.log("JESUS");
			callback(err,recordsets,recordsets[0][0].ReturnJSON);
		}else if(recordsets.recordset){
			//CESAR
			console.log("CESAR");
			callback(err,recordsets,recordsets.recordset[0].ReturnJSON);
		}





		});



};
