var express = require("express");
var route = express.Router();
var Admin = require("../mongoose scheemas/admin_scheema");
var User = require("../mongoose scheemas/userscheema");
var manager = require("../mongoose scheemas/topicmanagerScheema")

route.get("/login", function(req, res) {
  res.render("login");
});

route.post("/login", function(req, res) {
  var info = req.body;
  console.log(req.body);
  Admin.findOne({
    email: info.email
  }).then(function(response) {
    console.log(response);
    if (!response) {
      res.render("login", { message: "Invalid email" });
    } else if (response.password === info.password) {
      res.redirect("/admin");
    } else {
      res.render("login", { message: "Invalid password" });
    }
  });
});

route.get("/", function(req, res) {
  User.find().then(function(response) {
    res.render("adminLogin", { adm: response });
  });
  // manager.find().then(function(response){
  //   res.render("adminLogin" , {man:response})
  // })
});

route.get("/edit/:id", function(req, res) {
  var id = req.params.id;
  User.findById(id).then(function(response) {
    res.render("editUser", { usr: response });
  });
});

route.post("/edit/:id", function(req, res) {
  var id = req.params.id; // Retrieve the id from req.params
  var update = req.body;
  User.findByIdAndUpdate(id,{
    name:update.name,
    email:update.email,
    password:update.password,
    approve:update.approve
  }).then(function(response) {
    res.redirect("/admin"); // Redirect to the admin page after updating
  });
});


route.get("/addManager" , function(req,res){
  res.render("addmanager")
})

route.post("/addManager" , function(req,res){
  var info = req.body
  var newManager=new manager({
    email :info.email,
    password:info.password,
    approve:1,
    categories:info.categories

  })
  newManager.save().then(function(response){
    res.redirect("/admin" )
  })
  
})

route.get("/viewMnager" , function(req,res){
  manager.find().then(function(response){
    res.render("viewMnager" , {man:response})
  })
})

route.get("/editTM/:id" , function(req,res){
   var id = req.params.id 
   manager.findById(id).then(function(response){
    res.render("editTopicmanager" , {man:response})
   })

})
route.post("/editTM/:id" , function(req,res){
  var info = req.body
  var id = req.params.id
  manager.findByIdAndUpdate(id , {
    email:info.email,
    password:info.password,
    approve:info.approve,
    categories:info.categories
  }).then(function(response){
    res.redirect("/admin/viewMnager")
  })
})


module.exports = route;
