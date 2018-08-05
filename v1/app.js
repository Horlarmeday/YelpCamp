var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));

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

//The List of campgrounds
app.get("/campgrounds", function(req, res) {
    res.render("campgrounds", {campgrounds:campgrounds});
});

app.post("/campgrounds", function(req, res){
    var name = req.body.campName; //to get contents of the name from the new page
    var image = req.body.campImage; //to get contents of the image url from the new page
    var newCampground = {name: name, image: image}; //Save as an object into a variable
    console.log(newCampground);
    campgrounds.push(newCampground); //push into campgrounds array
    res.redirect("/campgrounds");
});

app.get("/campgrounds/new", function(req, res) {
    res.render("new");
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("YelpCamp server is starting up...");
});