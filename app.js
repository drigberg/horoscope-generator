var express    	= require("express"), 
    app        	= express(), 
    mongoose   	= require("mongoose"),
    horoscopeModel = require("./models/horoscopes"),
    seeds = require("./seeds.js"),
    seedDB      = require("./seeds")
    port       	= process.env.PORT || 5000;
    

var databaseUrl = "mongodb://admin:cookiecoder@ds011331.mlab.com:11331/horoscope-generator";
// var url = "mongodb://localhost:27017/horoscope-generator";
mongoose.connect(databaseUrl);

app.use(express.static("public"));
app.set("views", "./src/views");
app.set("view engine", "ejs");
// seedDB();

//ROOT ROUTE
app.get("/", function (req, res){
    horoscopeModel.find({}, function(err, allHoroscopes, Horoscope){
        if(err){
            console.log(err);
        } else {
                res.render("index", {allHoroscopes:allHoroscopes, Horoscope:Horoscope});
        };
    });
});

app.get("*", function (req, res){
    res.redirect("/");
});


app.listen(port, function(err){
    console.log("Horoscope Generator server is running on port " + port);
});