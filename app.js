const express = require('express');
const dotenv = require('dotenv');
const app = express();
const cors = require('cors');
var https = require('https');
var http = require('http');
var fs = require('fs'); 
var path = require('path');
const cookieParser = require('cookie-parser');
app.use(cookieParser());

var isHttpsEnabled = process.env.ENABLE_HTTPS;

app.use(cors({
    origin: '*',
    credentials: false 
}));


app.use(express.json({ limit: '50mb', extended: true }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));


app.get('/', (req, res) => {
    res.send('<h1 style = "text-align: center;background: dodgerblue;"><marquee behavior="scroll" direction="left">Rajkiran Jaiswar<sup>®</sup> - v1.0.0.01</marquee></h1>');
});

// Main Index POST
app.use('/api/index', require('./api/index'));
app.use('/api/index/json', require('./api/index-json'));

// Data Decrypt / Encrypt
app.use('/api/DecryptApi', require('./api/DecryptApi.js'));
app.use('/api/EncryptApi', require('./api/EncryptApi.js'));

// Server Keep alive
app.use('/app/corn', require('./api/corn.js'));

if (isHttpsEnabled == 'true') {
    const options = {
        cert: fs.readFileSync('./certificate/unfyd_2023crt.crt'),
        key: fs.readFileSync('./certificate/unfyd_2023-decrypted.key')
    };
    // Create an HTTPS service identical to the HTTP service.
    https.createServer(options, app).listen(process.env.PORT, () => {
        console.log(`Server started running on ${process.env.PORT} for ${process.env.NODE_ENV}`);
    });
}
else {
    // Create an HTTP service.
    http.createServer(app).listen(process.env.PORT, () => {
        console.log(`Server started running on ${process.env.PORT} for ${process.env.NODE_ENV}`);
        // console.log('Ishttps:' + isHttpsEnabled);
    });
}