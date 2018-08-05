var Campground = require("../models/campground");
var Comment = require("../models/comment");

//All middleware goes here
var middlewareObj = {};

//Helper function to check for campground ownership
middlewareObj.checkCampgroundOwnership = function(req, res, next){
       //Checking if user is logged in
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
         if(err){
            req.flash("error", "Campground not found!")
            res.redirect("back");
         }else{
             //does user own campground?
             if(foundCampground.author.id.equals(req.user._id)){
                 next();
             }else{
                 req.flash("error", "You don't permission for that!")
                 res.redirect("back");
             }
          }
       });
   }else{
       req.flash("error", "You need to be logged in to do that!")
       res.redirect("back");
   }
}

//Helper function to check for comment ownership
middlewareObj.checkCommentOwnership = function(req, res, next){
        //Checking if user is logged in
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
         if(err){
            res.redirect("back");
         }else{
             //does user own comment?
             if(foundComment.author.id.equals(req.user._id)){
                 next();
             }else{
                 req.flash("error", "You don't have permission for that!")
                 res.redirect("back");
             }
          }
       });
   }else{
       req.flash("error", "You need to be logged in to do that!")
       res.redirect("back");
   }
}

//Helper function to check if user is logged in
middlewareObj.isLoggedIn = function(req, res, next){
     if(req.isAuthenticated()){
        return next();
    }
    req.flash("error",  "You need to be logged in to do that!")
    res.redirect("/login");
}

module.exports = middlewareObj;
