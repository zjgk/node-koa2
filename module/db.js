//db库
const MongoClient = require('mongodb').MongoClient;
const Config=require('./config.js');

class Db{
    static getInstance(){
        // 单例
        if(!Db.instance){
            Db.instance=new Db();
        }
        return Db.instance;
    }
    constructor(){
        this.dbClient=""; 
        this.connect();
    }
    connect(){
        let _that=this;
        return new Promise((resolve,reject)=>{
           if(!_that.dbClient){
            MongoClient.connect(Config.dbUrl,{useNewUrlParser:true,useUnifiedTopology: true},(err,client)=>{
                if(err){
                    reject(err)
                }else{
                    _that.dbClient=client.db(Config.dbName);
                    resolve(_that.dbClient)
                }
            })
           }else{
            resolve(_that.dbClient)
           }
        }).catch(function (reason) {
            console.log('失败：' + reason);
        });
    }
    find(collectionName,json){
            return new Promise((resolve,reject)=>{
                this.connect().then(db=>{
                    let result=db.collection(collectionName).find(json)
                    result.toArray((err,docs)=>{
                        if(err){
                            reject(err);
                            return;
                        }
                        resolve(docs)
                    })
                })
            }).catch(function (reason) {
                console.log('失败：' + reason);
            });
    }
    update(){

    }
    insert(){

    }
}

module.exports=Db.getInstance();