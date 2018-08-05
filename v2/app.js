var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose");
     
     mongoose.connect("mongodb://localhost/yelp_camp");
     app.set("view engine", "ejs");
     app.use(bodyParser.urlencoded({extended:true}));
     
  //SET UP SCHEMA
 var campgroundSchema = new mongoose.Schema({
     name: String,
     image:String,
     description: String
 });
 
 //COMPILING THE SCHEMA INTO A MODEL
 var Campground = mongoose.model("Campground", campgroundSchema);

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

var campgrounds = [
            {name: "Spilints Camp", image: "https://cdn.pixabay.com/photo/2016/10/12/17/30/favorite-place-1735241_960_720.jpg"},
            {name: "Garnite Camp", image: "https://cdn.pixabay.com/photo/2016/05/25/08/13/shelter-1414170_960_720.jpg"},
            {name: "Hectord Camp", image: "https://cdn.pixabay.com/photo/2018/04/20/14/52/campground-3336155_960_720.jpg"},
            {name: "Spilints Camp", image: "https://cdn.pixabay.com/photo/2016/10/12/17/30/favorite-place-1735241_960_720.jpg"},
            {name: "Garnite Camp", image: "https://cdn.pixabay.com/photo/2016/05/25/08/13/shelter-1414170_960_720.jpg"},
            {name: "Hectord Camp", image: "https://cdn.pixabay.com/photo/2018/04/20/14/52/campground-3336155_960_720.jpg"}
        ];

            
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
             res.render("index", {campgrounds:allcampgrounds});
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
    res.render("new");
});

//SHOW - show more info about A PARTICULAR CAMPGROUNDS
app.get("/campgrounds/:id", function(req, res) {
    //Showing each campground by its id
    Campground.findById(req.params.id, function(err, foundCampground){
        if (err){
            console.log(err);
        }else{
            //render the campground 
            res.render("show", {campground: foundCampground});
        }
    });
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("YelpCamp v2 server is starting up...");
});