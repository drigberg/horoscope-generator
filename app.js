var express    	= require("express"),
    app        	= express(),
    mongoose   	= require("mongoose"),
    Horoscope   = require("./models/horoscopes"),
    seeds       = require("./seeds.js"),
    bodyParser  = require("body-parser"),
    seedDB      = require("./seeds"),
    server      = require("http").Server(app);
    io          = require("socket.io")(server);
    port       	= process.env.PORT || 5000;

server.listen(port, function(err){
    console.log("Horoscope Generator server is running on port " + port);
});

var databaseUrl = "mongodb://admin:cookiecoder@ds011331.mlab.com:11331/horoscope-generator";
// var databaseUrl = "mongodb://localhost:27017/horoscope-generator";
mongoose.connect(databaseUrl);

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set("views", "./src/views");
app.set("view engine", "ejs");
// seedDB();

//IO
io.on('connection', function (socket) {
    console.log("socket is connected!");
    socket.on('new_horoscope', function (data) {
        // we tell the client to execute 'new message'
        console.log("received at server!")
        socket.broadcast.emit('new_horoscope', {horoscope: data});
    });
});

//ROOT ROUTE
app.get("/", function (req, res){
  Horoscope.find({}, function(err, allHoroscopes){
      if(err){
          console.log(err);
      } else {
          var horoscopeCount = allHoroscopes.length;
          res.render("index", {horoscopeCount:horoscopeCount});
      };
  });
});

app.get("/horoscopes", function (req, res){
    Horoscope.find({}, function(err, allHoroscopes){
        if(err){
            console.log(err);
        } else {
            allHoroscopes.reverse();
            res.render("horoscopes/index", {allHoroscopes:allHoroscopes});
        };
    });
});

//CREATE -- Generate new horoscope
var newShowPage = "";
app.post("/horoscopes", function(req, res, next){
    var newHoroscope = {
      full_text       : req.body.full_text,
      abridged_text   : req.body.abridged_text,
      image           : req.body.image,
      author          : req.body.name,
      hometown        : req.body.hometown,
      date            : req.body.date,
      sign            : req.body.sign
    };
    Horoscope.create(newHoroscope, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else{
            newShowPage = "/horoscopes/" + newlyCreated._id;
            res.send({redirect: newShowPage});
        };
    });
});

//NEW
app.get("/horoscopes/new", function(req, res){
    res.render("horoscopes/new");
});

//SHOW -- campground details
app.get("/horoscopes/:id", function(req, res){
    Horoscope.findById(req.params.id).exec(function(err, foundHoroscope){
        if(err){
            console.log(err);
        } else {
          res.render("horoscopes/show", {horoscope: foundHoroscope});
        };
    });
});

//safety net redirect
app.get("*", function (req, res){
    res.redirect("/");
});

// app.listen(port, function(err){
//     console.log("Horoscope Generator server is running on port " + port);
// });
