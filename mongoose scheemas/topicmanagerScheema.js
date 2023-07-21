var express = require("express")
var mongoose = require("mongoose")

 var managerScheema = mongoose.Schema({
    email:String,
    password:String,
    approve:Number,
    categories:String
 })

 var manager = mongoose.model("Tmanager" , managerScheema)

 module.exports = manager