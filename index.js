var app = require('./config/custom-express')();
const Auth = require('solinftec-auth-lib') ;
const helper = new Auth();
helper.setOrigin('node');
const urlBaseAuth = 'https://auth-api.saas-solinftec.com/v2/';
const fetch  = require('node-fetch');
const connectionPools = require('./config/database-instance');
const DBService = require('./services/DBService');

const fetchData = async (conneObj, array) => {
    let acc = [];
    for (const value of array) {
        let res = {};
        try {
            let resultRows = await conneObj.getSelect('SELECT * FROM '+value+'.CFG_PARAMETROS_GERAIS WHERE CD_ID = :ID',{id:373});
            res.values = resultRows.rows
            res.owner = value;
            acc.push(res);
        } catch (error) {
            acc.push({error});
        }
    }
    return acc;  
}

const init = () =>{
    return new Promise(async (resolve, reject)=>{
        let get = { 
            method:'GET', 
            headers: 
                    {
                    'request-origin': 'node'
                    }
        };
        var path = 'jdbc';
        var arrayCache = [];
        fetch(urlBaseAuth+path, get)
        .then(res  => res.json())
        .then(async listInstanceAndOwners =>  {
            let conneObj = {}
            for (let [key, value] of Object.entries(connectionPools)) {
                conneObj = await new DBService(value);
                await conneObj.getConnection();
                console.log('Connection Open: ',key);
                arrayCache.push(await fetchData(conneObj, listInstanceAndOwners[key]));
                await conneObj.closeConcection()
                console.log('Connection Closed');
            }
            resolve(arrayCache);
        })
        .catch(e => {
            reject(e);
           console.log(e)
        });
    });
}

init().then(response=>{
    app.set('OwnerCache',response);
    const PORT = process.env.PORT || '6667';
    app.listen(PORT,function(){
        console.log('Servidor rodando na porta',PORT);
    });
});
