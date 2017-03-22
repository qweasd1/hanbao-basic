/**
 * Created by tony on 3/17/17.
 */
'use strict'
const CRUD_METHODS = ["create","read","udpate","delete"]
const pluginName = require('../package.json').name;

module.exports = createSinglePlugin

/**
 * should support other options for mongodb connection
 * @type {{name: string, url: string, default: boolean}}
 */
// let options = {
//   name:"db1",
//   url:"",
//   softDelete:true, // can be true, false, options for softdelete
//   default:true,
//   mongoOptions:{}, // options to initialize mongo connection, same as ....
//   query:{} // the default $limit, pagination
// }


/**
 * create single basicPlugin for one db instance
 * @param options
 * @returns {basicPlugin}
 */
function createSinglePlugin(sourceType, options){
    
    // the basicPlugin
    let plugin = function plugin(manager,next){
      
      // setup the connection
      
      sourceType.createDb(options,function (err,db){
        if(err){
          next(err)
        }
        // connection setup successfully, start to add service, meta data, model processor to manager
        else {
          let basicService = manager.getOrCreateService("basic")
          // current we don't have options for common basic methods, so we leave their options as null, we will add query configration here in the future
          let glboalBasicMethods = createBasicService(sourceType.basicMethodFactory,db,null,options.softDelete)
    
          // register the global service for model query
          basicService[options.name] = glboalBasicMethods
    
          // set meta.datasource.default = this
          let isDefaultDatasource = !!options.default
    
          if(isDefaultDatasource){
            manager.meta("datasource.default",`${sourceType.name}:${options.name}`)
            basicService.default = glboalBasicMethods
          }
    
    
    
          // create basic methods as model.methods.{CRUD}.default
          manager.addModelProcessor(`${pluginName}:add-basic-method`,function (manager,model,next){
            let collectionName
      
            // default datasource
            if(!model.datasource || model.datasource === "default"){
              // no data source and not default data source, skip
              if(!isDefaultDatasource){
                return next()
              }
              else {
                collectionName = manager.utils.get(model,"datasource.collection") || model.name
              }
            }
            else {
              if(model.datasource.name === options.name){
                collectionName = manager.utils.get(model,"datasource.collection") || model.name
              }
              else {
                return next()
              }
            }
      
      
            CRUD_METHODS.forEach(methodName=>{
              let path = `methods.${methodName}.default`
              // only add basic method to model.methods if there are no user-defined methods
              if(!manager.utils.get(model,path)){
                let method
                if(options.softDelete){
                  switch (methodName){
                    case "create":
                      method = glboalBasicMethods.createWithSoftDelete.bind(manager,collectionName)
                      break
                    case "read":
                      method = glboalBasicMethods.readWithSoftDelete.bind(manager,collectionName)
                      break
                    case "update":
                      method = glboalBasicMethods.update.bind(manager,collectionName)
                      break
                    case "delete":
                      method = glboalBasicMethods.softDelete.bind(manager,collectionName)
                      break
                  }
                }
                else {
                  switch (methodName){
                    case "create":
                      method = glboalBasicMethods.create.bind(manager,collectionName)
                      break
                    case "read":
                      method = glboalBasicMethods.read.bind(manager,collectionName)
                      break
                    case "update":
                      method = glboalBasicMethods.update.bind(manager,collectionName)
                      break
                    case "delete":
                      method = glboalBasicMethods.delete.bind(manager,collectionName)
                      break
                  }
                }
          
                manager.utils.set(model,path,method)
              }
            })
      
            next()
          })
    
          next()
        }
      })
      
     
      
    }
    
    plugin.info = {
      name:`${require('../package.json').name}[${options.name}]`
    }
    
  return plugin
}

/**
 * create basic methods(CRUD) for the db
 * @param db
 * @param options
 * @param softDelete
 * @returns {*}
 */
function createBasicService(factory, db,options,softDelete){
    let result = {}
    result.create = factory.makeCreate(db,options)
    result.read   = factory.makeRead(db,options)
    result.update = factory.makeUpdate(db,options)
    result.delete = factory.makeDelete(db,options)
    result.db = db
  
    if(softDelete){
       let softDeleteOptions = typeof softDelete === 'object' ? softDelete : {}
       options = options || {}
       Object.assign(options, softDeleteOptions)
  
       result.createWithSoftDelete =  factory.makeCreateWithSoftDelete(db,options)
       result.readWithSoftDelete =  factory.makeReadWithSoftDelete(db,options)
       result.softDelete =  factory.makeSoftDelete(db,options)
      
    }
    
    return result
}

