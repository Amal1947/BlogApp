var mongoose = require("mongoose")
var express = require("express")

var adminScheema = mongoose.Schema({
    email:String,
    password:String


})

var admin = mongoose.model("admin" , adminScheema)

module.exports = admin