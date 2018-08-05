var express               = require("express"),
    app                   = express(),
    bodyParser            = require("body-parser"),
    mongoose              = require("mongoose"),
    passport              = require("passport"),
    LocalStrategy         = require("passport-local"),
    passportLocalStrategy = require("passport-local-mongoose"),
    methodOverride        = require("method-override"),
    Campground            = require("./models/campground"),
    Comment               = require("./models/comment"),
    User                  = require("./models/user"),
    seedDB                = require("./seed");

//Requiring routes    
var commentRoutes     = require("./routes/comments"),
    campgroundRoutes  = require("./routes/campgrounds"),
    indexRoutes       = require("./routes/index");



mongoose.connect("mongodb://localhost/yelp_camp_v10");
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public")); 
app.use(methodOverride("_method"));
// seedDB(); //seed the DB every time 
     
//PASSPORT CONFIGURATION
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

//ROUTE USE
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/", indexRoutes);
     
//SERVER STARTER ROUTE
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("YelpCamp v10 server is starting up...");
});

