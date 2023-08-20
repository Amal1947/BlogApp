var express = require("express");
var route = express.Router();
var session = require("express-session");
var User = require("../mongoose scheemas/userscheema");
var posts = require("../mongoose scheemas/userPostScheema")
var catogery = require("../mongoose scheemas/categories_scheema");
const review = require("../mongoose scheemas/revieq_scheema");


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

route.get("/", function (req, res) {
  if (req.session.user) {
    posts.find({approve:1}).then(function(response){
      res.render("UserLogin" , {res:response});
    })
    
  } else {
    res.redirect("/");
  }
});

route.get("/login", function (req, res) {
  res.render("login");
});

route.post("/login", function (req, res) {
  var info = req.body;
  User.findOne({
    email: info.email,
  }).then(function (response) {
    if (!response) {
      res.render("login", { message: "Invalid email..." });
    } else if (response.password === info.password) {
      if (response.approve === 1) {
        req.session.user = response; 
        res.redirect("/user");
      } else {
        res.render("login", { message: "You are not allowed to login ." });
      }
    } else {
      res.render("login", { message: "Invalid password" });
    }
  });
});


route.get("/signup", function (req, res) {
  res.render("signup");
});


route.post("/signup", function (req, res) {
  var userInfo = req.body;
  User.findOne({
    email: userInfo.email,
  }).then(function (response) {
    if (response) {
      res.render("signup", { message: "*user already exist" });
    } else {
      var newUser = new User({
        name: userInfo.username,
        email: userInfo.email,
        password: userInfo.password,
        date: new Date(),
        type: 1,
        approve: 1
      });
      newUser.save().then(function (response) {
        req.session.user = newUser;
        res.redirect("/user");
      });
    }
  });
});

route.get("/logout", function (req, res) {
  req.session.destroy(function (err) {
    if (err) {
      console.error("Error destroying session:", err);
    }
    res.redirect("/");
  });
});


route.get("/createpost" , function(req,res){
  catogery.find()
  .then(function(response){
    res.render("createPost",{res:response})
  })
  
})

route.post("/createpost", function (req, res) {
  var d = new Date();
  var options = { year: "numeric", month: "long", day: "numeric" };
  var formattedDate = d.toLocaleDateString(undefined, options);

  var info = req.body;
  var user_id = req.session.user._id;
  var name = req.session.user.name;
  var newUser = new posts({
    title: info.title,
    articleDiscription: info.articleDescription,
    topic: info.topic,
    content: info.content,
    approve: 0,
    userid: user_id,
    date: formattedDate,
    name: name,
  });
  newUser.save().then(function(response){
    console.log(response)
    res.redirect("/user")
  })

})
route.get("/readmoreUser/:id" , function(req,res){
  var id = req.params.id
  posts.findById(id).then(function(response){
    var postId = response._id
    review.find({postId:postId}).then(function(result){
      
      res.render("readmoreUser" , {res:response,comment:result})
    })
   
  })
  
})

route.get("/managepost" , function(req,res){
 var uid= req.session.user._id
  posts.find({userid:uid}).then(function(response){
    res.render("managePost" , {res:response})
  })
})

route.get("/editPost/:id" , function(req,res){
  var id = req.params.id
  posts.findById(id).then(function(response){
    res.render("editPost" , {res:response})

  })
   
})

route.post("/editPost/:id" , function(req,res){
  var id = req.params.id
  var info = req.body
  posts.findByIdAndUpdate(id , {
    title:info.title,
    articleDiscription:info.articleDescription,
    topic:info.topic,
    content:info.content,
    approve:0
  }).then(function(response){
    res.redirect("/user/managePost")
  })
})
route.get("/deletePost/:id" , function(req,res){
  var id = req.params.id
  posts.findByIdAndRemove(id).then(function(response){
    res.redirect("/user/managePost")
  })
  
})
route.post("/comment/:id" , function(req,res){
  var info = req.body
  var postId=req.params.id
  var userName = req.session.user.name
  console.log(req.session.user)

  var newReview = new review({
    comments:info.comment,
    userName:userName,
    postId:postId

  })
  newReview.save().then(function(response){
    res.redirect(`/user/readmoreUser/${postId}`)
  })
})

module.exports = route;
