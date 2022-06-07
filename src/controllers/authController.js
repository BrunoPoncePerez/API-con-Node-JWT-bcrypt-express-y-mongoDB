//vamos a definir las rutas pero antes necesitaremos un enrutador 
const {Router} = require('express');//vamos a utilizar desde expres un metodo que nos servira como enrutador
const router = Router();//creamos un objeto que ejecutará Router
//importamos el jsonwebtoken
const jwt = require('jsonwebtoken');
const {secret} = require('../config');
const verifyToken = require('./verifyToken');
//importamos el modelo ya que nos esta devolviendo de una manera no tan amigable
const User = require('../models/user')
router.post('/signup', async (req,res, next) =>{
    // res.json('signup') vamos a registrar un usuario 
    //necesitamos los datos del usuario  
    const {username, email, password} =  req.body;
    //desde las peticiones que me envien quiero extraer el username, email, password
    console.log(username, email, password);//y que nos muestre por consola 
    //desde postman no devuelve nada, pero si se ve en la consola
    //este create es un metodo del modelo que nos sirve para crear en la bd    
    const user = new User ({
        username: username,
        email: email,
        password: password
    });
    //si vemos en la consola la contrasela se esta enviando tal cual, pero la vamos a cifrar 
    //antes de mostrarme al usuario en la consola queremos ...
    user.password = await user.encryptPassword(user.password);
    //para guardarlo 
     await user.save();//lo que hace es que este objeto recibido lo guarda en mongo db
    console.log(user);
    // res.json({message: 'received'})
    const token = jwt.sign({id: user._id}, secret, {
     expiresIn:  60 *60 * 24   
    })//nos permite crear token pero tenemos que pasrle como parametro un id de usuario 
    //de donde sacamos el id? cuando enviamos nuestros datos en la consolo se imprimió un id y es justamente ese el que vamos a utilizar
    res.json({Auth: true, token});//esto se refleja en el
})
/* CONSOLA:
[nodemon] restarting due to changes...
[nodemon] starting `node src/index.js`
server on port 3200
database is connected

{
  username: ...........,
  email: ...........,
  password: '$2a$10$NKnYgc.ZMiLYtim3ve9Ym.v2iI.9H60ubjO4VkIM62OvpT1Ishw8O',
  _id: new ObjectId("629fa784d2a2f3e4761f06ea")
}
*/
router.get('/me', verifyToken, async (req,res, next) =>{//muestra informacion 
    const user = await User.findById(req.userId, {password: 0})//desde el modelo de usuario voy a buscar por id 
                                            //aca ponemos los datos que no queremos que se muestres¿n ya que nos manda hasta la contraseña
    //si no existe el usuario vamos a enviarle un estado y un mensaje
    if(!user){
        return res.status(404).send('no user found')
    }
    // si el usuario existe 
    res.json(user);
    res.json('me')
})
/*
EN POSTMAN: nos devuelve toda la informacion del usuario  
{
    "_id": "629fb3fc0b275e60f75a52a1",
    "username": "JhonCENA",
    "email": "wwe.rawn@outlook.es",
    "password": "$2a$10$mTbihlNHHa9cwlKhP7T78.20fPzzADSq5EZOpFxhzeve2qXhGUf3u",
    "__v": 0
}
*/
router.post('/signin', async (req,res, next) =>{
    const {email, password} = req.body;
    console.log(email, password);
    const user = await User.findOne({email: email});//para buscar un dato 
    if(!user){
      return res.status(404).send("the email doesn't exists")
    }
    //validamos la contraseña 
    const validationPassword = await user.validatePassword(password);
    console.log(validationPassword);
    //si todos los datos son correctos le devolvemos un token al usuario 
    if(!validationPassword){//si la contraseña no es correcta..
        return res.status(401).json({auth: false, token: null});
    }
    //si todos los datos son correctos le entregamos un token 
    const token = jwt.sign({id: user._id}, secret,{
      expiresIn: 60 * 60 * 24
    })
    
    res.json({auth: true, token});
})

//lo exportamos
module.exports = router;
/* 
cada vez que nos registramos o logeamos el servidor nos devuelve un token y 
para qué nos da ese token? simplemente que cuando para cuando pidamos algo al servidor
este verá si tengo un token y esto le permite a ell saber de que yo estoy autorizaado
de pedir informacion al servidor, de lo contrario no puedo pedir nada 
*/