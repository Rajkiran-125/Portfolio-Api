const mssql = require('mssql');
const dotenv = require('dotenv');
dotenv.config();
var config = {

    user: process.env.MSSQL_USER,
    password: process.env.MSSQL_PASS,
    database: process.env.MSSQL_DBNAME,
    server: process.env.MSSQL_HOST,
    dialect: "mssql",
    // for local port is used
    port:Number(process.env.MSSQL_PORT),
    //////////////////////////


    dialectOptions: {
        "instanceName": "Hp"
    },
    pool: {
        max: 10,
        min: 5,
        idleTimeoutMillis: 30000
    },
    options: {
        encrypt: true, // for azure
        trustServerCertificate: true, // change to true for local dev / self-signed certs
        enableArithAbort: true
    }
};

const poolPromise = new mssql.ConnectionPool(config);

console.log(` DATABASE CONFIG  : ${JSON.stringify(config)}`)

function connect() {
    return poolPromise.connect();
}


function ConnectDB() {
    connect()
        .then(pool => {
            console.log("Connected to MSSQL");
            global.isDbConnected = true;
            return pool
        })
        .catch(err => {
            console.log(" Database Connection Failed : ", err.message)
            setTimeout(() => {
                console.log('Reconnecting  MSSQL DB');
                ConnectDB();
            }, 5000);
        });
};

ConnectDB();



module.exports = {
    mssql, poolPromise
}