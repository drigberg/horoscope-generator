var express    = require("express"), 
    app        = express(), 
    port = process.env.PORT || 5000;
    
app.use(express.static("public"));
app.set("views", "./src/views");
app.set("view engine", "ejs");

//ROOT ROUTE
app.get("/", function (req, res){
    res.render("index");
});

app.get("*", function (req, res){
    res.redirect("/");
});

app.listen(5000, function(err){
    console.log("Horoscope Generator server is running on port " + port);
});