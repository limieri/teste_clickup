require('dotenv').config();

var express = require('express');
var consign = require('consign');
var compression = require('compression');

module.exports = ()=>{
    var app = express();

    consign()
    .include('controllers')
    .then('loggers')
    .into(app);

    app.use(express.json());
    app.use(compression());

    return app;
}