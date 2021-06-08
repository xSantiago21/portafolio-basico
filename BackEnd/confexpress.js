'use strict'

//Importar librerías
var express = require('express');
var bodyParser = require('body-parser');
const { STATES } = require('mongoose');

var app = express();

//Cargar rutas
var project_routes = require('./routes/project.routes');


//Configuración de middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Configuración de CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next(); 
});


//Configuración de rutas
app.use('/api', project_routes);



module.exports = app; 