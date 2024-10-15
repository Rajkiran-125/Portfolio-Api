const {poolPromise } = require('../database/dataBaseConnection');
const express = require('express');
const { success, error} = require('./APIResponse');
const NodeCache = require("node-cache");
const myCache = new NodeCache();
const getipaddress = require('../middleware/getipaddress');


//importing spjson file

var spkey = require('../sp-name.json');
const EncryptJson = require('../middleware/EncryptJson');
const DecryptJson = require('../middleware/DecryptJson');

const router = express.Router();
router.post('/', getipaddress, async (req, res, next) => {
		
	try {
		let body = await DecryptJson(req.body.data);
		req.body = JSON.parse(body);

		var parameters = [];

		// console.log('parameters',parameters);

		parameters = req.body.data.parameters;

		//var jdata = JSON.parse(req.body.data.parameters);
		// console.log('parameters',req.body.data.parameters);
		//console.log('parameters: ' + JSON.stringify(parameters));

		var paramsquery = writequery(parameters);
		var paramsqueryjson = writequeryforjson(parameters);
		// console.log('paramsquery',paramsquery);
		languagecache = myCache.get("language");

		//if(languagecache == undefined){
		//console.log('Caching data');	
		// query to the database and execute procedure 
		//let query = "exec " + spname + " @username='" + username + "', @email='" + email + "', @usercredentials='" + password + "';";

		// 	let spkeynum = req.body.data.spname;
		// let query = `EXEC ${spkey[spkeynum]} ` + paramsquery ;

		var query;
		
		let spkeynum = req.body.data.spname;

		// console.log('spkey[spkeynum]', spkey[spkeynum]);

		if (spkey[spkeynum] == undefined) {
			query = "exec " + req.body.data.spname + " " + paramsqueryjson + "";
			// console.log('in undefined query', query);
		} else {
			query = `EXEC ${spkey[spkeynum]} ` + paramsquery;
			// console.log('in spkey query', query);
		}

		// let query = "exec " + req.body.data.spname +" "+ paramsquery +"";
		// console.log('Index1query',query);

		const pool = await poolPromise
		var request = await pool.request()
		request.query(query, function (err, recordset) {
			if (err) {
				//console.log(err);
				res.setHeader('Content-Type', 'application/json; charset=ISO-8859-1');
				res.status(400).json(error(err.message, res.statusCode));
			}
			try {
				//console.log(recordset);
				if (recordset.recordsets.length > 1) {
					let encryptedJson =  EncryptJson( JSON.stringify({ data: recordset.recordsets }));
					res.setHeader('Content-Type', 'application/json; charset=ISO-8859-1');
					res.json(success("Success", encryptedJson, res.statusCode));
				}
				else {
					// const encryptedData = EncryptJson(recordset.recordsets[0])
					let encryptedJson =  EncryptJson( JSON.stringify({ data: recordset.recordsets[0] }));
					res.setHeader('Content-Type', 'application/json; charset=ISO-8859-1');
					res.json(success("Success", encryptedJson, res.statusCode));
				}
				languagecache = myCache.set("language", recordset.recordsets, 10000);
			}
			catch (err) {
				// console.log('index => ' + err.message);
				console.log('index => ' + err.message);
			}
		});
		//}
		// else{
		// console.log('Getting data from cache.');
		// res.json(success("Success", { data: languagecache }, res.statusCode));
		// }
	} catch (err) {
		//res.status(500).json(error);
		res.setHeader('Content-Type', 'application/json; charset=ISO-8859-1');
		res.status(500).json(error(err.message, res.statusCode));
	}
});

function writequeryforjson(objparameters) {
	var query = '';
	let finalQuery = '';
	for (const [key, value] of Object.entries(objparameters)) {
		//console.log(key, value);
		//query += key + "=" + "'" + value +"',";
		if (getType(value) == 'string') {
			query += "@" + key + "=" + "N'" + value + "',";
		}
		else {
			//query += "@" + key + "=" + JSON.stringify(value) + ",";
			query += "@" + key + "=" + "N'" + JSON.stringify(value) + "',";
		}
	}
	finalQuery = query.substring(0, query.length - 1);
	//console.log('query: ' + finalQuery);
	return finalQuery;
}

function writequery(objparameters) {
	var query = '';
	let finalQuery = '';
	for (const [key, value] of Object.entries(objparameters)) {
		//console.log(key, value);
		//query += key + "=" + "'" + value +"',";
		if (getType(value) == 'string') {
			query += "@" + key + "=" + "N'" + value + "',";
		}
		else {
			query += "@" + key + "=" + value + ",";
		}
	}
	finalQuery = query.substring(0, query.length - 1);
	return finalQuery;
}

var getType = (function () {

	var objToString = ({}).toString,
		typeMap = {},
		types = [
			"Boolean",
			"Number",
			"String",
			"Function",
			"Array",
			"Date",
			"RegExp",
			"Object",
			"Error"
		];

	for (var i = 0; i < types.length; i++) {
		typeMap["[object " + types[i] + "]"] = types[i].toLowerCase();
	};

	return function (obj) {
		if (obj == null) {
			return String(obj);
		}
		return typeof obj === "object" || typeof obj === "function" ?
			typeMap[objToString.call(obj)] || "object" :
			typeof obj;
	}
}());

module.exports = router;