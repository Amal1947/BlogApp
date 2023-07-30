var express = require("express")
var route = express.Router()
var posts = require("../mongoose scheemas/userPostScheema")


route.get("/" , function(req,res){
    posts.find({approve:1}).then(function(response){
        res.render("home" ,{res:response})
    })
    
   
})

route.get("/login" , function(req,res){
    res.render("login")
})



route.get("/signup" , function(req,res){
    res.render("signup")
})

module.exports=route