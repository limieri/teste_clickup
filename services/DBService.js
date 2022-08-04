'use strict'

const oracledb = require('oracledb');
const logger = require('../loggers/Logger');

module.exports = class{

     constructor(instance){
        //  console.log('Instance:',instance);
         this.user = instance.user || null;
         this.password = instance.password || null;
         this.connectString = instance.connectString || null;
         this.connection = null;
    }

    async getConnection(){
        try {
            this.connection = await oracledb.getConnection({
                user          : this.user,
                password      : this.password,
                connectString : this.connectString
            }); 

        } catch (error) {
            logger.error('Database connection error'+', Date:' + new Date());
            console.error(error);
        }
    }

    async closeConcection(){
        try {
            return await this.connection.close();
            
        } catch (error) {
            console.error(error);
        }
    }

    async getSelect(sql,parameters = {}){
        // let connection = await this.getConnection();
        try {
            let result = await this.connection.execute(
                sql,parameters,{outFormat:oracledb.OBJECT,fetchArraySize:10000,maxRows:1}
            );
            return result;
        } catch (error) {
            console.log('Error executing: ',error.message);
            return error
        }    
    }
}