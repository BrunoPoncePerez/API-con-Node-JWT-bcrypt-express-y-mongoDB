//nos servira para consultar a la bd que datos estamos guardando ahi 
// vamos a crear un modelo de usuario para poder consultar, guardar etc
const { Schema, model} = require('mongoose');//debemos importar primero
//estos dos metodos nos van a permitir decir a la base de datps
//qué y como estoy guardando los datos

//importamos bcrypt
const bcrypt = require('bcryptjs');//este modulo toma un string y al final devuelve un string cifrado


//creamos un schema que nos dice que datos voy a estar guardando
const userSchema = new Schema({
    username: String,
    email: String,
    password: String
});
//creamos un metodo pra encriptar la contraseña 
userSchema.methods.encryptPassword = async (password) =>{
//este metodo es una funcion que recibe en este caso una contraseña  
//entonces empezaremos a cifrar la contraseña, pero utilizando el modulo bcrypt
const salt = await bcrypt.genSalt(10)//10 veces
 //gentsalt es un hash que aplica al string para hacerlo mas seguro 
 return bcrypt.hash(password, salt);//este metodo hash es el encargado de convertir strings en algo que no se puede entender
};

//creamos un metodo para validar la contraseña 
userSchema.methods.validatePassword = function (password){
//pero para validar la contraseña tenemos que compararla 
//vamos a comparar la contraseña que nos pasen con la de userschema
return bcrypt.compare(password, this.password);
}
// para guardar en la base de datos usamos lo siguiente
module.exports = model('User', userSchema); //el User está basado en el schema que hemos creado
// con esto ya tenemos nuestro modelo de usuario y lo exportamos 
