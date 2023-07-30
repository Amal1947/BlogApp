var express = require("express")
var app = express()
var mongoose = require("mongoose")
var bodyParser = require("body-parser")
var home_Rouoter = require("./routes/home")
var user_Router = require("./routes/user")
var User=require('./mongoose scheemas/userscheema')
var admin_Router = require("./routes/admin")
var tmanagre_Router = require("./routes/tmanager")

mongoose.connect("mongodb://127.0.0.1/blog")





app.set("view engine" , "ejs")
app.use(express.static("public/css"))
app.use(express.static("public/image"))
app.use(express.static("public/js"))


app.use(bodyParser.urlencoded({extended:true}))

app.use("/" , home_Rouoter)
app.use("/user" , user_Router)
app.use("/admin" , admin_Router)
app.use("/tmanager" , tmanagre_Router)





app.listen(6900)