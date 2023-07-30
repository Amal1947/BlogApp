var mongoose = require("mongoose")
var categoriesScheema = mongoose.Schema({
    topic:String,

})








var catogery = mongoose.model("catogery" , categoriesScheema)

module.exports = catogery