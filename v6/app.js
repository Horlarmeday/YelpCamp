var express               = require("express"),
    app                   = express(),
    bodyParser            = require("body-parser"),
    mongoose              = require("mongoose"),
    Campground            = require("./models/campground"),
    Comment               = require("./models/comment"),
    User                  = require("./models/user"),
    passport              = require("passport"),
    LocalStrategy         = require("passport-local"),
    passportLocalStrategy = require("passport-local-mongoose"),
    seedDB                = require("./seed");
    
    
mongoose.connect("mongodb://localhost/yelp_camp_v6");
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public"));
 //intialize seedDB every time 
seedDB();
     
//PASSWORD CONFIGURATION
app.use(require("express-session")({
       secret: "Azeezah is my love",
       resave: false,
       saveUninitialized: false
}));     
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});
     
     

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

            
//LANDING PAGE
app.get("/", function(req, res) {
    res.render("landing");
});

//==================
// CAMPGROUND ROUTES
//==================

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
app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res) {
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
app.post("/campgrounds/:id/comments", isLoggedIn, function(req, res){
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
    });
});

//=============
// AUTH ROUTES
//=============
//REGISTER FORM
app.get("/register", function(req, res) {
    res.render("register");
});

//HANDLES THE USER REGISTER
app.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user) {
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/campgrounds");
        });
    });
});

//LOGIN FORM
app.get("/login", function(req, res) {
    res.render("login");
})

//HANDLES THE USER LOGIN
//app.post("/login", middleware, callback)
app.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req, res) {
});

//LOGOUT ROUTE
app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/campgrounds");
});

//MIDDLEWARE FUNCTION
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("YelpCamp v6 server is starting up...");
});