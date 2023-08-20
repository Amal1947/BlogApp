var express = require("express");
var route = express.Router();
var session = require("express-session")
var Admin = require("../mongoose scheemas/admin_scheema");
var User = require("../mongoose scheemas/userscheema");
var manager = require("../mongoose scheemas/topicmanagerScheema")
var catogery = require("../mongoose scheemas/categories_scheema")

route.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, 
  })
);

route.use(function (req, res, next) {
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate"); 
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0"); 
  next();
});

function isAuthenticated(req, res, next) {
  if (req.session.admin) {
  
    next();
  } else {
   
    res.redirect("/login");
  }
}


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
      req.session.admin = response;
      console.log(req.session.admin , "adminnnnnn")
      res.redirect("/admin");
    } else {
      res.render("login", { message: "Invalid password" });
    }
  });
}); 

route.get("/",isAuthenticated, function(req, res) {
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
  catogery.find().then(function(response){
    res.render("addmanager" , {res:response})
  })
 
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
    res.redirect("/admin/viewMnager" )
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


route.get("/addCatogery" , function(req,res){
  res.render("addCatogory")
})
route.post("/addCatogery" ,function(req,res){
  var info = req.body
  var newCategory = new catogery({
    topic:info.topic
  })
  newCategory.save().then(function(response){
    console.log(response)
    res.redirect("/admin/viewCategory")
  })

})
route.get("/viewCategory" , function(req,res){
  catogery.find().then(function(response){
    res.render("viewCtegory" ,{cat:response})
  })
  
})

route.get("/editCategory/:id" , function(req,res){
  var id = req.params.id
  var info = req.body
  catogery.findById(id).then(function(response){
    res.render("editCategory", {cat:response})
  })
 
})
route.post("/editCategory/:id" , function(req,res){
  var id = req.params.id
  var info = req.body
  catogery.findByIdAndUpdate(id , {
    topic:info.topic
  }).then(function(response){
    res.redirect("/admin/viewCategory")
  })
})

route.get("/delete/:id" , function(req,res){
  id = req.params.id
  catogery.findByIdAndRemove(id).then(function(response){
    res.redirect("/admin/viewCategory")
  })
})
// route.post("/viewCategory" , function(req,res){
  
// })
route.get("/logout", function (req, res) {
  req.session.destroy(function (err) {
    if (err) {
      console.error("Error destroying session:", err);
    }
    res.redirect("/");
  });
});


module.exports = route;
