var express = require("express");
var router  = express.Router();
var User = require("../models/user");
var passport = require("passport");


//LANDING PAGE
router.get("/", function(req, res) {
    res.render("landing");
});



//REGISTER FORM
router.get("/register", function(req, res) {
    res.render("register");
});

//HANDLES THE USER REGISTER
router.post("/register", function(req, res) {
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
router.get("/login", function(req, res) {
    res.render("login");
})

//HANDLES THE USER LOGIN
//app.post("/login", middleware, callback)
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req, res) {
});

//LOGOUT ROUTE
router.get("/logout", function(req, res) {
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

module.exports = router;