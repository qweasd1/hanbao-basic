# Hanbao-Basic
a plugin for hanbao to add CRUD methods on models in Hanbao


## install
```bash
npm install hanbao-basic
```

## Quick Start
```javascript
hanbao({
  plugins:[
    {
      plugin:"hanbao-basic",
      options:{
       sourceTypes:[
         "hanbao-basic-mongo"
       ],
       datasources:[
         {
           name:"moviedb",
           url:"mongodb://localhost:27017/moviedb",
           default:true
         }
       ]
      }
    }
  ]
}).init((err,manager)=>{
  manager.utils.getModels({name:"some-model"}).methods.read.default({}).then(data=>{
    console.log(data);
  })
})

```


## Document
* [TODO] how to create a sourceType?

## API Reference
#### sourceType
```javascript

// can be string(which is the module name or path of sourceType)
"hanbao-basic-mongo"
basicPlugin


// can be factory object
{
  name:"hanbao-basic-mongo", // or a factory method
  options:{}
}

```



#### datasource
```javascript

```