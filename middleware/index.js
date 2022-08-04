'use strict'

const Auth = require('solinftec-auth-lib') 
const helper = new Auth()
helper.setOrigin('node')
const logger = require('../loggers/Logger')

module.exports = class{
  constructor(token){
     this.token = token;
  }

  async getClarify(){
    let resultClarify = null;
    resultClarify = await helper.clarify(this.token);    
    return new Promise((resolve, reject)=>{  
      if(resultClarify.error == undefined){
        resolve(resultClarify);
      }else{
        reject('Error Decoding Token.')
        logger.error('Error Decoding Token'+', Date:' + new Date());
      }
    });
  }
}