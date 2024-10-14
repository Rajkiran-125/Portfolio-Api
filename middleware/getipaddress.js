const dotenv = require('dotenv');
const{success,error,validation} = require('../api/APIResponse');
dotenv.config();
var getIP = require('ipware')().get_ip;

const getipaddress = (req, res, next) => {

    var ipInfo = getIP(req);
    // console.log('In getipaddress',ipInfo);
    // { clientIp: '127.0.0.1', clientIpRoutable: false }
    return next();
    
};

// app.use(function(req, res, next) {
//     var ipInfo = getIP(req);
//     console.log('In getipaddress',ipInfo);
//     // { clientIp: '127.0.0.1', clientIpRoutable: false }
//     next();
// });

module.exports = getipaddress;