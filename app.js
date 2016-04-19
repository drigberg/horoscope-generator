var express    	= require("express"), 
    app        	= express(), 
    mongoose   	= require("mongoose"),
    horoscope = require("./models/horoscopes"),
    seeds = require("./seeds.js"),
    seedDB      = require("./seeds")
    port       	= process.env.PORT || 5000;
    

var url = "mongodb://admin:cookiecoder@ds011331.mlab.com:11331/horoscope-generator";
// var url = "mongodb://localhost:27017/horoscope-generator";
mongoose.connect(url);

app.use(express.static("public"));
app.set("views", "./src/views");
app.set("view engine", "ejs");
// seedDB();

//ROOT ROUTE
app.get("/", function (req, res){
    horoscope.find({}, function(err, allHoroscopes){
        if(err){
            console.log(err);
        } else {
                res.render("index", {allHoroscopes:allHoroscopes});
        };
    });
});

app.get("*", function (req, res){
    res.redirect("/");
});


app.listen(port, function(err){
    console.log("Horoscope Generator server is running on port " + port);
});