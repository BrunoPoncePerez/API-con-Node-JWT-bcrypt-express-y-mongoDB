//archivo para arrancar la aplicacion 
const app = require('./app');
require('./database')
async function init(){
    await app.listen(3200);
    console.log('server on port 3200');
}

init(); 