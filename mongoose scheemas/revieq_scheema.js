var mongoose = require("mongoose")
var reviewScheema = mongoose.Schema({
    rate:Number,
    comments:String,
    userName:String,
    postId:String
})

var review = mongoose.model("review" , reviewScheema)
module.exports = review