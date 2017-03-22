# Design

## TODO
* support multiple datasource
* support selector


## Service
* we expose all the basic methods
* if there are implementation on model, we just skip

## Datasource design
* Datasource should be unique for each name
* if multiple default datasource exists failed the model proccessor
    * we can register a plugins to provide utils and init for this purpose
* models for different datasource should has model key like 'datasourcename:modelname', however for default db, you don't need the datasourcename
* we can load datasouce from module
    * absolute path
    * [TODO] relative path

## Data basic Plugin
* we should split register plugin into a seperate plugin
* the data-{datasource}-plugin should only provide the factory methods for basic methods
* the splitCreteria should also appear in a seperate helper proejct 

## Basic model
* design the configuration
    * [optional] can override the makeMethod in configuration
* design which service to add
* design which meta to add
    * the default datasource
    * all datasource instance
    * does instance should be same?
* design which modelProcessor to add
* default global method will add on model.methods.create.default
* basic method can also define on model level which will override the global one
* the generate basic methods will access manager from 'this'


## selector
* should define default selector so fields like is_delete won't appear
    * remove unneccesary field like "is_delete"
    * remvoe sensitive field like id
    * selector can be object (represent structure,pre-selector) or function (post-selector)
    * [advanced] maybe we can support function based


## model name design
* if different datasource has model share same name
    * [?] how to access them in manager.models // we can let user to define the model name function
    * how to filter them in manager.getModels // filter on global model match

## clean up 
* close the connection when not process exits


## tips
* in modelProcessor, always return the next() if you want to return it earlier, otherwise, it might cause errors


## populate
* default id for each datasource 