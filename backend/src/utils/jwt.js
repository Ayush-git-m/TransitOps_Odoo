const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateToken  = (payload) =>{
  return jwt.sign(payload, process.env.JWT_SECRET || 'fallback_secret2',{
    expiresIn: process.env.JWT_EXPIRY || '1d',
  });
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret1');  
};

module.exports = {
  generateToken,
  verifyToken,
};