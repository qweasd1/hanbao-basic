/**
 * Created by tony on 3/17/17.
 */
'use strict'

const hanbao = require('hanbao');
const plugin = require('../lib/plugin');

let p1 = function (manager,next){
  
  
  manager.addModel({name:`person`})
  manager.addModel({name:`animal`,datasource:{
    name:"db2"
  }})
  // manager.addModel({name:"p1-model-2"})
  next()
}
p1.info = {name:"models"}


let manager  = hanbao({
  plugins:[
    p1,
    plugin(
      {
        name:"db2",
        url:"mongodb://localhost:27017/hanbao2",
        softDelete:true
      }
    )
  ]
}).init((err,manager)=>{
  if(err){
     console.log(err);
  }
  else {
    console.log(manager.models.animal.methods.create.default({name:"mimi"}).then((data)=>{
      console.log(data);
    }));
  }
  
})

