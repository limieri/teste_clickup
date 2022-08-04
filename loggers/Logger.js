var winston = require('winston');
var fs = require('fs');

if(!fs.existsSync('logs')){
    fs.mkdirSync('logs');
}

module.exports = winston.createLogger({
    format: winston.format.json(),
    transports:[
        new winston.transports.File({filename: 'logs/logs.log',maxsize:10000000,maxFiles:10})
    ]
})