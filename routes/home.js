var express = require("express")
var route = express.Router()


route.get("/" , function(req,res){
    res.render("home")
})

route.get("/login" , function(req,res){
    res.render("login")
})



route.get("/signup" , function(req,res){
    res.render("signup")
})

module.exports=route