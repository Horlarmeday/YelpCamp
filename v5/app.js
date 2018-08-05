var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    Campground  = require("./models/campground"),
    Comment     = require("./models/comment"),
    seedDB      = require("./seed");
    
    
     mongoose.connect("mongodb://localhost/yelp_camp_v5");
     app.set("view engine", "ejs");
     app.use(bodyParser.urlencoded({extended:true}));
     app.use(express.static(__dirname + "/public"));
     //intialize seedDB every time 
     seedDB();
     

// //CREATING A NEW CAMPGROUND
//  Campground.create(
//     {
//         name: "Garnite Camp",
//         image: "https://cdn.pixabay.com/photo/2016/05/25/08/13/shelter-1414170_960_720.jpg",
//         description: "This Garnite camp is the best camp ever! No light and bathrooms"
//     }, 
//     function(err, campground){
//         if(err){
//             console.log(err);
//         }else{
//             console.log("NEWLY CREATED CAMPGROUND");
//             console.log(campground);
//         }
//     }
// );

// var campgrounds = [
//             {name: "Spilints Camp", image: "https://cdn.pixabay.com/photo/2016/10/12/17/30/favorite-place-1735241_960_720.jpg"},
//             {name: "Garnite Camp", image: "https://cdn.pixabay.com/photo/2016/05/25/08/13/shelter-1414170_960_720.jpg"},
//             {name: "Hectord Camp", image: "https://cdn.pixabay.com/photo/2018/04/20/14/52/campground-3336155_960_720.jpg"},
//         ];

            
//Landing page getter
app.get("/", function(req, res) {
    res.render("landing");
});

//INDEX - Show The List of campgrounds
app.get("/campgrounds", function(req, res) {
    //show all the campgrounds in the DB
    Campground.find({}, function(err, allcampgrounds){
        if(err){
            console.log(err);
        }else{
             res.render("campgrounds/index", {campgrounds:allcampgrounds});
        }
    });
   
});

//CREATE - Add new campground to the DB
app.post("/campgrounds", function(req, res){
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

//NEW - Display form to make a new campground
app.get("/campgrounds/new", function(req, res) {
    res.render("campgrounds/new");
});

//SHOW - show more info about A PARTICULAR CAMPGROUNDS
app.get("/campgrounds/:id", function(req, res) {
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


//====================
//   COMMENTS ROUTES
//====================
//NEW COMMENTS ROUTE
app.get("/campgrounds/:id/comments/new", function(req, res) {
    //find campground by id
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        }else{
             res.render("comments/new", {campground: campground});
        }
    });
   
});

//COMMENTS CREATE ROUTE
app.post("/campgrounds/:id/comments", function(req, res){
    //Lookup campgrounds using id
    Campground.findById(req.params.id, function(err, campground) {
        if(err){
            console.log(err);
            res.redirect("/campgrounds")
        }else{
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err)
                }else{
                    campground.comments.push(comment);
                    campground.save(); 
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    })
});


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("YelpCamp v5 server is starting up...");
});