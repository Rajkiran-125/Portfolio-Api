// const { mssql, poolPromise } = require('../database/db.js');
const { mssql, poolPromise } = require('../database/dataBaseConnection');
const express = require('express')
const { success, error, validation } = require('./APIResponse.js')

const dotenv = require('dotenv');
dotenv.config();
const getipaddress = require('../middleware/getipaddress.js');

const DecryptJson = require("../middleware/DecryptJson.js")

const router = express.Router();

router.post('/', getipaddress, async (req, res, next) => {
	try {
		var query;

		let body = await DecryptJson(req.body.data);
		// console.log('DecrpJson', body);

		req.body = JSON.parse(body);
		// console.log('req.body',req.body);


        // let encryptJson = await  EncryptJson( JSON.stringify({ data: req.body}));
        // console.log('encrpJson',encryptJson);

        res.json(success("Success", {DecryptedData : req.body}, res.statusCode));


	} catch (err) {
		res.status(500).json(error(err.message, res.statusCode));
	}
});

function writequery(objparameters) {
	var query = '';
	let finalQuery = '';
	for (const [key, value] of Object.entries(objparameters)) {
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
		// Support: Safari <= 5.1 (functionish RegExp)
		return typeof obj === "object" || typeof obj === "function" ?
			typeMap[objToString.call(obj)] || "object" :
			typeof obj;
	}
}());









//////////////////////////////////////////////////////

function dbQuery(query) {
	return new Promise(async (resolve, reject) => {
		const pool = await poolPromise;

		const request = await pool.request();

		request.query(query, async function (err, recordset) {
			try {
				if (err) {
					// console.log(err.message, "error in login")
					reject(err.message)
				}
				// console.log(recordset, "AddDisabledUserQuery")
				let result = recordset.recordsets
				// console.log(result, "result..")
				resolve(result)

			} catch (err) {
				// console.log("index => " + err.message);
			}

		});
	});


}

//////////////////////////////////////////////////////








module.exports = router;