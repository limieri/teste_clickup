'use strict'

const AWS = require('aws-sdk');

const s3 = new AWS.S3({
    region:process.env.AMAZONREGION
});

module.exports = class{

    constructor(field,owner){
        this.field = field;
        this.owner = owner;     
    }

    async getBucket(){
        return new Promise((resolve,reject)=>{
            const myBucket = process.env.BUCKET;
            const signedUrlExpireSeconds = parseInt(process.env.URLEXPIRATIONTIME);
            const myKey = this.owner + '/talhao/talhao-'+ this.field +'.pbf';

            this.getExistsInS3(myBucket,myKey,(data)=>{
                if(data){
                    s3.getSignedUrl('getObject',{
                        Bucket: myBucket,
                        Key:myKey,
                        Expires: signedUrlExpireSeconds
                    },(err,url) =>{
                        if(url){
                            resolve(url)
                        }else{
                            logger.info('Error Callback S3:{'+err+'},Date:{' + new Date() + '}');
                            console.log('Error Callback S3: ',err);
                        }
                    });
                }else{
                    reject('No File Searched');
                }
            });
        });
    }

    getExistsInS3(bucket,key, callback){
        s3.headObject({Bucket: bucket,Key:key},function(err,resp,body){
            if(!resp){
                callback(false);
            }else{
                callback(true);
            }
        });
    }
}