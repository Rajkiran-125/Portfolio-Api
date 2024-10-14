const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { success, error, validation } = require('../api/APIResponse');
dotenv.config();

const verifyToken = (req, res, next) => {

  console.log('in verifytoken');

  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  console.log(token);

  //const token = req.body.token || req.query.token || req.headers["x-access-token"];

  if (token == 'null') {
    console.log('TOKEN IN NULL NEXT in verifytoken>>>');
    return next();
  }

  // if (!token) {
  //   //return res.status(403).send("A token is required for authentication");
  //   return res.status(403).json(error("A token is required for authentication",res.statusCode));
  // }

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    console.log('decoded', decoded);
    req.user = decoded;

  } catch (err) {
    //return res.status(401).send("Invalid Token");
    return res.status(401).json(error("Invalid Token", res.statusCode));
    //return res.redirect('/');
  }

  return next();

};

module.exports = verifyToken;