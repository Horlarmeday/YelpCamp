 var mongoose = require("mongoose");
  //SET UP SCHEMA
 var campgroundSchema = new mongoose.Schema({
     name: String,
     image:String,
     description: String,
     comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
      }
    ]
 });
 
 //COMPILING THE SCHEMA INTO A MODEL
 module.exports = mongoose.model("Campground", campgroundSchema);