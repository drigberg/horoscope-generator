var express    	= require("express"), 
    app        	= express(), 
    mongoose   	= require("mongoose"),
    Horoscope = require("./models/horoscopes"),
    seeds = require("./seeds.js"),
    bodyParser = require("body-parser"), 
    seedDB      = require("./seeds"),
    port       	= process.env.PORT || 5000;
    

var databaseUrl = "mongodb://admin:cookiecoder@ds011331.mlab.com:11331/horoscope-generator";
// var databaseUrl = "mongodb://localhost:27017/horoscope-generator";
mongoose.connect(databaseUrl);

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set("views", "./src/views");
app.set("view engine", "ejs");
// seedDB();

//ROOT ROUTE
app.get("/", function (req, res){
    Horoscope.find({}, function(err, allHoroscopes){
        if(err){
            console.log(err);
        } else {
                res.render("index", {allHoroscopes:allHoroscopes});
        };
    });
});

//CREATE -- Generate new horoscope
app.post("/", function(req, res){
    //get data from form
    var text = req.body.text;
    var hometown = req.body.hometown;
    var name = req.body.name;
    var date = req.body.date;
    console.log("!!!!!" + date + "!!!!!!");
    var image = "https://i.ytimg.com/vi/tntOCGkgt98/maxresdefault.jpg"
    var newHoroscope = {text : text, image: image, author: name, hometown: hometown, date: date};
    //create new campground, save to DB, and redirect
    Horoscope.create(newHoroscope, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else{
            res.redirect("/");
        };
    });
});

//NEW
app.get("/new", function(req, res){
    res.render("new")
})

//safety net redirect
app.get("*", function (req, res){
    res.redirect("/");
});

app.listen(port, function(err){
    console.log("Horoscope Generator server is running on port " + port);
});