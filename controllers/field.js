const Clarify = require('../middleware/index')
const Aws = require('../services/Aws')
const logger = require('../loggers/Logger')
const DBService = require('../services/DBService')
var cors = require('cors')

var corsOptions = {
    origin: 'http://localhost:8887',
    allowedHeaders:[
        'x-auth-token'
    ],
    methods:[
        'GET'
    ],
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }

  const verifyOwnerCache = async (owner,app) => {
    let filtrado = null;
    let nameOwnerComparator = [].concat.apply([],app.get('OwnerCache'));

    filtrado = nameOwnerComparator.filter(o =>{      
        return o.owner == owner.toUpperCase();
    });

    if(filtrado[0].values[0] === undefined){
        return false;
    }

    return filtrado[0].values[0].VL_PARAMETRO;
  }

module.exports = (app)=> {
    app.options('/field/urlFieldPBF/:field', cors()) // enable pre-flight request for DELETE request
    app.get('/field/urlFieldPBF/:field', cors(corsOptions), function(req,res){
        let awsBucket ,token_clarify ,auth_token ,field = null;

        auth_token = req.headers['x-auth-token'];
        field = req.params['field'];

        if(!auth_token){
            res.status(422).send('Token does not exist');
            logger.error('Token does not exist'+', Date:' + new Date());
            return;
        }
        
        if(!field){
            res.status(422).send('Parameter not informed');
            logger.error('Parameter not informed: [Token:'+req.headers['x-auth-token']+'],Date:' + new Date());
            return;
        }

        token_clarify = new Clarify(auth_token);
        token_clarify.getClarify()
        .then(async response=>{
            let nameFolder =  await verifyOwnerCache(response.owner,app);
            if(!nameFolder){
               res.status(422).send('General parameter does not exist');
               return;
            }
            awsBucket = await new Aws(field,nameFolder);
            awsBucket.getBucket()
            .then(url =>{
                res.status(200).send(url);
                logger.info('URL:{'+url+'},Requested by:{'+ response.name + '},Environment:{'+
                response.environment+'},Date:{' + new Date() + '}');
            })
            .catch(error =>{
                res.status(500).send(error + ', Search Parameter ' + req.params['field']);
                logger.error(error + ', Search Parameter ' + req.params['field'] + ',Requested by:{'+ response.name +
                '},Environment:{'+response.environment+'},Date:{' + new Date() + '}');
            });//end catch getBucket
        })
        .catch(error =>{
            res.status(400).send(error);
        });//end catch Clarify
    });
}