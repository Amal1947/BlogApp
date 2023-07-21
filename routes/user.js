var express = require("express");
var route = express.Router();
var session = require("express-session");
var User = require("../mongoose scheemas/userscheema");


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
    res.render("UserLogin");
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
        approve: 1,
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
  res.send("this is post")
})

module.exports = route;
