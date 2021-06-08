'use-strict'

var app = require('./confexpress'); 
var port = 3700;

//Conexión con la base de datos MongoDB
var mongooseDb = require('mongoose');
mongooseDb.Promise = global.Promise;
mongooseDb.connect('mongodb://localhost:27017/portafolio')
    .then(() => {
        console.log("Conexión a base de datos establecida!");
        app.listen(port, () => {
            console.log('Servidor corriendo en localhost:' + port);
        });
    })
    .catch((error) => {
        console.log(error);
        process.exit(1);
    });

