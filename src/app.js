// configuracion de la aplicacion 
const express = require('express'); 
const app = express();

//como vamos a configurar y enviar datos json configuramos 
app.use(express.json());
//app quiero que uses de express su metodo json
//con esto cuando enviamos a nuestro servidor un objeto json
//este es capaz de entenderlo y convertirlo a un objeto de  js

//si despues queremos enviar datos de un formulario html o frontend
app.use(express.urlencoded({extended: false}));
//con esto nuestro servidor ya es capas de entender datos de un formulario 
//y convertirlo a un objeto de javascript 

app.use(require('./controllers/authController'))
module.exports = app;