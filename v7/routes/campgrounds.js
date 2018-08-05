var express = require("express");
var router  = express.Router();
var Campground = require("../models/campground");


//INDEX - Show The List of campgrounds
router.get("/", function(req, res) {
    //show all the campgrounds in the DB
    Campground.find({}, function(err, allcampgrounds){
        if(err){
            console.log(err);
        }else{
             res.render("campgrounds/index", {campgrounds:allcampgrounds});
        }
    });
   
});

//NEW - Display form to make a new campground
router.get("/new", function(req, res) {
    res.render("campgrounds/new");
});

//CREATE - Add new campground to the DB
router.post("/", function(req, res){
    var name = req.body.campName; //to get contents of the name from the new page
    var image = req.body.campImage; //to get contents of the image url from the new page
    var desc = req.body.description; 
    var newCampground = {name: name, image: image, description: desc}; //Save as an object into a variable
    //CREATING A NEW NEW CAMPGROUND AND SAVING TO DB
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err)
        }else{
            //Redirecting back to the campgrounds page
            res.redirect("/campgrounds");
        }
    });
});


//SHOW - show more info about A PARTICULAR CAMPGROUNDS
router.get("/:id", function(req, res) {
    //Showing each campground by its id
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if (err){
            console.log(err);
        }else{
            //render the campground 
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});


module.exports = router;