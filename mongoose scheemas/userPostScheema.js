var mongoose = require("mongoose")

var postScheema = mongoose.Schema({
    title:String,
    articleDiscription:String,
    topic:String,
    content:String,
    approve:Number,
    userid:String,
    date:String,
    name:String
})

var posts = mongoose.model("posts" , postScheema)

module.exports = posts