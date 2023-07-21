var express = require("express")

var mongoose = require("mongoose")


var userScheems = mongoose.Schema({
    name:String,
    email:String,
    password: String,
    date:Date,
    type:Number,
    approve:Number
    
})

var User = mongoose.model("user",userScheems)

module.exports = User