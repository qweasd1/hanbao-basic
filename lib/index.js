/**
 * Created by tony on 3/17/17.
 */
'use strict'
const createSinglePlugin = require('./plugin');
const helper = require('hanbao-utils');
// option sample:
// let options = {
//   sourceTypes:{
//     "mongo":{
//       createDb:function createdb(options){
//
//       },
//       basicMethodFactory:{},
//       default:true
//     },
//
//     "mysql":{
//       createDb:function createdb(options){
//
//       },
//       basicMethodFactory:{}
//     }
//   },
//   datasources:[
//
//   ]
//
// }


/**
 * create the hanbao-basic basicPlugin
 * @param options (Array|Object) array of options to create single basicPlugin for each datasource
 */
function createPlugin(options){
  let plugin = []
  
  
  let sourceTypes = options.sourceTypes
  let datasources = options.datasources
  
  
  
  
  // if options is a single object, we wrapped it into an array
  if(!Array.isArray(datasources)){
    datasources = [datasources]
  }
  
  
  
  let defaultSourceType
  let processedSourceTypes = {}
  
  sourceTypes = helper.loadHanbaoModule(sourceTypes,{
    workingDir:options.workingDir,
    factoryFieldName:"load"
  })
  
  
  // preprocess the sourceTypes , load the specific module if its a string and then turn sourceTypes from array into an object
  // find the default source type if exists, if more than 1 default source type, throw errors
  for (let sourceType of sourceTypes) {
    
    processedSourceTypes[sourceType.name] = sourceType
    
    if(sourceType.default){
      if(defaultSourceType){
        throw Error(`have two default source type: ${defaultSourceType.name}, ${sourceType.name}`)
      }
      defaultSourceType = sourceType
    }
  }
  
  
  
  
  
  for (let datasource of datasources) {
    let sourceType
    if(typeof datasource.type === "undefined"){
       if(defaultSourceType){
           sourceType = defaultSourceType
       }
       else {
         throw new Error(`No default datasource type and no 'type' set on datasource: ${datasource.name}`)
       }
    }
    else {
      sourceType = processedSourceTypes[datasource.type]
      if(!sourceType){
          throw new Error(`the given sourceType: ${datasource.type} on ${datasource} not existing`)
      }
    }
    plugin.push(createSinglePlugin(sourceType,datasource))
  }
  
  plugin.info = require('../package.json')
  return plugin
}



module.exports = createPlugin