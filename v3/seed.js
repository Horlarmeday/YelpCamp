 var mongoose    = require("mongoose"),
     Campground  = require("./models/campground"),
     Comment     = require("./models/comment");
 
 var data = [
      {
       name: "Triangle Camp",
       image: "http://haulihuvila.com/wp-content/uploads/2012/09/hauli-huvila-campgrounds-lg.jpg",
       description: "This is a nice camp"
      },
      {
       name: "Hexagon Camp",
       image: "http://www.bluerivercampground.ca/wp-content/uploads/2015/11/Tent-Sites-portfolio.jpg",
       description: "This is Hexagon camp!"
      },
      {
       name: "Philints Camp",
       image: "https://www.nationalparks.nsw.gov.au/-/media/npws/images/parks/munmorah-state-conservation-area/background/freemans-campground-background.jpg",
       description: "This is philints camp!"
      }
 ];
 
 function seedDB(){
  //Remove all campgrounds
     Campground.remove({}, function(err){
     if (err){
         console.log(err);
     }
     console.log("removed campgrounds!");
       //Add a few campgrounds
      data.forEach(function(seed){
      Campground.create(seed, function(err, campground){
          if(err){
           console.log(err);
          }else{
           console.log("added a campground");
            //Add a few commments
            Comment.create(
             {text: "This place is great, But there is no internet",
              author: "Arthur"
             }, function(err, comment){
                if(err){
                 console.log(err);
                }else{
                 campground.comments.push(comment);
                 campground.save();
                 console.log("Created a new comment");
                }
             });
          }
        });
     });
  }); 
 }
 
module.exports = seedDB;