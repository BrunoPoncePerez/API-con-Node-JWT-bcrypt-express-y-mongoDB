// acá nos conectaremos a la base de datos 
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/', {
    useNewUrlParser: true
})
.then(db => console.log('database is connected'));
//este modulo lo que hace es recibir la coneccion de la base de datops
