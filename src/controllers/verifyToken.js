const jwt = require('jsonwebtoken');
const {secret} =require('../config')

function verifyToken(req, res, next){
     //vamos a comprobar si el usuario tiene un token, y como hacemos eso? 
     const token = req.headers['x-access-token']//nos devuelve las cabeceras que el cliente envia, en este caso son los headers de postman
     if(!token){//si no tiene un token...
         return res.status(401).json({
             Auth: false,
             message: 'no token provided'
         });
         //pero si cuenta con un token tenemos que verificarlo con un...
     }
     const decoded = jwt.verify(token, secret)//pero tenemos que decifrarlo y tenemos que pasarle el secret
     req.userId = decoded.id;//guarda los datos en req.userId
     next();
    }

    module.exports = verifyToken;