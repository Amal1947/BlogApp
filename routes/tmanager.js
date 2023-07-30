var express = require("express")
var mongoose = require("mongoose")
var manager = require("../mongoose scheemas/topicmanagerScheema")
var route = express.Router()
var session = require("express-session")
var posts = require("../mongoose scheemas/userPostScheema")




route.use(function (req, res, next) {
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate"); 
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0"); 
    next();
  });
  
  
  
  route.use(
    session({
      secret: "your-secret-key",
      resave: false,
      saveUninitialized: true,
      cookie: { secure: false }, 
    })
  );

route.get("/login" , function(req,res){
    res.render("login")
})


route.post("/login" , function(req,res){
    var info = req.body
    manager.findOne({email:info.email}).then(function(response){
        if(!response){
            res.render("login" , {message:"invalid email"})
        }
        else if(response.password==info.password){
            req.session.manager=response
            
            res.redirect("/tmanager/tmanager")
        }
        else{
            res.render("login" , {message:"incorrect password"})
        }
    })

})




route.get("/tmanager", function(req, res) {
    posts.find({ topic: req.session.manager.categories }).then(function(response) {
        console.log(response);
        const unapprovedPosts=response.filter(posts=>posts.approve===0)

        if (!response|| unapprovedPosts.length==0) {
            res.render("tmanagerLogin", { man: [], message: "No data available" });
            
           
        } else {
            
           
                res.render("tmanagerLogin", { man: unapprovedPosts });
            
        }
    }).catch(function(error) {
        console.error("Error retrieving data:", error);
        res.render("tmanagerLogin", { man: [], message: "Error retrieving data" });
    });
});

route.get("/readMore/:id" , function(req,res){
    id = req.params.id
    posts.findById(id).then(function(response){
        res.render("readmore" ,{ res:response})
    })
    
})
route.post("/readMore/:id" , function(req,res){
    var id = req.params.id
    var info = req.body
    console.log(info)
    posts.findByIdAndUpdate(id,{
        approve:info.approve
    }).then(function(response){
        res.redirect("/tmanager/tmanager")
    })
})


route.get("/approvePost" , function(req,res){
    var catogory = req.session.manager.categories
    posts.find({approve:1 , topic:catogory}).then(function(response){
        res.render("approvePost" , {res:response})
    })
})
route.get("/declined" , function(req,res){
    var catogory = req.session.manager.categories
    posts.find({approve:-1 , topic:catogory }).then(function(response){
        res.render("declainedPost" , {res:response})
    })
})


route.get("/logout", function (req, res) {
    req.session.destroy(function (err) {
      if (err) {
        console.error("Error destroying session:", err);
      }
      res.redirect("/");
    });
  });




module.exports = route